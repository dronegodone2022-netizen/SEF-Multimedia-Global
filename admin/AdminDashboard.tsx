import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Calendar,
  CreditCard,
  Briefcase,
  User,
  DollarSign,
  AlertCircle,
  Menu,
  X,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import ClientManagement from './pages/ClientManagement';
import BookingManagement from './pages/BookingManagement';
import PaymentTracking from './pages/PaymentTracking';
import EmployeeDatabase from './pages/EmployeeDatabase';
import FreelancerManagement from './pages/FreelancerManagement';
import ExpenseTracking from './pages/ExpenseTracking';
import ExpenseReporting from './pages/ExpenseReporting';
import InvoiceManagement from './pages/InvoiceManagement';
import WhatsAppManagement from './pages/WhatsAppManagement';
import Dashboard from './pages/Dashboard';
import GoogleDriveAuth from './pages/GoogleDriveAuth';
import {
  logoutAdmin,
  updateAdminLastActive,
  updateAdminLastVisit,
  isAdminAuthenticated,
} from '../src/lib/adminAuth';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const idleLogoutTimer = useRef<number | null>(null);
  const authCheckInterval = useRef<number | null>(null);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const;

    const clearIdleTimer = () => {
      if (idleLogoutTimer.current) {
        window.clearTimeout(idleLogoutTimer.current);
        idleLogoutTimer.current = null;
      }
    };

    const scheduleIdleLogout = () => {
      clearIdleTimer();
      idleLogoutTimer.current = window.setTimeout(() => {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
      }, 2 * 60 * 1000);
    };

    const handleUserActivity = () => {
      updateAdminLastActive();
      updateAdminLastVisit();
      scheduleIdleLogout();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateAdminLastVisit();
      } else if (document.visibilityState === 'visible') {
        if (!isAdminAuthenticated()) {
          logoutAdmin();
          navigate('/admin/login', { replace: true });
        } else {
          updateAdminLastActive();
          updateAdminLastVisit();
          scheduleIdleLogout();
        }
      }
    };

    const handleAuthCheck = () => {
      if (!isAdminAuthenticated()) {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
      }
    };

    handleUserActivity();
    activityEvents.forEach((eventName) => window.addEventListener(eventName, handleUserActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibilityChange);
    authCheckInterval.current = window.setInterval(handleAuthCheck, 10000);

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleUserActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearIdleTimer();
      if (authCheckInterval.current) {
        window.clearInterval(authCheckInterval.current);
      }
      updateAdminLastVisit();
    };
  }, [navigate]);

  const navItems: NavItem[] = [
    { path: '/admin', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/admin/clients', label: 'Clients', icon: <Users size={20} /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { path: '/admin/invoices', label: 'Invoices', icon: <CreditCard size={20} /> },
    { path: '/admin/whatsapp', label: 'WhatsApp', icon: <MessageSquare size={20} /> },
    { path: '/admin/payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { path: '/admin/employees', label: 'Employees', icon: <Briefcase size={20} /> },
    { path: '/admin/freelancers', label: 'Freelancers', icon: <User size={20} /> },
    { path: '/admin/expenses', label: 'Expenses', icon: <DollarSign size={20} /> },
    { path: '/admin/expense-reports', label: 'Expense Reports', icon: <DollarSign size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">SEF Management</h1>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        <nav className="mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 border-l-4 border-blue-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 "
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-4">
            {googleClientId && <GoogleDriveAuth />}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-red-700 transition-colors hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="whatsapp" element={<WhatsAppManagement />} />
            <Route path="payments" element={<PaymentTracking />} />
            <Route path="employees" element={<EmployeeDatabase />} />
            <Route path="freelancers" element={<FreelancerManagement />} />
            <Route path="expenses" element={<ExpenseTracking />} />
            <Route path="expense-reports" element={<ExpenseReporting />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
