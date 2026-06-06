import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Download, Eye, Check } from 'lucide-react';
import { Invoice, Client, Commission } from '../../types';
import { InvoiceService } from '../../services/invoiceService';
import { ClientService } from '../../services/clientService';
import { PaymentService } from '../../services/paymentService';
import { BookingService } from '../../services/bookingService';
import { FreelancerService } from '../../services/freelancerService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import InvoiceTemplate from './InvoiceTemplate';
import LoadingScreen from '../LoadingScreen';

const InvoiceManagement: React.FC = () => {
  const searchable = (value: unknown) => String(value ?? '').toLowerCase();

  // Helper function to calculate due date as 7 days from issued date
  const calculateDueDate = (issuedDate: Date = new Date()) => {
    const dueDate = new Date(issuedDate);
    dueDate.setDate(dueDate.getDate() + 7);
    return dueDate;
  };

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientNames, setClientNames] = useState<{ [key: string]: string }>({});

  const today = new Date();
  const weekLater = calculateDueDate(today);

  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'invoiceNumber'>>({
    bookingId: '',
    clientId: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    issuedDate: today,
    dueDate: weekLater,
    status: 'draft',
    notes: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedCommissions, setSelectedCommissions] = useState<Set<string>>(new Set());
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [markingCommissionsPaid, setMarkingCommissionsPaid] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadInvoices();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const filtered = invoices.filter(i =>
        searchable(i.invoiceNumber).includes(query) ||
        searchable(i.invoiceType).includes(query) ||
        searchable(clientNames[i.clientId]).includes(query) ||
        searchable(i.status).includes(query) ||
        String(i.total).includes(query)
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchQuery, invoices, clientNames]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const [invoicesData, clientsData, paymentsData, bookingsData, freelancersData] = await Promise.all([
        InvoiceService.getAllInvoices(),
        ClientService.getAllClients(),
        PaymentService.getAllPayments(),
        BookingService.getAllBookings(),
        FreelancerService.getAllFreelancers(),
      ]);

      let nextInvoices = invoicesData;
      try {
        await FreelancerService.syncAllEligibleCommissions(bookingsData, paymentsData, clientsData);
        const createdCount = await InvoiceService.syncProformaInvoicesForCompletedPayments(paymentsData, bookingsData);
        if (createdCount > 0) {
          nextInvoices = await InvoiceService.getAllInvoices();
        }
      } catch (invoiceError) {
        console.warn('Unable to sync proforma invoices for completed payments:', invoiceError);
      }

      setInvoices(nextInvoices);
      setAllClients(clientsData);
      setFreelancers(freelancersData);

      const names: { [key: string]: string } = {};
      clientsData.forEach(client => {
        names[client.id] = client.name;
      });
      setClientNames(names);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // Ensure issued date is set to today when creating new invoice
      let invoiceToSubmit = { ...formData };
      
      // Calculate subtotal and total from items
      const calculatedSubtotal = formData.items.reduce((sum, item) => {
        return sum + (item.subtotal || item.unitPrice * item.quantity || 0);
      }, 0);
      
      invoiceToSubmit.subtotal = calculatedSubtotal;
      invoiceToSubmit.total = calculatedSubtotal; // Total equals subtotal (no GST)
      invoiceToSubmit.tax = 0; // No tax/GST
      
      if (!editingId) {
        // For new invoices, set issued date to today
        const today = new Date();
        invoiceToSubmit.issuedDate = today;
        // Set due date to 7 days from today
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 7);
        invoiceToSubmit.dueDate = dueDate;
      }

      if (editingId) {
        await InvoiceService.updateInvoice(editingId, invoiceToSubmit);
      } else {
        await InvoiceService.createInvoice(invoiceToSubmit);
      }
      await loadInvoices();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    const { id, invoiceNumber, ...data } = invoice;
    setFormData(data);
    setShowForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setShowPreview(true);
  };

  const toggleCommissionSelection = (commissionId: string) => {
    setSelectedCommissions(prev => {
      const next = new Set(prev);
      if (next.has(commissionId)) {
        next.delete(commissionId);
      } else {
        next.add(commissionId);
      }
      return next;
    });
  };

  const handleMarkCommissionsPaid = async () => {
    if (!previewInvoice || selectedCommissions.size === 0) {
      return;
    }
    setMarkingCommissionsPaid(true);
    try {
      await InvoiceService.markCommissionsPaidOnInvoice(previewInvoice.id, Array.from(selectedCommissions));
      await loadInvoices();
      setPreviewInvoice(prev => prev ? {
        ...prev,
        commissionsPaid: [...new Set([...(prev.commissionsPaid || []), ...Array.from(selectedCommissions)])],
      } : prev);
      setSelectedCommissions(new Set());
      alert('Selected commissions have been marked as paid.');
    } catch (error) {
      console.error('Error marking commissions paid:', error);
      alert('Failed to mark commissions paid. Please try again.');
    } finally {
      setMarkingCommissionsPaid(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await InvoiceService.deleteInvoice(id);
        await loadInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleExportInvoice = async (invoice: Invoice) => {
    try {
      const client = allClients.find(c => c.id === invoice.clientId);
      const logoDataUrl = await PDFGenerator.getOfficialLogoDataUrl();
      const logoSrc = logoDataUrl || '/src/assests/LOGO.png';

      let html = '';
      html += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + (invoice.invoiceNumber || '') + '</title></head><body style="font-family:Arial, Helvetica, sans-serif;color:#1f2937;padding:20px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">';
      html += '<div style="display:flex;gap:12px;align-items:center">';
      html += '<img src="' + logoSrc + '" alt="logo" style="height:64px" />';
      html += '<div><h2 style="margin:0">SEF Multimedia Global</h2><div style="color:#6b7280">Creative Media, Digital Design & Professional Production</div></div>';
      html += '</div>';
      html += '<div style="text-align:right"><h1 style="margin:0;color:#1e40af">INVOICE</h1><div>Ref: ' + (invoice.invoiceNumber || '') + '</div><div>Date: ' + new Date(invoice.issuedDate).toLocaleDateString() + '</div><div>Due: ' + new Date(invoice.dueDate).toLocaleDateString() + '</div></div>';
      html += '</div>';

      html += '<div style="margin-bottom:20px"><strong>Billed To</strong><div>' + (client?.name || 'Unknown') + '</div><div style="color:#6b7280">' + (client?.address || '') + '</div></div>';

      html += '<table style="width:100%;border-collapse:collapse;margin-bottom:20px"><thead><tr><th style="text-align:left;padding:8px;border:1px solid #e5e7eb">No.</th><th style="text-align:left;padding:8px;border:1px solid #e5e7eb">Description</th><th style="text-align:right;padding:8px;border:1px solid #e5e7eb">Qty</th><th style="text-align:right;padding:8px;border:1px solid #e5e7eb">Unit</th><th style="text-align:right;padding:8px;border:1px solid #e5e7eb">Amount</th></tr></thead><tbody>';

      (invoice.items || []).forEach((item: any, idx: number) => {
        const qty = item.quantity || 1;
        const unit = item.unitPrice || 0;
        const amt = item.subtotal || qty * unit;
        html += '<tr><td style="padding:8px;border:1px solid #e5e7eb">' + (idx + 1) + '</td><td style="padding:8px;border:1px solid #e5e7eb">' + (item.description || '') + '</td><td style="padding:8px;border:1px solid #e5e7eb;text-align:right">' + qty + '</td><td style="padding:8px;border:1px solid #e5e7eb;text-align:right">' + unit.toFixed(2) + '</td><td style="padding:8px;border:1px solid #e5e7eb;text-align:right">' + amt.toFixed(2) + '</td></tr>';
      });

      html += '</tbody></table>';

      html += '<div style="max-width:320px;margin-left:auto">';
      html += '<div style="display:flex;justify-content:space-between;padding:8px;border-top:1px solid #e5e7eb"><div>Subtotal</div><div>Le ' + (invoice.subtotal || 0).toFixed(2) + '</div></div>';
      if (invoice.tax) {
        html += '<div style="display:flex;justify-content:space-between;padding:8px;border-top:1px solid #e5e7eb"><div>Tax</div><div>Le ' + (invoice.tax || 0).toFixed(2) + '</div></div>';
      }
      html += '<div style="display:flex;justify-content:space-between;padding:12px 8px 0 8px;font-weight:bold"><div>Total</div><div>Le ' + (invoice.total || 0).toFixed(2) + '</div></div>';
      html += '</div>';

      html += '<div style="margin-top:24px"><h4 style="margin:0 0 8px 0">Notes</h4>';
      (invoice.notes || '').split('\n').forEach(n => { html += '<p style="margin:6px 0;color:#374151">' + (n || '') + '</p>'; });
      html += '</div>';

      html += '<div style="margin-top:30px;text-align:center;color:#9ca3af;font-size:12px">Generated by SEF Multimedia Global | ' + new Date().toLocaleDateString() + '</div>';

      html += '</body></html>';

      const blob = PDFGenerator.generateHtmlBlob(html);
      PDFGenerator.downloadInvoice(blob, (invoice.invoiceNumber || 'invoice') + '.html');
    } catch (err) {
      console.error('Failed to export invoice:', err);
      alert('Failed to export invoice.');
    }
  };




  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generateInvoicesReportPDF(filteredInvoices, clientNames);
      PDFGenerator.downloadInvoice(pdfBlob, `invoices-report-${new Date().toISOString().slice(0, 10)}.html`);
      alert('Invoice report exported successfully');
    } catch (error) {
      console.error('Error exporting invoices:', error);
      alert('Failed to export invoices. Please try again.');
    }
  };

  const resetForm = () => {
    const today = new Date();
    const weekLater = calculateDueDate(today);
    setFormData({
      bookingId: '',
      clientId: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      issuedDate: today,
      dueDate: weekLater,
      status: 'draft',
      notes: '',
    });
  };

  const getStatusColor = (status: Invoice['status']) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingScreen message="Loading invoices..." />;
  }

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={20} />
            <span className="ml-2">Export PDF</span>
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span className="ml-2">Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            SLL {totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {invoices.filter(i => i.status === 'paid').length} paid
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending Amount</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            SLL {pendingAmount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length} outstanding
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{invoices.length}</p>
          <p className="text-xs text-gray-600 mt-2">
            {invoices.filter(i => i.status === 'draft').length} draft
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by invoice number or client..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.clientId}
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2 col-span-2"
                >
                  <option value="">Select Client *</option>
                  {Object.entries(clientNames).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="date"
                  value={new Date(formData.dueDate).toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                  className="border border-gray-300 rounded px-3 py-2"
                  aria-label="Due Date"
                />
              </div>

              {/* ITEMS SECTION */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
                
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto border border-gray-200 rounded p-3">
                  {formData.items && formData.items.length > 0 ? (
                    formData.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-2 items-end bg-gray-50 p-3 rounded">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-gray-600">Description</label>
                          <input
                            type="text"
                            value={item.description || ''}
                            onChange={e => {
                              const newItems = [...formData.items];
                              newItems[index] = { ...newItems[index], description: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="w-20">
                          <label className="text-xs font-semibold text-gray-600">Qty</label>
                          <input
                            type="number"
                            value={item.quantity || 0}
                            onChange={e => {
                              const newItems = [...formData.items];
                              const qty = parseFloat(e.target.value) || 0;
                              const unitPrice = newItems[index].unitPrice || 0;
                              const amount = qty * unitPrice;
                              newItems[index] = {
                                ...newItems[index],
                                quantity: qty,
                                amount: amount,
                                subtotal: amount,
                              };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div className="w-24">
                          <label className="text-xs font-semibold text-gray-600">Unit Price</label>
                          <input
                            type="number"
                            value={item.unitPrice || 0}
                            onChange={e => {
                              const newItems = [...formData.items];
                              const unitPrice = parseFloat(e.target.value) || 0;
                              const qty = newItems[index].quantity || 0;
                              const amount = qty * unitPrice;
                              newItems[index] = {
                                ...newItems[index],
                                unitPrice: unitPrice,
                                amount: amount,
                                subtotal: amount,
                              };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = formData.items.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No items added yet. Click "Add Item" to start.</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newItems = [
                      ...(formData.items || []),
                      { 
                        description: '', 
                        quantity: 1, 
                        unitPrice: 0, 
                        subtotal: 0,
                        amount: 0
                      },
                    ];
                    setFormData({ ...formData, items: newItems });
                  }}
                  className="w-full px-3 py-2 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 text-sm font-semibold mb-4"
                >
                  + Add Item
                </button>
              </div>

              {/* TOTAL SUMMARY */}
              <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Invoice Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    SLL {(formData.items.reduce((sum, item) => sum + (item.subtotal || item.unitPrice * item.quantity || 0), 0)).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Automatically calculated from items</p>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{editingId ? 'Updating' : 'Creating'}...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update' : 'Create'} Invoice</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-500 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Client
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {invoice.invoiceType === 'proforma' ? 'Proforma' : 'Standard'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {clientNames[invoice.clientId] || 'Unknown Client'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  SLL {invoice.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleViewInvoice(invoice)}
                    className="text-purple-600 hover:text-purple-800"
                    title="View invoice"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleExportInvoice(invoice)}
                    className="text-green-600 hover:text-green-800"
                    title="Export invoice"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(invoice)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit invoice"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete invoice"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No invoices found. {!searchQuery && 'Click "Create Invoice" to add one.'}
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showPreview && previewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto">
            {/* Commission Section */}
            {previewInvoice.commissions && previewInvoice.commissions.length > 0 && (
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Freelancer Commissions</h3>
                <div className="space-y-2">
                  {previewInvoice.commissions.map(commission => {
                    const freelancer = freelancers.find(f => f.id === commission.freelancerId);
                    const isPaid = previewInvoice.commissionsPaid?.includes(commission.id);
                    const isSelected = selectedCommissions.has(commission.id);
                    
                    return (
                      <div key={commission.id} className="flex items-center p-3 bg-gray-50 rounded border">
                        <input
                          type="checkbox"
                          checked={isSelected || isPaid}
                          onChange={() => !isPaid && toggleCommissionSelection(commission.id)}
                          disabled={isPaid}
                          aria-label="Select commission to mark as paid"
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'Unknown Freelancer'}</p>
                          <p className="text-sm text-gray-600">SLL {commission.amount.toFixed(2)} - {commission.status}</p>
                        </div>
                        {isPaid && (
                          <span className="flex items-center text-green-600 font-medium">
                            <Check size={18} className="mr-1" />
                            Paid
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedCommissions.size > 0 && (
                  <button
                    onClick={handleMarkCommissionsPaid}
                    disabled={markingCommissionsPaid}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {markingCommissionsPaid ? 'Marking as Paid...' : `Mark ${selectedCommissions.size} Commission(s) as Paid`}
                  </button>
                )}
              </div>
            )}

            <InvoiceTemplate
              invoiceNumber={previewInvoice.invoiceNumber}
              invoiceDate={new Date(previewInvoice.issuedDate).toLocaleDateString()}
              dueDate={new Date(previewInvoice.dueDate).toLocaleDateString()}
              company={{
                name: 'SEF Multimedia Global',
                address: 'Bo City, Sierra Leone',
                phone: '+232 75 510 770',
                email: 'info@sefmultimedia.com',
              }}
              client={{
                name: clientNames[previewInvoice.clientId] || 'Unknown Client',
                address: allClients.find(c => c.id === previewInvoice.clientId)?.address || 'N/A',
                email: allClients.find(c => c.id === previewInvoice.clientId)?.email,
              }}
              items={previewInvoice.items?.map((item: any) => ({
                description: item.description || '',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                subtotal: item.subtotal || (item.quantity || 1) * (item.unitPrice || 0),
              })) || []}
              subtotal={previewInvoice.subtotal}
              tax={previewInvoice.tax}
              total={previewInvoice.total}
              notes={previewInvoice.notes ? `${previewInvoice.notes}\n80% upfront payment is required to confirm wedding and outdoor bookings. Studio services require 100% payment before\ndelivery.\nBook all scheduled shoots at least 1 week in advance for proper planning.\nExtra services are available and charged separately.` : `\n80% upfront payment is required to confirm wedding and outdoor bookings. Studio services require 100% payment before\ndelivery.\nBook all scheduled shoots at least 1 week in advance for proper planning.\nExtra services are available and charged separately.`}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;

