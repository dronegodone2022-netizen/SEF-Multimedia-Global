
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Photography' | 'Videography' | 'Graphic Design' | 'Web Development';
  subcategory?: 'Logo Design' | 'Flyers/Posters' | 'Cloth Branding' | 'Certificate/Invitation';
  imageUrl: string;
  description: string;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  service: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Photography' | 'Videography' | 'Graphic Design' | 'Web Development';
  description: string;
  duration: string;
  price: string;
  imageUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Management System Types

// Client Management
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastBooking?: Date;
  totalSpent: number;
  referredByFreelancerId?: string;
  status: 'active' | 'inactive' | 'archived';
}

// Booking System
export interface Booking {
  id: string;
  bookingCode: string;
  clientId: string;
  serviceType: 'photoshoot' | 'graphic-design' | 'videography' | 'training';
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number; // in hours
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  assignedTo?: string[]; // employee/freelancer IDs
  referredByFreelancerId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceId?: string;
}

// Payment Tracking
export interface Payment {
  id: string;
  paymentCode: string;
  bookingId: string;
  clientId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank-transfer' | 'credit-card' | 'mobile-money';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
}

// Employee Database
export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  address?: string;
  emergencyContact?: string;
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    accountName?: string;
  };
}

// Freelancer Commission
export interface Freelancer {
  id: string;
  freelancerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];
  commissionRate: number; // percentage
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    accountName?: string;
  };
  totalEarnings: number;
  status: 'active' | 'inactive';
  joinDate: Date;
}

export interface Commission {
  id: string;
  commissionCode: string;
  freelancerId: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate?: Date;
  createdAt: Date;
}

// Petty Cash System
export interface PettyCash {
  id: string;
  code: string;
  description: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  category: string;
  date: Date;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

// Expense Tracking
export interface Expense {
  id: string;
  expenseCode: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  receiptUrl?: string;
  employeeId?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  notes?: string;
  createdAt: Date;
}

// Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  clientId: string;
  paymentId?: string;
  invoiceType?: 'standard' | 'proforma';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  issuedDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  pdfUrl?: string;
  commissions?: Commission[];
  commissionsPaid?: string[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  subtotal?: number;
  gst?: number;
}

// Dashboard Analytics
export interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  totalClients: number;
  pendingPayments: number;
  completedBookings: number;
  expensesThisMonth: number;
  employeeCount: number;
  freelancerCount: number;
  averageBookingValue: number;
  paymentCompletionRate: number;
}

export interface ChartData {
  label: string;
  value: number;
  date?: Date;
}
