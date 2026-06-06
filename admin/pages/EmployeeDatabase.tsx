import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { Employee } from '../../types';
import { EmployeeService } from '../../services/employeeService';
import { ExpenseService } from '../../services/expenseService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingScreen from '../LoadingScreen';

const EmployeeDatabase: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [payrollMessage, setPayrollMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'employeeCode'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    hireDate: new Date(),
    salary: 0,
    status: 'active',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      loadEmployees();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = employees.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.includes(searchQuery)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingId) {
        await EmployeeService.updateEmployee(editingId, formData);
      } else {
        await EmployeeService.createEmployee(formData);
      }
      await loadEmployees();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving employee';
      console.error('Error saving employee:', error);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    const { id, employeeCode, ...data } = employee;
    setFormData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await EmployeeService.deleteEmployee(id);
        await loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      hireDate: new Date(),
      salary: 0,
      status: 'active',
    });
  };

  const handleExportPDF = () => {
    try {
      const pdfBlob = PDFGenerator.generateEmployeesReportPDF(employees);
      const filename = `employees-report-${new Date().toISOString().slice(0, 10)}.html`;
      PDFGenerator.downloadInvoice(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating employee report:', error);
      alert('Failed to generate the employee report. Please try again.');
    }
  };

  const handleGenerateMonthlySalaryExpenses = async () => {
    try {
      setSubmitting(true);
      setPayrollMessage('');
      const result = await ExpenseService.generateMonthlySalaryExpenses(employees, new Date());
      setPayrollMessage(
        result.created.length > 0
          ? `Created ${result.created.length} salary expense record(s) for this month.`
          : 'This month salary expenses already exist for all active employees.'
      );
    } catch (error) {
      console.error('Error generating salary expenses:', error);
      setPayrollMessage('Failed to generate salary expenses.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading employees..." />;
  }

  const totalMonthlySalary = employees.reduce((sum, employee) => sum + (employee.salary || 0), 0);
  const activeMonthlySalary = employees
    .filter(employee => employee.status === 'active')
    .reduce((sum, employee) => sum + (employee.salary || 0), 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Database</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={20} />
            <span className="ml-2">Export PDF</span>
          </button>
          <button
            onClick={handleGenerateMonthlySalaryExpenses}
            disabled={submitting}
            className={`flex items-center ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded-lg`}
          >
            <span>Post Monthly Salaries</span>
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span className="ml-2">Add Employee</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Employees</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{employees.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active Monthly Salary</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">SLL {activeMonthlySalary.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Total Monthly Salary</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">SLL {totalMonthlySalary.toFixed(2)}</p>
        </div>
      </div>

      {payrollMessage && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {payrollMessage}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Employee' : 'Add New Employee'}
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Role *"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Department *"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="date"
                  placeholder="Hire Date"
                  value={new Date(formData.hireDate).toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, hireDate: new Date(e.target.value) })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="border border-gray-300 rounded px-3 py-2 col-span-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>

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
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create') + ' Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-amber-600 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Monthly Salary</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {employee.employeeCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.role}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  SLL {employee.salary.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
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

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No employees found.
        </div>
      )}
    </div>
  );
};

export default EmployeeDatabase;
