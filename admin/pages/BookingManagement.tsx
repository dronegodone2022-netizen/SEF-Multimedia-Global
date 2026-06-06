import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { Booking, Freelancer } from '../../types';
import { BookingService } from '../../services/bookingService';
import { ClientService } from '../../services/clientService';
import { FreelancerService } from '../../services/freelancerService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const BookingManagement: React.FC = () => {
  const searchable = (value: unknown) => String(value ?? '').toLowerCase();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientNames, setClientNames] = useState<{ [key: string]: string }>({});
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [formData, setFormData] = useState<Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'updatedAt'>>({
    clientId: '',
    serviceType: 'photoshoot',
    title: '',
    description: '',
    scheduledDate: new Date(),
    duration: 1,
    amount: 0,
    status: 'pending',
    assignedTo: [],
    referredByFreelancerId: '',
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadBookings();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const filtered = bookings.filter(b =>
        searchable(b.title).includes(query) ||
        searchable(b.bookingCode).includes(query) ||
        searchable(clientNames[b.clientId]).includes(query) ||
        searchable(b.serviceType).includes(query) ||
        searchable(b.status).includes(query) ||
        String(b.amount).includes(query)
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchQuery, bookings, clientNames]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [bookingsData, clientsData, freelancersData] = await Promise.all([
        BookingService.getAllBookings(),
        ClientService.getAllClients(),
        FreelancerService.getAllFreelancers(),
      ]);
      setBookings(bookingsData);
      setFreelancers(freelancersData);

      const names: { [key: string]: string } = {};
      clientsData.forEach(client => {
        names[client.id] = client.name;
      });
      setClientNames(names);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generateBookingsReportPDF(filteredBookings, clientNames);
      const filename = `SEF-Bookings-Report-${new Date().toISOString().split('T')[0]}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const originalBooking = bookings.find(b => b.id === editingId);
      
      if (editingId) {
        const updatedBooking = await BookingService.updateBooking(editingId, formData);

        // Update client's total spent using updated booking object
        await ClientService.updateClientTotalSpent(formData.clientId, [
          ...bookings.filter(b => b.id !== editingId),
          updatedBooking,
        ]);

        if (originalBooking && originalBooking.status !== 'completed' && formData.status === 'completed') {
          await FreelancerService.syncCommissionsForCompletedBooking(updatedBooking);
        }
      } else {
        const createdBooking = await BookingService.createBooking(formData);

        // Update client's total spent for new booking
        await ClientService.updateClientTotalSpent(formData.clientId, [
          ...bookings,
          createdBooking,
        ]);
      }
      await loadBookings();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id);
    const { id, bookingCode, createdAt, updatedAt, ...data } = booking;
    setFormData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        const bookingToDelete = bookings.find(b => b.id === id);
        await BookingService.deleteBooking(id);
        
        // Update client's total spent after deletion
        if (bookingToDelete) {
          const remainingBookings = bookings.filter(b => b.id !== id);
          await ClientService.updateClientTotalSpent(bookingToDelete.clientId, remainingBookings);
        }
        
        await loadBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      serviceType: 'photoshoot',
      title: '',
      description: '',
      scheduledDate: new Date(),
      duration: 1,
      amount: 0,
      status: 'pending',
      assignedTo: [],
      referredByFreelancerId: '',
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  if (loading) {
    return <LoadingScreen message="Loading bookings..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
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
            <span className="ml-2">New Booking</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or booking code..."
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
              {editingId ? 'Edit Booking' : 'Create New Booking'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
                  <select
                    id="clientId"
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="">Select Client *</option>
                    {Object.entries(clientNames).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={e => setFormData({ ...formData, serviceType: e.target.value as any })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="photoshoot">Photography</option>
                    <option value="videography">Videography</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="training">Training</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="referredByFreelancerId" className="block text-sm font-medium text-gray-700 mb-1">Referral Freelancer</label>
                  <select
                    id="referredByFreelancerId"
                    value={formData.referredByFreelancerId || ''}
                    onChange={e => setFormData({ ...formData, referredByFreelancerId: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="">None</option>
                    {freelancers.map(f => (
                      <option key={f.id} value={f.id}>{f.firstName} {f.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
                  <input
                    id="scheduledDate"
                    type="datetime-local"
                    value={new Date(formData.scheduledDate).toISOString().slice(0, 16)}
                    onChange={e => setFormData({ ...formData, scheduledDate: new Date(e.target.value) })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <input
                    id="duration"
                    type="number"
                    placeholder="Duration (hours)"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Create'} Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-700 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Client
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Referral
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Service
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {booking.bookingCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {clientNames[booking.clientId] || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.referredByFreelancerId
                    ? `${freelancers.find(f => f.id === booking.referredByFreelancerId)?.firstName || ''} ${freelancers.find(f => f.id === booking.referredByFreelancerId)?.lastName || ''}`.trim()
                    : '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.serviceType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(booking.scheduledDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  SLL {booking.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    type="button"
                    title="Edit booking"
                    onClick={() => handleEdit(booking)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    title="Delete booking"
                    onClick={() => handleDelete(booking.id)}
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

      {filteredBookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bookings found.
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
