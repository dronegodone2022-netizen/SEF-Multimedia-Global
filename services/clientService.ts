import { Client, Booking } from '../types';
import { clients } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';

export class ClientService {
  static async getAllClients(): Promise<Client[]> {
    return [...clients];
  }

  static async getClientById(id: string): Promise<Client | undefined> {
    return clients.find((client) => client.id === id);
  }

  static async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent'>): Promise<Client> {
    const newClient: Client = {
      ...data,
      id: IDGenerator.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalSpent: 0,
      status: data.status || 'active',
    } as Client;

    clients.push(newClient);
    return newClient;
  }

  static async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const index = clients.findIndex((client) => client.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }

    clients[index] = {
      ...clients[index],
      ...updates,
      updatedAt: new Date(),
    };

    return clients[index];
  }

  static async deleteClient(id: string): Promise<boolean> {
    const index = clients.findIndex((client) => client.id === id);
    if (index === -1) {
      return false;
    }

    clients.splice(index, 1);
    return true;
  }

  static async updateClientTotalSpent(clientId: string, bookings: Booking[]): Promise<Partial<Client>> {
    const client = clients.find((item) => item.id === clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const totalSpent = bookings
      .filter((booking) => booking.clientId === clientId)
      .reduce((sum, booking) => sum + booking.amount, 0);

    client.totalSpent = totalSpent;
    client.updatedAt = new Date();

    return client;
  }
}
