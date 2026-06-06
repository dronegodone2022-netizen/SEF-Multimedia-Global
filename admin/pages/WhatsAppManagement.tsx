import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Phone, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { WhatsAppService } from '../../services/whatsappService';
import { ClientService } from '../../services/clientService';
import { Client } from '../../types';

const WhatsAppManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientData = await ClientService.getAllClients();
      setClients(clientData);
    } catch (error) {
      console.error('Error loading clients:', error);
      showNotification('error', 'Failed to load clients');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showNotification('error', 'Please enter a message');
      return;
    }

    const targetPhone = selectedClient?.phone || phoneNumber;
    if (!targetPhone) {
      showNotification('error', 'Please select a client or enter a phone number');
      return;
    }

    setIsLoading(true);
    try {
      const success = await WhatsAppService.sendMessage(targetPhone, message);
      if (success) {
        showNotification('success', 'Message sent successfully');
        setMessage('');
        // Add to message history
        setMessageHistory(prev => [{
          id: Date.now(),
          to: targetPhone,
          message: message,
          timestamp: new Date().toISOString(),
          status: 'sent'
        }, ...prev]);
      } else {
        showNotification('error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('error', 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBookingConfirmation = async () => {
    if (!selectedClient) {
      showNotification('error', 'Please select a client');
      return;
    }

    setIsLoading(true);
    try {
      const message = `✅ Booking Confirmed!\n\nDear ${selectedClient.name},\n\nYour booking with SEF Multimedia Global has been confirmed.\n\nThank you for choosing our services!`;
      const success = await WhatsAppService.sendMessage(selectedClient.phone, message);
      if (success) {
        showNotification('success', 'Booking confirmation sent successfully');
        setMessageHistory(prev => [{
          id: Date.now(),
          to: selectedClient.phone,
          message: 'Booking confirmation',
          timestamp: new Date().toISOString(),
          status: 'sent'
        }, ...prev]);
      } else {
        showNotification('error', 'Failed to send booking confirmation');
      }
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      showNotification('error', 'Failed to send booking confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPaymentReminder = async () => {
    if (!selectedClient) {
      showNotification('error', 'Please select a client');
      return;
    }

    setIsLoading(true);
    try {
      const message = `💳 Payment Reminder\n\nDear ${selectedClient.name},\n\nThis is a friendly reminder about your outstanding payment with SEF Multimedia Global.\n\nPlease complete your payment to avoid any delays in service delivery.`;
      const success = await WhatsAppService.sendMessage(selectedClient.phone, message);
      if (success) {
        showNotification('success', 'Payment reminder sent successfully');
        setMessageHistory(prev => [{
          id: Date.now(),
          to: selectedClient.phone,
          message: 'Payment reminder',
          timestamp: new Date().toISOString(),
          status: 'sent'
        }, ...prev]);
      } else {
        showNotification('error', 'Failed to send payment reminder');
      }
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      showNotification('error', 'Failed to send payment reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setPhoneNumber(client.phone);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Management</h1>
        <p className="text-gray-600">Send WhatsApp messages to clients and manage communications</p>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Composer */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Send Message
          </h2>

          {/* Client Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Client (Optional)
            </label>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                if (client) handleClientSelect(client);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Message Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>

            {selectedClient && (
              <>
                <button
                  onClick={handleSendBookingConfirmation}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Booking Confirmation
                </button>

                <button
                  onClick={handleSendPaymentReminder}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Payment Reminder
                </button>
              </>
            )}
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Recent Messages
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messageHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages sent yet</p>
            ) : (
              messageHistory.map((msg) => (
                <div key={msg.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm font-medium">{msg.to}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                  <div className="mt-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{msg.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Configuration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              import.meta.env.VITE_WHATSAPP_API_KEY ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm">
              WhatsApp API Key: {import.meta.env.VITE_WHATSAPP_API_KEY ? 'Configured' : 'Not Configured'}
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              import.meta.env.VITE_WHATSAPP_PHONE_ID ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm">
              WhatsApp Phone ID: {import.meta.env.VITE_WHATSAPP_PHONE_ID ? 'Configured' : 'Not Configured'}
            </span>
          </div>
        </div>
        {(!import.meta.env.VITE_WHATSAPP_API_KEY || !import.meta.env.VITE_WHATSAPP_PHONE_ID) && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ WhatsApp integration requires API configuration. Add VITE_WHATSAPP_API_KEY and VITE_WHATSAPP_PHONE_ID to your .env.local file.
          </p>
        )}
      </div>
    </div>
  );
};

export default WhatsAppManagement;