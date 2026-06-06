import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { Client, Freelancer } from '../../types';
import { ClientService } from '../../services/clientService';
import { BookingService } from '../../services/bookingService';
import { FreelancerService } from '../../services/freelancerService';
import { IDGenerator } from '../../utils/idGenerator';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const ClientManagement: React.FC = () => {
  const searchable = (value: unknown) => String(value ?? '').toLowerCase();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  type ClientForm = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent'>;

  const [formData, setFormData] = useState<ClientForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    referredByFreelancerId: '',
    status: 'active',
  });

  useEffect(() => {
    loadClientsWithTotalSpent();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadClientsWithTotalSpent();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const filtered = clients.filter(
        c =>
          searchable(c.name).includes(query) ||
          searchable(c.email).includes(query) ||
          searchable(c.phone).includes(query) ||
          searchable(c.company).includes(query) ||
          searchable(c.city).includes(query) ||
          searchable(c.status).includes(query)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchQuery, clients]);

  const loadClientsWithTotalSpent = async () => {
    try {
      setLoading(true);
      
      // Load both clients and bookings in parallel
      const [clientsData, bookingsData, freelancersData] = await Promise.all([
        ClientService.getAllClients(),
        BookingService.getAllBookings(),
        FreelancerService.getAllFreelancers(),
      ]);
      
      console.log('Loaded clients:', clientsData);
      console.log('Loaded bookings:', bookingsData);
      
      // Calculate totalSpent for each client based on their bookings
      const clientsWithTotalSpent = clientsData.map(client => {
        const clientBookings = bookingsData.filter(b => b.clientId === client.id);
        const totalSpent = clientBookings.reduce((sum, b) => {
          // Count completed and confirmed bookings toward total spent
          if (b.status === 'completed' || b.status === 'confirmed') {
            return sum + (b.amount || 0);
          }
          return sum;
        }, 0);
        
        return {
          ...client,
          totalSpent: totalSpent,
        };
      });
      
      // Validate data structure
      const validClients = clientsWithTotalSpent.filter(client => {
        if (!client || typeof client !== 'object') {
          console.warn('Invalid client object:', client);
          return false;
        }
        if (!client.id || !client.name || !client.email) {
          console.warn('Client missing required fields:', client);
          return false;
        }
        return true;
      });
      
      setBookings(bookingsData);
      setFreelancers(freelancersData);
      setClients(validClients);
    } catch (error) {
      console.error('Error loading clients and bookings:', error);
      setClients([]);
      setBookings([]);
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
        await ClientService.updateClient(editingId, formData);
      } else {
        await ClientService.createClient(formData);
      }
      await loadClientsWithTotalSpent();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving client';
      console.error('Error saving client:', error);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    // Only include form input fields
    const formFields = {
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      country: client.country || '',
      referredByFreelancerId: client.referredByFreelancerId || '',
      status: client.status || 'active',
    };
    setFormData(formFields);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await ClientService.deleteClient(id);
        await loadClientsWithTotalSpent();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      referredByFreelancerId: '',
      status: 'active',
    });
  };

  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generateClientsReportPDF(clients);
      const filename = `clients-report-${new Date().toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating client report:', error);
      alert('Failed to generate the client report. Please try again.');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading clients..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
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
            <span className="ml-2">Add Client</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <div>
                  <label htmlFor="referredByFreelancerId" className="sr-only">Referral Freelancer</label>
                  <select
                    id="referredByFreelancerId"
                    value={formData.referredByFreelancerId || ''}
                    onChange={e => setFormData({ ...formData, referredByFreelancerId: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="">Referred by Freelancer (optional)</option>
                    {freelancers.map(f => (
                      <option key={f.id} value={f.id}>{f.firstName} {f.lastName}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company || ''}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city || ''}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state || ''}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.zipCode || ''}
                  onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country || ''}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg`}
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create') + ' Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-700 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Referral
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{client.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{client.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{client.phone || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.referredByFreelancerId
                    ? `${freelancers.find(f => f.id === client.referredByFreelancerId)?.firstName || ''} ${freelancers.find(f => f.id === client.referredByFreelancerId)?.lastName || ''}`.trim()
                    : '—'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {client.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  SLL {client.totalSpent ? Number(client.totalSpent).toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
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

      {filteredClients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No clients found. {!searchQuery && 'Click "Add Client" to create one.'}
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
