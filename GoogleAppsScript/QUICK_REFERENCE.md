# Quick Reference Card

## 🚀 Setup Commands

```bash
# 1. Set your Apps Script URL in .env.local
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback

# 2. Visit initialization URL in browser
https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback?action=init
```

## 📚 Import Services

```typescript
// Authentication
import { authService } from '../services/googleSheetsService';

// Data Management
import { clientService } from '../services/googleSheetsService';
import { bookingService } from '../services/googleSheetsService';
import { invoiceService } from '../services/googleSheetsService';
import { freelancerService } from '../services/googleSheetsService';
import { employeeService } from '../services/googleSheetsService';

// Dashboard
import { dashboardService } from '../services/googleSheetsService';

// Or import all at once
import { authService, clientService, bookingService, invoiceService, freelancerService, employeeService, dashboardService } from '../services/googleSheetsService';
```

## 🔑 Authentication API

```typescript
// Login
const response = await authService.login(email, password);
if (response.success) {
  localStorage.setItem('adminToken', response.data.token);
  localStorage.setItem('adminUser', JSON.stringify(response.data.user));
}

// Store data
const token = localStorage.getItem('adminToken');
const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
```

## 📖 CRUD Operations Pattern

```typescript
// All services follow this pattern:

// READ - Get all records
const allResponse = await clientService.getAll();
const records = allResponse.data || [];

// READ - Get single record
const singleResponse = await clientService.getById(recordId);
const record = singleResponse.data;

// CREATE - Add new record
const createResponse = await clientService.create(formData);
if (createResponse.success) {
  const newId = createResponse.data?.id;
}

// UPDATE - Modify record
const updateResponse = await clientService.update(recordId, updates);
if (updateResponse.success) {
  // Updated
}

// DELETE - Remove record
const deleteResponse = await clientService.delete(recordId);
if (deleteResponse.success) {
  // Deleted
}
```

## 💾 Sample Data Models

### Client
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  updatedAt: string;
}
```

### Booking
```typescript
{
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
```

### Invoice
```typescript
{
  id: string;
  clientId: string;
  clientName: string;
  lineItems: string; // JSON stringified
  subtotal: number;
  tax: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Pending';
  createdAt: string;
  updatedAt: string;
}
```

### Freelancer
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  dailyRate: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
```

### Employee
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
```

## 🎯 Typical Component Pattern

```typescript
import React, { useState, useEffect } from 'react';
import { clientService } from '../services/googleSheetsService';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch function
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await clientService.getAll();
      if (response.success) {
        setData(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleCreate = async (formData) => {
    try {
      const response = await clientService.create(formData);
      if (response.success) {
        await fetchData();
        // Show success
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error creating record');
    }
  };

  // Update
  const handleUpdate = async (id, updates) => {
    try {
      const response = await clientService.update(id, updates);
      if (response.success) {
        await fetchData();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error updating record');
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (confirm('Delete this record?')) {
      try {
        const response = await clientService.delete(id);
        if (response.success) {
          await fetchData();
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Error deleting record');
      }
    }
  };

  return (
    // Your JSX here
  );
};

export default MyComponent;
```

## 🔍 Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;        // true/false
  message: string;         // Description of result
  data: T | null;         // The actual data
  statusCode: number;     // HTTP-like status (200, 400, 401, 404, 500)
}

// Example
{
  success: true,
  message: "Records retrieved",
  data: [...],
  statusCode: 200
}
```

## ⚠️ Status Codes

- **200** - Success
- **400** - Bad request (missing required fields)
- **401** - Unauthorized (wrong credentials)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found (record doesn't exist)
- **500** - Server error

## 🛠️ Useful Snippets

### Store/Retrieve from LocalStorage
```typescript
// Store
localStorage.setItem('key', JSON.stringify(value));

// Retrieve
const value = JSON.parse(localStorage.getItem('key') || '{}');

// Clear
localStorage.removeItem('key');
```

### Handle Async/Await Errors
```typescript
try {
  const response = await clientService.getAll();
  if (response.success) {
    // Success
  } else {
    // API error
    setError(response.message);
  }
} catch (err) {
  // Network error
  setError('Network error');
}
```

### Loading State Button
```typescript
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

### Error Display
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
    {error}
  </div>
)}
```

### Success Display
```typescript
{success && (
  <div className="bg-green-50 border border-green-200 rounded p-4 text-green-800">
    {success}
  </div>
)}
```

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Network error" | Check Apps Script URL in .env |
| "Sheet not found" | Run initialization URL with ?action=init |
| "Invalid credentials" | Use admin@multimedia.com / Admin@123 |
| CORS error | Shouldn't happen - check deployment URL |
| No data returned | Check that records exist in Google Sheet |
| Changes not visible | Refresh page and check Google Sheet directly |

## 📍 File Locations

```
services/
├── googleSheetsService.ts        ← API service layer

admin/
├── AdminLogin.tsx                ← Update with authService
├── pages/
│   ├── ClientManagement.tsx      ← Update with clientService
│   ├── BookingManagement.tsx     ← Update with bookingService
│   ├── InvoiceManagement.tsx     ← Update with invoiceService
│   ├── FreelancerManagement.tsx  ← Update with freelancerService
│   ├── EmployeeDatabase.tsx      ← Update with employeeService
│   ├── ExpenseTracking.tsx       ← Add expense CRUD
│   └── Dashboard.tsx             ← Update with dashboardService

GoogleAppsScript/
├── Code.gs                       ← Backend (deploy to Apps Script)
├── README.md                     ← Full documentation
├── SETUP.md                      ← Setup instructions
├── INTEGRATION_GUIDE.md          ← This file
└── Examples/                     ← Reference implementations
```

## 🎓 Quick Tips

1. **Always check response.success** before accessing response.data
2. **Use loading states** to prevent UI freezing
3. **Show error messages** to users (from response.message)
4. **Refresh data** after create/update/delete operations
5. **Store auth token** in localStorage for session persistence
6. **Validate form data** before sending to backend
7. **Add confirmation** for destructive actions (delete)
8. **Test in console** before adding to components

---

**Last Updated**: 2024
**Version**: 1.0
