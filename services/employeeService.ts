import { Employee } from '../types';
import { employees } from './dataStore';
import { IDGenerator } from '../utils/idGenerator';

export class EmployeeService {
  static async getAllEmployees(): Promise<Employee[]> {
    return [...employees];
  }

  static async getEmployeeById(id: string): Promise<Employee | undefined> {
    return employees.find((employee) => employee.id === id);
  }

  static async createEmployee(data: Omit<Employee, 'id' | 'employeeCode'>): Promise<Employee> {
    const newEmployee: Employee = {
      ...data,
      id: IDGenerator.generateId(),
      employeeCode: `EMP-${Date.now()}`,
    };

    employees.push(newEmployee);
    return newEmployee;
  }

  static async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const index = employees.findIndex((employee) => employee.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    employees[index] = {
      ...employees[index],
      ...updates,
    };

    return employees[index];
  }

  static async deleteEmployee(id: string): Promise<boolean> {
    const index = employees.findIndex((employee) => employee.id === id);
    if (index === -1) {
      return false;
    }

    employees.splice(index, 1);
    return true;
  }
}
