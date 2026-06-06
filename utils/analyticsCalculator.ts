import { Booking, Client, Commission, DashboardMetrics, Employee, Expense, Freelancer, Payment } from '../types';

export class AnalyticsCalculator {
  static calculateDashboardMetrics(
    bookings: Booking[],
    payments: Payment[],
    clients: Client[],
    expenses: Expense[],
    employees: Employee[],
    freelancers: Freelancer[],
    commissions: Commission[]
  ): DashboardMetrics {
    const totalBookings = bookings.length;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalClients = clients.length;
    const pendingPayments = payments.filter((payment) => payment.status === 'pending').length;
    const completedBookings = bookings.filter((booking) => booking.status === 'completed').length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const expensesThisMonth = expenses
      .map((expense) => ({ ...expense, date: new Date(expense.date) }))
      .filter(
        (expense) =>
          expense.date.getMonth() === currentMonth &&
          expense.date.getFullYear() === currentYear &&
          expense.status === 'approved'
      )
      .reduce((sum, expense) => sum + expense.amount, 0);
    const employeeCount = employees.length;
    const freelancerCount = freelancers.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const completedPayments = payments.filter((payment) => payment.status === 'completed').length;
    const paymentCompletionRate = payments.length > 0 ? (completedPayments / payments.length) * 100 : 0;

    return {
      totalBookings,
      totalRevenue,
      totalClients,
      pendingPayments,
      completedBookings,
      expensesThisMonth,
      employeeCount,
      freelancerCount,
      averageBookingValue,
      paymentCompletionRate,
    };
  }

  static getMonthlyRevenue(bookings: Booking[]): { month: string; revenue: number }[] {
    const monthlyRevenue: Record<string, number> = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.scheduledDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + booking.amount;
    });

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
  }
}
