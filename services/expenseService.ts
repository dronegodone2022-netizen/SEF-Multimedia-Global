import { Employee, Expense, PettyCash } from '../types';
import { expenses, pettyCashRecords } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';

export class ExpenseService {
  static async getAllExpenses(): Promise<Expense[]> {
    return [...expenses];
  }

  static async getAllPettyCash(): Promise<PettyCash[]> {
    return [...pettyCashRecords];
  }

  static async createExpense(data: Omit<Expense, 'id' | 'expenseCode' | 'createdAt'>): Promise<Expense> {
    const newExpense: Expense = {
      ...data,
      id: IDGenerator.generateId(),
      expenseCode: `EXP-${Date.now()}`,
      createdAt: new Date(),
      date: data.date || new Date(),
      status: data.status || 'pending',
    };

    expenses.push(newExpense);
    return newExpense;
  }

  static async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses[index] = {
      ...expenses[index],
      ...updates,
    };

    return expenses[index];
  }

  static async deleteExpense(id: string): Promise<boolean> {
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      return false;
    }

    expenses.splice(index, 1);
    return true;
  }

  static async createPettyCash(data: Omit<PettyCash, 'id' | 'code'>): Promise<PettyCash> {
    const newRecord: PettyCash = {
      ...data,
      id: IDGenerator.generateId(),
      code: `PC-${Date.now()}`,
    };

    pettyCashRecords.push(newRecord);
    return newRecord;
  }

  static async updatePettyCash(id: string, updates: Partial<PettyCash>): Promise<PettyCash> {
    const index = pettyCashRecords.findIndex((record) => record.id === id);
    if (index === -1) {
      throw new Error('Petty cash record not found');
    }

    pettyCashRecords[index] = {
      ...pettyCashRecords[index],
      ...updates,
    };

    return pettyCashRecords[index];
  }

  static async deletePettyCash(id: string): Promise<boolean> {
    const index = pettyCashRecords.findIndex((record) => record.id === id);
    if (index === -1) {
      return false;
    }

    pettyCashRecords.splice(index, 1);
    return true;
  }

  static async generateMonthlySalaryExpenses(
    employeesList: Employee[],
    date: Date
  ): Promise<{ created: Expense[] }> {
    const created: Expense[] = [];
    const month = date.getMonth();
    const year = date.getFullYear();

    for (const employee of employeesList.filter((employee) => employee.status === 'active')) {
      const existing = expenses.find(
        (expense) =>
          expense.employeeId === employee.id &&
          expense.category.toLowerCase() === 'salary' &&
          expense.date.getMonth() === month &&
          expense.date.getFullYear() === year
      );

      if (!existing) {
        const newExpense: Expense = {
          id: IDGenerator.generateId(),
          expenseCode: `SAL-${employee.employeeCode}-${date.toISOString().slice(0, 7)}`,
          description: `Monthly salary for ${employee.firstName} ${employee.lastName}`,
          amount: employee.salary,
          category: 'salary',
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          employeeId: employee.id,
          status: 'approved',
          approvedBy: 'Finance Team',
          createdAt: new Date(),
        };

        expenses.push(newExpense);
        created.push(newExpense);
      }
    }

    return { created };
  }
}
