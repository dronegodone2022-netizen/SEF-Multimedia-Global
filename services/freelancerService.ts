import { Booking, Commission, Freelancer, Client, Payment } from '../types';
import { bookings, commissions, freelancers } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';

export class FreelancerService {
  static async getAllFreelancers(): Promise<Freelancer[]> {
    return [...freelancers];
  }

  static async getAllCommissions(): Promise<Commission[]> {
    return [...commissions];
  }

  static async getFreelancerById(id: string): Promise<Freelancer | undefined> {
    return freelancers.find((item) => item.id === id);
  }

  static async createFreelancer(data: Omit<Freelancer, 'id' | 'freelancerCode' | 'totalEarnings'>): Promise<Freelancer> {
    const newFreelancer: Freelancer = {
      ...data,
      id: IDGenerator.generateId(),
      freelancerCode: `FL-${Date.now()}`,
      totalEarnings: 0,
    } as Freelancer;

    freelancers.push(newFreelancer);
    return newFreelancer;
  }

  static async updateFreelancer(id: string, updates: Partial<Freelancer>): Promise<Freelancer> {
    const index = freelancers.findIndex((freelancer) => freelancer.id === id);
    if (index === -1) {
      throw new Error('Freelancer not found');
    }

    freelancers[index] = {
      ...freelancers[index],
      ...updates,
    };

    return freelancers[index];
  }

  static async deleteFreelancer(id: string): Promise<boolean> {
    const index = freelancers.findIndex((freelancer) => freelancer.id === id);
    if (index === -1) {
      return false;
    }

    freelancers.splice(index, 1);
    return true;
  }

  static async createCommission(data: Omit<Commission, 'id' | 'commissionCode' | 'createdAt'>): Promise<Commission> {
    const newCommission: Commission = {
      ...data,
      id: IDGenerator.generateId(),
      commissionCode: `COM-${Date.now()}`,
      createdAt: new Date(),
      paymentDate: data.paymentDate,
    };

    commissions.push(newCommission);
    return newCommission;
  }

  static async updateCommission(id: string, updates: Partial<Commission>): Promise<Commission> {
    const index = commissions.findIndex((commission) => commission.id === id);
    if (index === -1) {
      throw new Error('Commission not found');
    }

    commissions[index] = {
      ...commissions[index],
      ...updates,
    };

    return commissions[index];
  }

  static async deleteCommission(id: string): Promise<boolean> {
    const index = commissions.findIndex((commission) => commission.id === id);
    if (index === -1) {
      return false;
    }

    commissions.splice(index, 1);
    return true;
  }

  static async syncAllEligibleCommissions(
    bookingsData: Booking[],
    paymentsData: Payment[],
    clientsData: Client[]
  ): Promise<Commission[]> {
    const created: Commission[] = [];

    for (const booking of bookingsData) {
      if (booking.status !== 'completed' || !booking.referredByFreelancerId) {
        continue;
      }

      const existing = commissions.find(
        (commission) => commission.bookingId === booking.id && commission.freelancerId === booking.referredByFreelancerId
      );

      if (existing) {
        continue;
      }

      const freelancer = freelancers.find((item) => item.id === booking.referredByFreelancerId);
      if (!freelancer) {
        continue;
      }

      const commissionAmount = Math.round((booking.amount * freelancer.commissionRate) / 100);
      const commission = await this.createCommission({
        freelancerId: freelancer.id,
        bookingId: booking.id,
        amount: commissionAmount,
        status: 'pending',
      });

      freelancer.totalEarnings += commissionAmount;
      created.push(commission);
    }

    return [...commissions, ...created];
  }

  static async syncCommissionsForCompletedBooking(booking: Booking): Promise<Commission | null> {
    if (booking.status !== 'completed' || !booking.referredByFreelancerId) {
      return null;
    }

    const freelancer = freelancers.find((item) => item.id === booking.referredByFreelancerId);
    if (!freelancer) {
      return null;
    }

    const existing = commissions.find(
      (commission) => commission.bookingId === booking.id && commission.freelancerId === freelancer.id
    );

    if (existing) {
      return existing;
    }

    const commissionAmount = Math.round((booking.amount * freelancer.commissionRate) / 100);
    const commission = await this.createCommission({
      freelancerId: freelancer.id,
      bookingId: booking.id,
      amount: commissionAmount,
      status: 'pending',
    });

    freelancer.totalEarnings += commissionAmount;
    return commission;
  }
}
