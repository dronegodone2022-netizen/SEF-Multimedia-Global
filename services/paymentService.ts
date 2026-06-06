import { Payment } from '../types';
import { payments } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';
import { BookingService } from './bookingService';
import { FreelancerService } from './freelancerService';

export class PaymentService {
  static async getAllPayments(): Promise<Payment[]> {
    return [...payments];
  }

  static async getPaymentById(id: string): Promise<Payment | undefined> {
    return payments.find((payment) => payment.id === id);
  }

  static async createPayment(data: Omit<Payment, 'id' | 'paymentCode' | 'createdAt'>): Promise<Payment> {
    const newPayment: Payment = {
      ...data,
      id: IDGenerator.generateId(),
      paymentCode: `PAY-${Date.now()}`,
      createdAt: new Date(),
      paidDate: data.status === 'completed' ? data.paidDate || new Date() : undefined,
    };

    payments.push(newPayment);
    return newPayment;
  }

  static async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const index = payments.findIndex((payment) => payment.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }

    payments[index] = {
      ...payments[index],
      ...updates,
    };

    if (updates.status === 'completed' && !payments[index].paidDate) {
      payments[index].paidDate = new Date();
    }

    return payments[index];
  }

  static async markAsPaid(id: string): Promise<Payment> {
    const payment = payments.find(p => p.id === id);
    if (!payment) throw new Error('Payment not found');
    payment.status = 'completed';
    if (!payment.paidDate) payment.paidDate = new Date();
    // Attempt to create freelancer commission when payment is completed
    try {
      if (payment.bookingId) {
        const booking = await BookingService.getBookingById(payment.bookingId);
        if (booking && booking.referredByFreelancerId) {
          const freelancer = await FreelancerService.getFreelancerById(booking.referredByFreelancerId);
          if (freelancer) {
            // Check existing commission for this booking and freelancer
            const existing = (await FreelancerService.getAllCommissions()).find(
              (c) => c.bookingId === booking.id && c.freelancerId === freelancer.id
            );
            if (!existing) {
              const commissionAmount = Math.round((booking.amount * (freelancer.commissionRate || 0)) / 100);
              await FreelancerService.createCommission({
                freelancerId: freelancer.id,
                bookingId: booking.id,
                amount: commissionAmount,
                status: 'pending',
              });

              // update freelancer total earnings
              await FreelancerService.updateFreelancer(freelancer.id, {
                totalEarnings: (freelancer.totalEarnings || 0) + commissionAmount,
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to create freelancer commission on payment markAsPaid:', err);
    }

    return payment;
  }

  static async deletePayment(id: string): Promise<boolean> {
    const index = payments.findIndex((payment) => payment.id === id);
    if (index === -1) {
      return false;
    }

    payments.splice(index, 1);
    return true;
  }
}
