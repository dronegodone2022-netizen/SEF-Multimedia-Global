/**
 * Example: Client Management Component with Google Sheets Integration
 * Shows how to implement CRUD operations with the service
 */

import React, { useState, useEffect } from 'react';
import { clientService } from '../services/googleSheetsService';
import { Plus, Edit2, Trash2, Loader, AlertCircle, Check } from 'lucide-react';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface Client extends ClientFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const ClientManagementExample = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'Active',
  });

  // Fetch all clients
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await clientService.getAll();
      if (response.success) {
        setClients(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch clients');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: any) => {
    if (client) {
      setEditingId(client.id);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: client.address,
        status: client.status as 'Active' | 'Inactive' | 'Pending',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        status: 'Active',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update existing client
        const response = await clientService.update(editingId, formData);
        if (response.success) {
          setSuccess('Client updated successfully');
          await fetchClients();
          handleCloseModal();
        } else {
          setError(response.message || 'Failed to update client');
        }
      } else {
        // Create new client
        const response = await clientService.create(formData);
        if (response.success) {
          setSuccess('Client created successfully');
          await fetchClients();
          handleCloseModal();
        } else {
          setError(response.message || 'Failed to create client');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        const response = await clientService.delete(clientId);
        if (response.success) {
          setSuccess('Client deleted successfully');
          await fetchClients();
        } else {
          setError(response.message || 'Failed to delete client');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Client Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.company}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Active' ? 'bg-green-100 text-green-800' :
                        client.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleOpenModal(client)}
                        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {clients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No clients found. Create your first client!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagementExample;
