import { Booking } from '../types';
import { bookings } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';

export class BookingService {
  static async getAllBookings(): Promise<Booking[]> {
    return [...bookings];
  }

  static async getBookingById(id: string): Promise<Booking | undefined> {
    return bookings.find((booking) => booking.id === id);
  }

  static async createBooking(data: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const newBooking: Booking = {
      ...data,
      id: IDGenerator.generateId(),
      bookingCode: `BKG-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    bookings.push(newBooking);
    return newBooking;
  }

  static async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }

    bookings[index] = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date(),
    };

    return bookings[index];
  }

  static async deleteBooking(id: string): Promise<boolean> {
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      return false;
    }

    bookings.splice(index, 1);
    return true;
  }
}
