import React, { useState, useEffect, FC } from 'react';
import { Download, Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { Expense } from '../../types';
import { ExpenseService } from '../../services/expenseService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const ExpenseReporting: FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [reportedExpenses, setReportedExpenses] = useState<Expense[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    average: 0,
    highest: 0,
    byCategory: {} as Record<string, number>,
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      generateReport();
    }
  }, [period, expenses]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await ExpenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (selectedPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly'): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    if (selectedPeriod === 'daily') {
      // Today only
      return { start, end: new Date(now.setHours(23, 59, 59, 999)) };
    } else if (selectedPeriod === 'weekly') {
      // Current week (Monday to Sunday)
      const day = start.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + mondayOffset);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else if (selectedPeriod === 'monthly') {
      // Current month
      start.setDate(1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else {
      // Current year
      start.setMonth(0, 1);
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  };

  const generateReport = () => {
    const range = getDateRange(period);
    setDateRange(range);

    // Filter only approved expenses within the date range
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expense.status === 'approved' && expenseDate >= range.start && expenseDate <= range.end;
    });

    setReportedExpenses(filtered);

    // Calculate statistics
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    const count = filtered.length;
    const average = count > 0 ? total / count : 0;
    const highest = count > 0 ? Math.max(...filtered.map(e => e.amount)) : 0;

    const categoryTotals: Record<string, number> = {};
    filtered.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    setStats({
      total,
      count,
      average,
      highest,
      byCategory: categoryTotals,
    });
  };

  const handleExportPDF = () => {
    if (!dateRange) return;

    try {
      const blob = PDFGenerator.generateSeparateExpenseReportPDF(
        expenses,
        period,
        dateRange.start,
        dateRange.end
      );

      const filename = `SEF-Multimedia-Expenses-${period}-${new Date().toISOString().split('T')[0]}.html`;
      PDFGenerator.downloadInvoice(blob, filename);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const formatCurrency = (value: number) => `SLL ${value.toFixed(2)}`;

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return 'Today';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      case 'yearly':
        return 'This Year';
      default:
        return '';
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading expense data..." />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Reports</h1>
          <p className="text-gray-600">Generate and export expense reports for different time periods (excluding petty cash)</p>
        </div>

        {/* Period Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Report Period</h2>
          <div className="flex flex-wrap gap-3">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Display */}
        {dateRange && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {getPeriodLabel()} Report: {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.total)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Transactions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.count}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingDown size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Expense</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.average)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Highest Expense</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.highest)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <DollarSign size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mb-8">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Download size={20} />
            Export Report as PDF
          </button>
        </div>

        {/* Category Breakdown */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.byCategory).map(([category, amount]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm font-medium capitalize">{category}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(amount as number)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Details Table */}
        {reportedExpenses.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Expense Details ({reportedExpenses.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{expense.expenseCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium capitalize">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold text-right">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td colSpan={4} className="px-6 py-4 text-right text-gray-900">
                      TOTAL:
                    </td>
                    <td className="px-6 py-4 text-right text-blue-900">{formatCurrency(stats.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No approved expenses found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseReporting;
