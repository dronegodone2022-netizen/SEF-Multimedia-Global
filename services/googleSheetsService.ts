/**
 * Google Sheets API Service
 * Handles all communication with Google Apps Script backend
 */

// Set your Google Apps Script Web App URL here
const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercallback';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
}

interface LoginResponse {
  token: string;
  user: User;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  projectType: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  lineItems: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Freelancer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  dailyRate: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardMetrics {
  totalBookings: number;
  activeClients: number;
  pendingInvoices: number;
  activeFreelancers: number;
  recentBookings: Booking[];
  recentInvoices: Invoice[];
}

/**
 * Call Google Apps Script backend
 */
async function callAppsScript<T>(action: string, payload?: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...payload,
      }),
    });

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error(`Error calling Apps Script action: ${action}`, error);
    return {
      success: false,
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: null,
      statusCode: 500,
    };
  }
}

/**
 * Authentication Services
 */
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    return callAppsScript<LoginResponse>('verifyLogin', { email, password });
  },
};

/**
 * Client Management Services
 */
export const clientService = {
  create: async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('createRecord', { sheet: 'Clients', data });
  },

  getAll: async (): Promise<ApiResponse<Client[]>> => {
    return callAppsScript('getRecords', { sheet: 'Clients' });
  },

  getById: async (recordId: string): Promise<ApiResponse<Client>> => {
    return callAppsScript('getSingleRecord', { sheet: 'Clients', recordId });
  },

  update: async (recordId: string, data: Partial<Client>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('updateRecord', { sheet: 'Clients', recordId, data });
  },

  delete: async (recordId: string): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('deleteRecord', { sheet: 'Clients', recordId });
  },
};

/**
 * Booking Management Services
 */
export const bookingService = {
  create: async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('createRecord', { sheet: 'Bookings', data });
  },

  getAll: async (): Promise<ApiResponse<Booking[]>> => {
    return callAppsScript('getRecords', { sheet: 'Bookings' });
  },

  getById: async (recordId: string): Promise<ApiResponse<Booking>> => {
    return callAppsScript('getSingleRecord', { sheet: 'Bookings', recordId });
  },

  update: async (recordId: string, data: Partial<Booking>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('updateRecord', { sheet: 'Bookings', recordId, data });
  },

  delete: async (recordId: string): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('deleteRecord', { sheet: 'Bookings', recordId });
  },
};

/**
 * Invoice Management Services
 */
export const invoiceService = {
  create: async (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('createRecord', { sheet: 'Invoices', data });
  },

  getAll: async (): Promise<ApiResponse<Invoice[]>> => {
    return callAppsScript('getRecords', { sheet: 'Invoices' });
  },

  getById: async (recordId: string): Promise<ApiResponse<Invoice>> => {
    return callAppsScript('getSingleRecord', { sheet: 'Invoices', recordId });
  },

  update: async (recordId: string, data: Partial<Invoice>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('updateRecord', { sheet: 'Invoices', recordId, data });
  },

  delete: async (recordId: string): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('deleteRecord', { sheet: 'Invoices', recordId });
  },

  generate: async (
    clientId: string,
    lineItems: any[],
    taxRate?: number
  ): Promise<ApiResponse<{ invoiceId: string; invoice: Invoice }>> => {
    return callAppsScript('generateInvoice', { clientId, lineItems, taxRate });
  },
};

/**
 * Freelancer Management Services
 */
export const freelancerService = {
  create: async (data: Omit<Freelancer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('createRecord', { sheet: 'Freelancers', data });
  },

  getAll: async (): Promise<ApiResponse<Freelancer[]>> => {
    return callAppsScript('getRecords', { sheet: 'Freelancers' });
  },

  getById: async (recordId: string): Promise<ApiResponse<Freelancer>> => {
    return callAppsScript('getSingleRecord', { sheet: 'Freelancers', recordId });
  },

  update: async (recordId: string, data: Partial<Freelancer>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('updateRecord', { sheet: 'Freelancers', recordId, data });
  },

  delete: async (recordId: string): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('deleteRecord', { sheet: 'Freelancers', recordId });
  },
};

/**
 * Employee Management Services
 */
export const employeeService = {
  create: async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('createRecord', { sheet: 'Employees', data });
  },

  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    return callAppsScript('getRecords', { sheet: 'Employees' });
  },

  getById: async (recordId: string): Promise<ApiResponse<Employee>> => {
    return callAppsScript('getSingleRecord', { sheet: 'Employees', recordId });
  },

  update: async (recordId: string, data: Partial<Employee>): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('updateRecord', { sheet: 'Employees', recordId, data });
  },

  delete: async (recordId: string): Promise<ApiResponse<{ id: string }>> => {
    return callAppsScript('deleteRecord', { sheet: 'Employees', recordId });
  },
};

/**
 * Dashboard Services
 */
export const dashboardService = {
  getMetrics: async (): Promise<ApiResponse<DashboardMetrics>> => {
    return callAppsScript('getDashboardMetrics');
  },
};

export default {
  authService,
  clientService,
  bookingService,
  invoiceService,
  freelancerService,
  employeeService,
  dashboardService,
};
