import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { Employee, Expense, PettyCash } from '../../types';
import { ExpenseService } from '../../services/expenseService';
import { EmployeeService } from '../../services/employeeService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const ExpenseTracking: React.FC = () => {
  const searchable = (value: unknown) => String(value ?? '').toLowerCase();
  const [activeTab, setActiveTab] = useState<'expenses' | 'pettyCash'>('expenses');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pettyCash, setPettyCash] = useState<PettyCash[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredItems, setFilteredItems] = useState<Expense[] | PettyCash[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expenseFormData, setExpenseFormData] = useState<Omit<Expense, 'id' | 'expenseCode' | 'createdAt'>>({
    description: '',
    amount: 0,
    category: 'office-supplies',
    date: new Date(),
    status: 'pending',
  });

  const [pettyCashFormData, setPettyCashFormData] = useState<Omit<PettyCash, 'id' | 'code'>>({
    description: '',
    amount: 0,
    type: 'outgoing',
    category: 'office',
    date: new Date(),
    status: 'pending',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, expenses, pettyCash, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, pettyCashData, employeesData] = await Promise.all([
        ExpenseService.getAllExpenses(),
        ExpenseService.getAllPettyCash(),
        EmployeeService.getAllEmployees(),
      ]);
      setExpenses(expensesData);
      setPettyCash(pettyCashData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    const query = searchQuery.trim().toLowerCase();

    if (activeTab === 'expenses') {
      const filtered = query
        ? expenses.filter(e =>
            searchable(e.description).includes(query) ||
            searchable(e.expenseCode).includes(query) ||
            searchable(e.category).includes(query) ||
            searchable(e.status).includes(query) ||
            String(e.amount).includes(query)
          )
        : expenses;
      setFilteredItems(filtered);
    } else {
      const filtered = query
        ? pettyCash.filter(p =>
            searchable(p.description).includes(query) ||
            searchable(p.code).includes(query) ||
            searchable(p.category).includes(query) ||
            searchable(p.type).includes(query) ||
            searchable(p.status).includes(query) ||
            String(p.amount).includes(query)
          )
        : pettyCash;
      setFilteredItems(filtered);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await ExpenseService.updateExpense(editingId, expenseFormData);
      } else {
        await ExpenseService.createExpense(expenseFormData);
      }
      await loadData();
      setShowForm(false);
      setEditingId(null);
      setNotice(editingId ? 'Expense updated.' : 'Expense created.');
      setExpenseFormData({
        description: '',
        amount: 0,
        category: 'office-supplies',
        date: new Date(),
        status: 'pending',
      });
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePettyCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await ExpenseService.updatePettyCash(editingId, pettyCashFormData);
      } else {
        await ExpenseService.createPettyCash(pettyCashFormData);
      }
      await loadData();
      setShowForm(false);
      setEditingId(null);
      setNotice(editingId ? 'Petty cash record updated.' : 'Petty cash record created.');
      setPettyCashFormData({
        description: '',
        amount: 0,
        type: 'outgoing',
        category: 'office',
        date: new Date(),
        status: 'pending',
      });
    } catch (error) {
      console.error('Error saving petty cash:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setActiveTab('expenses');
    setEditingId(expense.id);
    const { id, expenseCode, createdAt, ...data } = expense;
    setExpenseFormData(data);
    setShowForm(true);
  };

  const handleEditPettyCash = (record: PettyCash) => {
    setActiveTab('pettyCash');
    setEditingId(record.id);
    const { id, code, ...data } = record;
    setPettyCashFormData(data);
    setShowForm(true);
  };

  const handleExpenseStatusChange = async (expense: Expense, status: Expense['status']) => {
    try {
      const updatedExpense = await ExpenseService.updateExpense(expense.id, { status });
      await loadData();

      if (expense.category?.toLowerCase() === 'salary' && status === 'approved' && expense.employeeId) {
        const employee = employees.find(record => record.id === expense.employeeId);
        if (employee) {
          const pdfBlob = PDFGenerator.generateEmployeePayslipPDF(employee, updatedExpense);
          const filename = `payslip-${employee.employeeCode}-${new Date(updatedExpense.date).toISOString().slice(0, 10)}.html`;
          PDFGenerator.downloadInvoice(pdfBlob, filename);
        }
      }
    } catch (error) {
      console.error('Error updating expense status:', error);
    }
  };

  const handlePettyCashStatusChange = async (record: PettyCash, status: PettyCash['status']) => {
    try {
      await ExpenseService.updatePettyCash(record.id, { status });
      await loadData();
    } catch (error) {
      console.error('Error updating petty cash status:', error);
    }
  };

  const handleGenerateSalaryExpenses = async () => {
    try {
      setSubmitting(true);
      const result = await ExpenseService.generateMonthlySalaryExpenses(employees, new Date());
      setNotice(
        result.created.length > 0
          ? `Created ${result.created.length} approved salary expense record(s).`
          : 'This month salary expenses already exist for all active employees.'
      );
      await loadData();
      setActiveTab('expenses');
    } catch (error) {
      console.error('Error generating salary expenses:', error);
      setNotice('Failed to generate salary expenses.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await ExpenseService.deleteExpense(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleDeletePettyCash = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await ExpenseService.deletePettyCash(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting petty cash record:', error);
      }
    }
  };

  const handleExportPDF = () => {
    try {
      // Export petty cash only when invoked from petty cash tab
      const pdfBlob = PDFGenerator.generateExpensesReportPDF([], pettyCash);
      const filename = `pettycash-report-${new Date().toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating petty cash report:', error);
      alert('Failed to generate the petty cash report. Please try again.');
    }
  };

  const handleExportPayslip = (expense: Expense) => {
    try {
      if (expense.category.toLowerCase() !== 'salary' || !expense.employeeId) {
        alert('This salary expense is not linked to an employee.');
        return;
      }

      const employee = employees.find(record => record.id === expense.employeeId);
      if (!employee) {
        alert('Employee record not found for this salary payment.');
        return;
      }

      const pdfBlob = PDFGenerator.generateEmployeePayslipPDF(employee, expense);
      const filename = `payslip-${employee.employeeCode}-${new Date(expense.date).toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating payslip:', error);
      alert('Failed to generate the employee payslip. Please try again.');
    }
  };

  const handleExportAllSalaryPayslips = () => {
    try {
      const approvedSalaryExpenses = expenses.filter(
        expense => expense.category?.toLowerCase() === 'salary' && expense.status === 'approved' && expense.employeeId
      );

      if (approvedSalaryExpenses.length === 0) {
        alert('No approved salary expenses found to export.');
        return;
      }

      const pdfBlob = PDFGenerator.generateEmployeePayslipsReportPDF(employees, approvedSalaryExpenses);
      const filename = `salary-payslips-${new Date().toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating salary payslip report:', error);
      alert('Failed to export salary payslips. Please try again.');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading expenses..." />;
  }

  const totalExpenses = expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);
  const salaryExpenses = expenses
    .filter(e => e.status === 'approved' && e.category?.toLowerCase() === 'salary')
    .reduce((sum, e) => sum + e.amount, 0);
  const cashIn = pettyCash
    .filter(p => p.status === 'approved' && p.type === 'incoming')
    .reduce((sum, p) => sum + p.amount, 0);
  const cashOut = pettyCash
    .filter(p => p.status === 'approved' && p.type === 'outgoing')
    .reduce((sum, p) => sum + p.amount, 0);

  const balance = pettyCash
    .filter(p => p.status === 'approved')
    .reduce((balance, p) => {
      return p.type === 'incoming'
        ? balance + p.amount
        : balance - p.amount;
    }, 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Expense & Petty Cash Management</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'expenses'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('pettyCash')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pettyCash'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Petty Cash
        </button>
      </div>

      {/* Summary Cards */}
      {activeTab === 'expenses' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              SLL{totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pending Approval</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              SLL{expenses
                .filter(e => e.status === 'pending')
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{expenses.length}</p>
            <p className="text-xs text-gray-600 mt-2">Salary: SLL {salaryExpenses.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              SLL{balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Cash In</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              SLL{cashIn.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Cash Out</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              SLL{cashOut.toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Pending Approval</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              SLL{pettyCash
                .filter(p => p.status === 'pending')
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{pettyCash.length}</p>
          </div>
        </div>
      )}

      {notice && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {notice}
        </div>
      )}

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 ml-4">
          {activeTab === 'pettyCash' && (
            <button
              onClick={handleExportPDF}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              title="Export petty cash report"
            >
              <Download size={20} />
              <span className="ml-2">Export PDF</span>
            </button>
          )}
          <button
            onClick={handleGenerateSalaryExpenses}
            disabled={submitting}
            className={`flex items-center ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded-lg`}
            title="Create this month salary expenses for active employees"
          >
            <span>Post Salaries</span>
          </button>
          <button
            onClick={handleExportAllSalaryPayslips}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            title="Export all approved salary payslips"
          >
            <span>Export Payslips</span>
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setNotice('');
              setExpenseFormData({
                description: '',
                amount: 0,
                category: 'office-supplies',
                date: new Date(),
                status: 'pending',
              });
              setPettyCashFormData({
                description: '',
                amount: 0,
                type: 'outgoing',
                category: 'office',
                date: new Date(),
                status: 'pending',
              });
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            title={`Add new ${activeTab === 'expenses' ? 'expense' : 'petty cash record'}`}
          >
            <Plus size={20} />
            <span className="ml-2">Add {activeTab === 'expenses' ? 'Expense' : 'Petty Cash'}</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'expenses' ? 'Add Expense' : 'Record Petty Cash'}
            </h2>

            <form
              onSubmit={activeTab === 'expenses' ? handleExpenseSubmit : handlePettyCashSubmit}
              className="space-y-4"
            >
              {activeTab === 'expenses' ? (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Description *"
                    value={expenseFormData.description}
                    onChange={e => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Amount *"
                    value={expenseFormData.amount}
                    onChange={e => setExpenseFormData({ ...expenseFormData, amount: parseFloat(e.target.value) })}
                    required
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <select
                    value={expenseFormData.category}
                    onChange={e => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Expense Category"
                  >
                    <option value="office-supplies">Office Supplies</option>
                    <option value="equipment">Equipment</option>
                    <option value="travel">Travel</option>
                    <option value="salary">Salary</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent">Rent</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="date"
                    value={new Date(expenseFormData.date).toISOString().split('T')[0]}
                    onChange={e => setExpenseFormData({ ...expenseFormData, date: new Date(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Expense Date"
                  />
                  <select
                    value={expenseFormData.employeeId || ''}
                    onChange={e => setExpenseFormData({ ...expenseFormData, employeeId: e.target.value || undefined })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Employee"
                  >
                    <option value="">No employee linked</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} ({employee.employeeCode})
                      </option>
                    ))}
                  </select>
                  <select
                    value={expenseFormData.status}
                    onChange={e => setExpenseFormData({ ...expenseFormData, status: e.target.value as any })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Expense Status"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Description *"
                    value={pettyCashFormData.description}
                    onChange={e => setPettyCashFormData({ ...pettyCashFormData, description: e.target.value })}
                    required
                    className="border border-gray-300 rounded px-3 py-2 col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Amount *"
                    value={pettyCashFormData.amount}
                    onChange={e => setPettyCashFormData({ ...pettyCashFormData, amount: parseFloat(e.target.value) })}
                    required
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <select
                    value={pettyCashFormData.type}
                    onChange={e => setPettyCashFormData({ ...pettyCashFormData, type: e.target.value as any })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Transaction Type"
                  >
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                  <select
                    value={pettyCashFormData.category}
                    onChange={e => setPettyCashFormData({ ...pettyCashFormData, category: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Category"
                  >
                    <option value="office">Office</option>
                    <option value="supplies">Supplies</option>
                    <option value="transport">Transport</option>
                    <option value="meals">Meals</option>
                    <option value="client-service">Client Service</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="date"
                    value={new Date(pettyCashFormData.date).toISOString().split('T')[0]}
                    onChange={e => setPettyCashFormData({ ...pettyCashFormData, date: new Date(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Date"
                  />
                  <select
                    value={pettyCashFormData.status}
                    onChange={e => setPettyCashFormData({ ...pettyCashFormData, status: e.target.value as any })}
                    className="border border-gray-300 rounded px-3 py-2"
                    aria-label="Status"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg`}
                >
                  {editingId ? 'Update' : 'Add'} {activeTab === 'expenses' ? 'Expense' : 'Petty Cash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-300 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              {activeTab === 'pettyCash' && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              )}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'expenses'
              ? (filteredItems as Expense[]).map(expense => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {expense.expenseCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      SLL {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={expense.status}
                        onChange={e => handleExpenseStatusChange(expense, e.target.value as Expense['status'])}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          expense.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : expense.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        type="button"
                        title="Edit expense"
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      {expense.category?.toLowerCase() === 'salary' && (
                        <button
                          type="button"
                          title="Export payslip"
                          onClick={() => handleExportPayslip(expense)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Download size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              : (filteredItems as PettyCash[]).map(record => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {record.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.type === 'incoming'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      SLL {record.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={record.status}
                        onChange={e => handlePettyCashStatusChange(record, e.target.value as PettyCash['status'])}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        type="button"
                        title="Edit record"
                        onClick={() => handleEditPettyCash(record)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        title="Delete record"
                        onClick={() => handleDeletePettyCash(record.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No records found.
        </div>
      )}
    </div>
  );
};

export default ExpenseTracking;
