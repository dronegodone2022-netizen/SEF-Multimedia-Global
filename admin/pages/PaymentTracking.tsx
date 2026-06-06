import React, { useState, useEffect } from 'react';
import { Plus, Edit, Check, Trash2, Search, Download } from 'lucide-react';
import { Payment, Booking, Client } from '../../types';
import { PaymentService } from '../../services/paymentService';
import { BookingService } from '../../services/bookingService';
import { ClientService } from '../../services/clientService';
import { InvoiceService } from '../../services/invoiceService';
import { FreelancerService } from '../../services/freelancerService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const PaymentTracking: React.FC = () => {
  const searchable = (value: unknown) => String(value ?? '').toLowerCase();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientNames, setClientNames] = useState<{ [key: string]: string }>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<Omit<Payment, 'id' | 'paymentCode' | 'createdAt'>>({
    bookingId: '',
    clientId: '',
    amount: 0,
    paymentMethod: 'cash',
    status: 'pending',
    dueDate: new Date(),
  });

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadPayments();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter(p =>
        searchable(p.paymentCode).includes(query) ||
        searchable(clientNames[p.clientId]).includes(query) ||
        searchable(p.paymentMethod).includes(query) ||
        searchable(p.status).includes(query) ||
        String(p.amount).includes(query)
      );
    }

    setFilteredPayments(filtered);
  }, [searchQuery, payments, statusFilter, clientNames]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const [paymentsData, clientsData, bookingsData] = await Promise.all([
        PaymentService.getAllPayments(),
        ClientService.getAllClients(),
        BookingService.getAllBookings(),
      ]);

      try {
        await FreelancerService.syncAllEligibleCommissions(bookingsData, paymentsData, clientsData);
        await InvoiceService.syncProformaInvoicesForCompletedPayments(paymentsData, bookingsData);
      } catch (invoiceError) {
        console.warn('Unable to sync proforma invoices for completed payments:', invoiceError);
      }

      setPayments(paymentsData);
      setClients(clientsData);
      setBookings(bookingsData);

      const names: { [key: string]: string } = {};
      clientsData.forEach(client => {
        names[client.id] = client.name;
      });
      setClientNames(names);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (!formData.clientId) {
        throw new Error('Please select a client.');
      }
      if (!formData.bookingId) {
        throw new Error('Please select a booking.');
      }
      if (formData.amount <= 0) {
        throw new Error('Amount must be greater than zero.');
      }

      if (editingId) {
        await PaymentService.updatePayment(editingId, formData);
      } else {
        await PaymentService.createPayment(formData);
      }
      await loadPayments();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving payment';
      setError(message);
      console.error('Error saving payment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await PaymentService.markAsPaid(id);
      await loadPayments();
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingId(payment.id);
    const { id, paymentCode, createdAt, ...data } = payment;
    setFormData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        // Note: You might want to add a delete method to PaymentService
        await loadPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      bookingId: '',
      clientId: '',
      amount: 0,
      paymentMethod: 'cash',
      status: 'pending',
      dueDate: new Date(),
    });
    setError('');
  };

  const handleClientChange = (clientId: string) => {
    setFormData({
      ...formData,
      clientId,
      bookingId: '',
      amount: 0,
    });
  };

  const handleBookingChange = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      setFormData({
        ...formData,
        bookingId,
        amount: booking.amount,
        dueDate,
      });
    } else {
      setFormData({ ...formData, bookingId, amount: 0 });
    }
  };

  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generatePaymentsReportPDF(payments, clientNames);
      const filename = `payments-report-${new Date().toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating payments report:', error);
      alert('Failed to generate the payments report. Please try again.');
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCompleted = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBookings = formData.clientId
    ? bookings.filter(b => b.clientId === formData.clientId)
    : bookings;

  const overduePayments = payments.filter(
    p => p.status === 'pending' && new Date(p.dueDate) < new Date()
  );

  if (loading) {
    return <LoadingScreen message="Loading payments..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
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
            <span className="ml-2">Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            SLL {totalPending.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {payments.filter(p => p.status === 'pending').length} payments
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Completed Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            SLL {totalCompleted.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {payments.filter(p => p.status === 'completed').length} payments
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            SLL {(totalPending + totalCompleted).toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {payments.length} total records
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Overdue Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            SLL {overduePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {overduePayments.length} overdue payments
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by payment code or client..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'pending', 'completed', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Payment' : 'Record New Payment'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Client *</span>
                  <select
                    value={formData.clientId}
                    onChange={e => handleClientChange(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.company ? `(${client.company})` : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Booking *</span>
                  <select
                    value={formData.bookingId}
                    onChange={e => handleBookingChange(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select a booking</option>
                    {availableBookings.map(booking => (
                      <option key={booking.id} value={booking.id}>
                        {booking.bookingCode ?? booking.id} - {booking.title || 'Booking'} - SLL {booking.amount.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Amount *</span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Payment Method</span>
                  <select
                    aria-label="Payment Method"
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="mobile-money">Mobile Money</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Due Date</span>
                  <input
                    type="date"
                    aria-label="Due Date"
                    value={new Date(formData.dueDate).toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Payment Status</span>
                  <select
                    aria-label="Payment Status"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {submitting ? (editingId ? 'Saving...' : 'Saving...') : editingId ? 'Update Payment' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-300 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {payment.paymentCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {clientNames[payment.clientId] || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  SLL {payment.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.paymentMethod}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(payment.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleMarkAsPaid(payment.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Mark as paid"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEdit(payment)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit payment"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No payments found.
        </div>
      )}
    </div>
  );
};

export default PaymentTracking;
