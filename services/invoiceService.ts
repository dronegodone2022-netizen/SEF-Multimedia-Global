import { Booking, Commission, Invoice, Payment } from '../types';
import { invoices, commissions } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';

export class InvoiceService {
  static async getAllInvoices(): Promise<Invoice[]> {
    return [...invoices];
  }

  static async getInvoiceById(id: string): Promise<Invoice | undefined> {
    return invoices.find((invoice) => invoice.id === id);
  }

  static async createInvoice(data: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Invoice> {
    const subtotal = data.items.reduce((sum, item) => sum + (item.amount ?? item.quantity * item.unitPrice), 0);
    const tax = data.tax ?? 0;
    const total = data.total ?? subtotal + tax;
    const newInvoice: Invoice = {
      ...data,
      id: IDGenerator.generateId(),
      invoiceNumber: `INV-${Date.now()}`,
      subtotal,
      tax,
      total,
    };

    invoices.push(newInvoice);
    return newInvoice;
  }

  static async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const index = invoices.findIndex((invoice) => invoice.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    invoices[index] = {
      ...invoices[index],
      ...updates,
    };

    return invoices[index];
  }

  static async deleteInvoice(id: string): Promise<boolean> {
    const index = invoices.findIndex((invoice) => invoice.id === id);
    if (index === -1) {
      return false;
    }

    invoices.splice(index, 1);
    return true;
  }

  static async syncProformaInvoicesForCompletedPayments(
    paymentsData: Payment[],
    bookingsData: Booking[]
  ): Promise<number> {
    let createdCount = 0;

    for (const payment of paymentsData) {
      if (payment.status !== 'completed') {
        continue;
      }

      const booking = bookingsData.find((item) => item.id === payment.bookingId);
      if (!booking) {
        continue;
      }

      const existing = invoices.find((invoice) => invoice.bookingId === booking.id && invoice.paymentId === payment.id);
      if (existing) {
        continue;
      }

      await this.createInvoice({
        bookingId: booking.id,
        clientId: booking.clientId,
        paymentId: payment.id,
        invoiceType: 'proforma',
        items: [
          {
            description: booking.title,
            quantity: 1,
            unitPrice: payment.amount,
            amount: payment.amount,
          },
        ],
        subtotal: payment.amount,
        tax: 0,
        total: payment.amount,
        issuedDate: new Date(),
        dueDate: payment.dueDate,
        status: 'draft',
      });

      createdCount += 1;
    }

    return createdCount;
  }

  static async markCommissionsPaidOnInvoice(invoiceId: string, commissionIds: string[]): Promise<Commission[]> {
    const updated: Commission[] = [];

    for (const commissionId of commissionIds) {
      const commission = commissions.find((item) => item.id === commissionId);
      if (!commission) {
        continue;
      }

      commission.status = 'paid';
      commission.paymentDate = new Date();
      if (!commission.commissionCode) {
        commission.commissionCode = `COM-${Date.now()}`;
      }
      updated.push(commission);
    }

    const invoice = invoices.find((item) => item.id === invoiceId);
    if (invoice && invoice.commissionsPaid) {
      invoice.commissionsPaid = [...new Set([...invoice.commissionsPaid, ...commissionIds])];
    } else if (invoice) {
      invoice.commissionsPaid = [...commissionIds];
    }

    return updated;
  }
}
