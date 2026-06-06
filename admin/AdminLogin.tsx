import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAdminCredentials, loginAdmin, isAdminAuthenticated } from '../src/lib/adminAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError('');

    if (verifyAdminCredentials(email, password)) {
      loginAdmin();
      navigate('/admin', { replace: true });
      return;
    }

    setError('Email or password is incorrect. Please try again.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-slate-950 mb-4">Admin Sign In</h1>
        <p className="text-sm text-slate-500 mb-8">
          Enter your authorised email and password to access the admin panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event: any) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event: any) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your admin password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-2xl py-3 text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
