import { useState, useEffect, type ReactNode, type FC } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import {
  Booking,
  Payment,
  Client,
  Expense,
  Employee,
  Freelancer,
  Commission,
  DashboardMetrics,
} from '../../types';
import { AnalyticsCalculator } from '../../utils/analyticsCalculator';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { BookingService } from '../../services/bookingService';
import { PaymentService } from '../../services/paymentService';
import { ClientService } from '../../services/clientService';
import { ExpenseService } from '../../services/expenseService';
import { EmployeeService } from '../../services/employeeService';
import { FreelancerService } from '../../services/freelancerService';
import LoadingScreen from '../LoadingScreen';

const Dashboard: FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<
    { month: string; revenue: number }[]
  >([]);
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadDashboardData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsData, paymentsData, clientsData, expensesData, employeesData, freelancersData, commissionsData] =
        await Promise.all([
          BookingService.getAllBookings(),
          PaymentService.getAllPayments(),
          ClientService.getAllClients(),
          ExpenseService.getAllExpenses(),
          EmployeeService.getAllEmployees(),
          FreelancerService.getAllFreelancers(),
          FreelancerService.getAllCommissions(),
        ]);

      setBookings(bookingsData);
      setPayments(paymentsData);
      setClients(clientsData);
      setExpenses(expensesData);
      setEmployees(employeesData);
      setFreelancers(freelancersData);
      setCommissions(commissionsData);

      const dashboardMetrics = AnalyticsCalculator.calculateDashboardMetrics(
        bookingsData,
        paymentsData,
        clientsData,
        expensesData,
        employeesData,
        freelancersData,
        commissionsData
      );

      setMetrics(dashboardMetrics);
      setMonthlyRevenue(AnalyticsCalculator.getMonthlyRevenue(bookingsData));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generateDashboardReportPDF(
        reportPeriod,
        reportStartDate,
        reportEndDate,
        reportRevenue,
        reportExpenses,
        reportPayments,
        reportNewClients,
        bookings.length,
        employees.length,
        freelancers.length
      );

      const filename = `SEF-Multimedia-${reportPeriod}-Report-${new Date().toISOString().split('T')[0]}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const getReportStartDate = (period: 'weekly' | 'monthly' | 'yearly'): Date => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    if (period === 'weekly') {
      const day = start.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + mondayOffset);
    } else if (period === 'monthly') {
      start.setDate(1);
    } else {
      start.setMonth(0, 1);
    }

    return start;
  };

  const reportStartDate = getReportStartDate(reportPeriod);
  const reportEndDate = new Date();
  reportEndDate.setHours(23, 59, 59, 999);

  const reportRevenue = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.scheduledDate);
      return bookingDate >= reportStartDate && bookingDate <= reportEndDate;
    })
    .reduce((sum, booking) => sum + booking.amount, 0);

  const reportExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expense.status === 'approved' && expenseDate >= reportStartDate && expenseDate <= reportEndDate;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const reportPayments = payments
    .filter(payment => {
      const paidDate = new Date(payment.paidDate || 0);
      return (
        payment.status === 'completed' &&
        paidDate >= reportStartDate &&
        paidDate <= reportEndDate
      );
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const reportNewClients = clients.filter(client => {
    const createdAt = new Date(client.createdAt);
    return createdAt >= reportStartDate && createdAt <= reportEndDate;
  }).length;

  const formatReportLabel = (period: 'weekly' | 'monthly' | 'yearly') => {
    if (period === 'weekly') return 'Weekly';
    if (period === 'monthly') return 'Monthly';
    return 'Yearly';
  };

  const formatCurrency = (value: number) => `SLL ${value.toFixed(2)}`;

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (!metrics) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load dashboard metrics</p>
        </div>
      </div>
    );
  }

  const StatCard: FC<{
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={metrics.totalBookings}
          icon={<Calendar size={24} className="text-blue-600" />}
          color="border-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`SLL ${metrics.totalRevenue.toFixed(2)}`}
          icon={<DollarSign size={24} className="text-green-600" />}
          color="border-green-500"
        />
        <StatCard
          title="Active Clients"
          value={metrics.totalClients}
          icon={<Users size={24} className="text-purple-600" />}
          color="border-purple-500"
        />
        <StatCard
          title="Pending Payments"
          value={metrics.pendingPayments}
          icon={<CreditCard size={24} className="text-orange-600" />}
          color="border-orange-500"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Completed Bookings"
          value={metrics.completedBookings}
          icon={<BarChart3 size={24} className="text-teal-600" />}
          color="border-teal-500"
        />
        <StatCard
          title="Monthly Expenses"
          value={`SLL ${metrics.expensesThisMonth.toFixed(2)}`}
          icon={<DollarSign size={24} className="text-red-600" />}
          color="border-red-500"
        />
        <StatCard
          title="Avg Booking Value"
          value={`SLL ${metrics.averageBookingValue.toFixed(2)}`}
          icon={<TrendingUp size={24} className="text-indigo-600" />}
          color="border-indigo-500"
        />
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formatReportLabel(reportPeriod)} Report
            </h2>
            <p className="text-sm text-gray-600">
              Showing data from {reportStartDate.toLocaleDateString()} to {reportEndDate.toLocaleDateString()}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['weekly', 'monthly', 'yearly'] as const).map(period => (
              <button
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  reportPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {formatReportLabel(period)}
              </button>
            ))}
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-3">{formatCurrency(reportRevenue)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-5 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Expenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-3">{formatCurrency(reportExpenses)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Payments Received</p>
            <p className="text-2xl font-bold text-gray-900 mt-3">{formatCurrency(reportPayments)}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">New Clients</p>
            <p className="text-2xl font-bold text-gray-900 mt-3">{reportNewClients}</p>
          </div>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employees</span>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.employeeCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Freelancers</span>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.freelancerCount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${metrics.paymentCompletionRate}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {metrics.paymentCompletionRate.toFixed(1)}% Complete
          </p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Revenue Trend
          </h3>
          <div className="flex items-end justify-around space-x-2">
            {monthlyRevenue.slice(-6).map((data, idx) => {
              const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
              const height = (data.revenue / maxRevenue) * 200;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-sm text-gray-600 mb-2">
                    SLL ${(data.revenue / 1000).toFixed(1)}k
                  </div>
                  <div
                    className="bg-blue-500 rounded-t w-12"
                    style={{ height: `${height}px` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">
                    {data.month.split('-')[1]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
