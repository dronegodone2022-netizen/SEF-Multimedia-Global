import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Download, Check } from 'lucide-react';
import { Freelancer, Commission, Booking } from '../../types';
import { FreelancerService } from '../../services/freelancerService';
import { BookingService } from '../../services/bookingService';
import { PaymentService } from '../../services/paymentService';
import { ClientService } from '../../services/clientService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const FreelancerManagement: React.FC = () => {
  const searchable = (value: unknown) => String(value ?? '').toLowerCase();
  const [tab, setTab] = useState<'freelancers' | 'commissions'>('freelancers');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Freelancer, 'id' | 'freelancerCode'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: [],
    commissionRate: 20,
    totalEarnings: 0,
    status: 'active',
    joinDate: new Date(),
  });

  // Commission management state
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [commissionSearchQuery, setCommissionSearchQuery] = useState('');
  const [showCommissionForm, setShowCommissionForm] = useState(false);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [commissionFormData, setCommissionFormData] = useState<Omit<Commission, 'id' | 'commissionCode'>>({
    freelancerId: '',
    bookingId: '',
    amount: 0,
    status: 'pending',
    paymentDate: undefined,
    createdAt: new Date(),
  });

  useEffect(() => {
    loadFreelancers();
    loadBookings();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadFreelancers();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const filtered = freelancers.filter(f =>
        searchable(`${f.firstName ?? ''} ${f.lastName ?? ''}`).includes(query) ||
        searchable(f.freelancerCode).includes(query) ||
        searchable(f.email).includes(query) ||
        searchable(f.phone).includes(query) ||
        searchable(f.status).includes(query) ||
        searchable(Array.isArray(f.specialization) ? f.specialization.join(' ') : f.specialization).includes(query)
      );
      setFilteredFreelancers(filtered);
    } else {
      setFilteredFreelancers(freelancers);
    }
  }, [searchQuery, freelancers]);

  useEffect(() => {
    if (tab === 'commissions') {
      loadCommissions();
    }
  }, [tab]);

  useEffect(() => {
    const query = commissionSearchQuery.trim().toLowerCase();
    if (query) {
      const filtered = commissions.filter(c => {
        const freelancer = freelancers.find(f => f.id === c.freelancerId);
        const booking = bookings.find(b => b.id === c.bookingId);
        return (
          searchable(c.commissionCode).includes(query) ||
          searchable(freelancer?.firstName ?? '').includes(query) ||
          searchable(freelancer?.lastName ?? '').includes(query) ||
          searchable(booking?.title ?? '').includes(query) ||
          searchable(c.status).includes(query) ||
          searchable(c.amount.toString()).includes(query)
        );
      });
      setFilteredCommissions(filtered);
    } else {
      setFilteredCommissions(commissions);
    }
  }, [commissionSearchQuery, commissions, freelancers, bookings]);

  const loadFreelancers = async () => {
    try {
      setLoading(true);
      const data = await FreelancerService.getAllFreelancers();
      setFreelancers(data);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await BookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const loadCommissions = async () => {
    try {
      setLoading(true);
      const [bookingsData, paymentsData, clientsData] = await Promise.all([
        BookingService.getAllBookings(),
        PaymentService.getAllPayments(),
        ClientService.getAllClients(),
      ]);
      await FreelancerService.syncAllEligibleCommissions(bookingsData, paymentsData, clientsData);
      const data = await FreelancerService.getAllCommissions();
      setBookings(bookingsData);
      setCommissions(data);
      setFilteredCommissions(data);
    } catch (error) {
      console.error('Error loading commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingId) {
        await FreelancerService.updateFreelancer(editingId, formData);
      } else {
        await FreelancerService.createFreelancer(formData);
      }
      await loadFreelancers();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving freelancer';
      console.error('Error saving freelancer:', error);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (freelancer: Freelancer) => {
    setEditingId(freelancer.id);
    const { id, freelancerCode, ...data } = freelancer;
    setFormData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        // Add delete method if needed
        await loadFreelancers();
      } catch (error) {
        console.error('Error deleting freelancer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: [],
      commissionRate: 20,
      totalEarnings: 0,
      status: 'active',
      joinDate: new Date(),
    });
  };

  // Commission handlers
  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!commissionFormData.freelancerId || !commissionFormData.bookingId) {
        throw new Error('Please select both Freelancer and Booking');
      }

      // Calculate amount if not manually entered
      let commissionAmount = commissionFormData.amount;
      if (!commissionAmount || commissionAmount === 0) {
        const booking = bookings.find(b => b.id === commissionFormData.bookingId);
        const freelancer = freelancers.find(f => f.id === commissionFormData.freelancerId);
        if (!booking || !freelancer) {
          throw new Error('Selected booking or freelancer not found');
        }
        commissionAmount = booking.amount * (freelancer.commissionRate / 100);
      }

      if (editingCommissionId) {
        await FreelancerService.updateCommission(editingCommissionId, {
          ...commissionFormData,
          amount: commissionAmount,
        });
      } else {
        await FreelancerService.createCommission({
          ...commissionFormData,
          amount: commissionAmount,
        });
      }

      await loadCommissions();
      setShowCommissionForm(false);
      setEditingCommissionId(null);
      resetCommissionForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving commission';
      console.error('Error saving commission:', error);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommissionEdit = (commission: Commission) => {
    setEditingCommissionId(commission.id);
    const { id, commissionCode, ...data } = commission;
    setCommissionFormData(data);
    setShowCommissionForm(true);
  };

  const handleCommissionDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this commission?')) {
      try {
        await FreelancerService.deleteCommission(id);
        await loadCommissions();
      } catch (error) {
        console.error('Error deleting commission:', error);
        setError('Failed to delete commission');
      }
    }
  };

  const handleCommissionStatusChange = async (id: string, newStatus: 'pending' | 'processed' | 'paid') => {
    try {
      const commission = commissions.find(c => c.id === id);
      if (!commission) return;

      const updatedCommission = {
        ...commission,
        status: newStatus,
        paymentDate: newStatus === 'paid' ? new Date() : commission.paymentDate,
      };
      const { id: _, commissionCode: __, ...data } = updatedCommission;
      await FreelancerService.updateCommission(id, data);
      await loadCommissions();
    } catch (error) {
      console.error('Error updating commission status:', error);
      setError('Failed to update commission status');
    }
  };

  const resetCommissionForm = () => {
    setCommissionFormData({
      freelancerId: '',
      bookingId: '',
      amount: 0,
      status: 'pending',
      paymentDate: undefined,
      createdAt: new Date(),
    });
  };

  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generateFreelancersReportPDF(freelancers);
      const filename = `freelancers-report-${new Date().toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating freelancers report:', error);
      alert('Failed to generate the freelancer report. Please try again.');
    }
  };

  const handleExportPaidCommissionsProforma = async () => {
    try {
      const paidCommissions = filteredCommissions.filter(commission => commission.status === 'paid');
      if (paidCommissions.length === 0) {
        alert('No paid commissions to export.');
        return;
      }
      const pdfBlob = await PDFGenerator.generatePaidCommissionsProformaPDFFile(
        paidCommissions,
        freelancers,
        bookings
      );
      const filename = `paid-freelancer-commissions-proforma-${new Date().toISOString().slice(0, 10)}.pdf`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating paid commissions proforma:', error);
      alert('Failed to generate the paid commissions proforma. Please try again.');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading freelancers..." />;
  }

  const totalEarnings = freelancers.reduce((sum, f) => sum + f.totalEarnings, 0);
  
  const totalPendingCommissions = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalProcessedCommissions = commissions
    .filter(c => c.status === 'processed')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalPaidCommissions = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const autoCommissionEnabled = bookings.some(b =>
    b.status === 'completed' && commissions.some(c => c.bookingId === b.id)
  );
  const showAddCommissionButton = !autoCommissionEnabled;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Management</h1>
        <div className="flex gap-2">
          {tab === 'freelancers' && (
            <>
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
                <span className="ml-2">Add Freelancer</span>
              </button>
            </>
          )}
          {tab === 'commissions' && showAddCommissionButton && (
            <>
              <button
                onClick={handleExportPaidCommissionsProforma}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download size={20} />
                <span className="ml-2">Paid Proforma</span>
              </button>
              <button
                onClick={() => {
                  setShowCommissionForm(true);
                  setEditingCommissionId(null);
                  resetCommissionForm();
                }}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                <span className="ml-2">Add Commission</span>
              </button>
            </>
          )}
          {tab === 'commissions' && !showAddCommissionButton && (
            <button
              onClick={handleExportPaidCommissionsProforma}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download size={20} />
              <span className="ml-2">Paid Proforma</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setTab('freelancers')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            tab === 'freelancers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Freelancers
        </button>
        <button
          onClick={() => setTab('commissions')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            tab === 'commissions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Commissions
        </button>
      </div>

      {/* Freelancers Tab */}
      {tab === 'freelancers' && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Freelancers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{freelancers.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                SLL{totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm">Active Freelancers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {freelancers.filter(f => f.status === 'active').length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Freelancer' : 'Add New Freelancer'}
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">First Name *</span>
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Last Name *</span>
                  <input
                    type="text"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Email *</span>
                  <input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Phone *</span>
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Commission Rate (%)</span>
                  <input
                    type="number"
                    placeholder="Commission Rate (%)"
                    value={formData.commissionRate}
                    onChange={e => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Specializations (comma separated)</span>
                  <input
                    type="text"
                    placeholder="Specializations (comma separated)"
                    value={formData.specialization.join(', ')}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value.split(',').map(s => s.trim()) })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Join Date</span>
                  <input
                    type="date"
                    value={new Date(formData.joinDate).toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, joinDate: new Date(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                  className={`px-4 py-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg`}
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create') + ' Freelancer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Freelancers Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-amber-200 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Specialization</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Commission</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Earnings</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFreelancers.map(freelancer => (
              <tr key={freelancer.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {freelancer.freelancerCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {freelancer.firstName} {freelancer.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{freelancer.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {freelancer.specialization.join(', ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {freelancer.commissionRate}%
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  SLL {freelancer.totalEarnings.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      freelancer.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {freelancer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    type="button"
                    title="Edit freelancer"
                    onClick={() => handleEdit(freelancer)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    title="Delete freelancer"
                    onClick={() => handleDelete(freelancer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFreelancers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No freelancers found.
        </div>
      )}
        </>
      )}

      {/* Commissions Tab */}
      {tab === 'commissions' && (
        <>
          {/* Commission Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm">Pending Commissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                SLL{totalPendingCommissions.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm">Processed Commissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                SLL{totalProcessedCommissions.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Paid Commissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                SLL{totalPaidCommissions.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Commissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                SLL{(totalPendingCommissions + totalProcessedCommissions + totalPaidCommissions).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Commission Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by commission code, freelancer name, or booking..."
                value={commissionSearchQuery}
                onChange={e => setCommissionSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Commission Form Modal */}
          {showCommissionForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">
                  {editingCommissionId ? 'Edit Commission' : 'Add New Commission'}
                </h2>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleCommissionSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Freelancer *</span>
                    <select
                      value={commissionFormData.freelancerId}
                      onChange={e => setCommissionFormData({ ...commissionFormData, freelancerId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                      required
                    >
                      <option value="">Select Freelancer</option>
                      {freelancers.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.firstName} {f.lastName} ({f.commissionRate}%)
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Booking *</span>
                    <select
                      value={commissionFormData.bookingId}
                      onChange={e => setCommissionFormData({ ...commissionFormData, bookingId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                      required
                    >
                      <option value="">Select Booking</option>
                      {bookings.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.title} - SLL{b.amount.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Amount (Leave empty to auto-calculate)</span>
                    <input
                      type="number"
                      placeholder="Amount (optional)"
                      value={commissionFormData.amount || ''}
                      onChange={e => setCommissionFormData({ ...commissionFormData, amount: parseFloat(e.target.value) || 0 })}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <select
                      value={commissionFormData.status}
                      onChange={e => setCommissionFormData({ ...commissionFormData, status: e.target.value as 'pending' | 'processed' | 'paid' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processed">Processed</option>
                      <option value="paid">Paid</option>
                    </select>
                  </label>

                  {commissionFormData.status === 'paid' && (
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Payment Date</span>
                      <input
                        type="date"
                        value={commissionFormData.paymentDate ? new Date(commissionFormData.paymentDate).toISOString().split('T')[0] : ''}
                        onChange={e => setCommissionFormData({ ...commissionFormData, paymentDate: e.target.value ? new Date(e.target.value) : undefined })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                    </label>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Commission'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommissionForm(false);
                        setEditingCommissionId(null);
                        resetCommissionForm();
                      }}
                      className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Commission Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freelancer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommissions.map(commission => {
                  const freelancer = freelancers.find(f => f.id === commission.freelancerId);
                  const booking = bookings.find(b => b.id === commission.bookingId);
                  const statusColor = {
                    pending: 'bg-red-100 text-red-800',
                    processed: 'bg-yellow-100 text-yellow-800',
                    paid: 'bg-green-100 text-green-800',
                  };

                  return (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{commission.commissionCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking ? booking.title : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        SLL{commission.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={commission.status}
                          onChange={(e) => handleCommissionStatusChange(commission.id, e.target.value as 'pending' | 'processed' | 'paid')}
                          className={`px-2 py-1 rounded text-xs font-medium ${statusColor[commission.status]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processed">Processed</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {commission.paymentDate ? new Date(commission.paymentDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          type="button"
                          title="Edit commission"
                          onClick={() => handleCommissionEdit(commission)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          type="button"
                          title="Delete commission"
                          onClick={() => handleCommissionDelete(commission.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCommissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No commissions found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreelancerManagement;
