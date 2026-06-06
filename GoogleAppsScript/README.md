# Google Apps Script + Google Sheets Admin Integration

A complete backend system for your multimedia admin dashboard using **Google Apps Script** and **Google Sheets** as the database, integrated with your existing **React + TypeScript** frontend.

## 📁 Files Overview

### Backend Files
- **`Code.gs`** - Google Apps Script backend with full CRUD operations
- **`SETUP.md`** - Step-by-step setup guide
- **`.env.example`** - Environment variables template

### Frontend Service Files
- **`../services/googleSheetsService.ts`** - TypeScript service layer for API communication

### Example Components
- **`AdminLoginExample.tsx`** - Updated login component with Google Sheets authentication
- **`ClientManagementExample.tsx`** - Complete CRUD example for clients

## 🚀 Quick Start

### 1. Create Google Sheet & Apps Script
- Create a new Google Sheet: https://sheets.google.com
- Go to **Extensions > Apps Script**
- Copy entire `Code.gs` content into Apps Script editor
- Add your Spreadsheet ID to Script Properties

### 2. Deploy Apps Script
- Click **Deploy > New Deployment**
- Type: "Web app"
- Execute as: Your Google Account
- Who has access: "Anyone" (or "Anyone with Google account")
- Copy the **Deployment URL**

### 3. Update Environment
Add to your `.env.local`:
```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercallback
```

### 4. Initialize Sheets
Visit: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback?action=init`

This creates all required sheets with headers.

## 📚 Available Services

All services return `ApiResponse<T>` with `success`, `message`, `data`, and `statusCode`.

### Authentication
```typescript
import { authService } from '../services/googleSheetsService';

const response = await authService.login(email, password);
// Returns: { token, user: { id, name, email, role } }
```

### Clients
```typescript
import { clientService } from '../services/googleSheetsService';

await clientService.getAll()           // Get all clients
await clientService.getById(id)        // Get single client
await clientService.create(data)       // Create new client
await clientService.update(id, data)   // Update client
await clientService.delete(id)         // Delete client
```

### Bookings
```typescript
import { bookingService } from '../services/googleSheetsService';

await bookingService.getAll()
await bookingService.getById(id)
await bookingService.create(data)
await bookingService.update(id, data)
await bookingService.delete(id)
```

### Invoices
```typescript
import { invoiceService } from '../services/googleSheetsService';

await invoiceService.getAll()
await invoiceService.getById(id)
await invoiceService.create(data)
await invoiceService.update(id, data)
await invoiceService.delete(id)
await invoiceService.generate(clientId, lineItems, taxRate)
```

### Freelancers
```typescript
import { freelancerService } from '../services/googleSheetsService';

await freelancerService.getAll()
await freelancerService.getById(id)
await freelancerService.create(data)
await freelancerService.update(id, data)
await freelancerService.delete(id)
```

### Employees
```typescript
import { employeeService } from '../services/googleSheetsService';

await employeeService.getAll()
await employeeService.getById(id)
await employeeService.create(data)
await employeeService.update(id, data)
await employeeService.delete(id)
```

### Dashboard
```typescript
import { dashboardService } from '../services/googleSheetsService';

const metrics = await dashboardService.getMetrics();
// Returns: { totalBookings, activeClients, pendingInvoices, activeFreelancers, recentBookings, recentInvoices }
```

## 🔐 Default Credentials

After initialization:
- **Email**: admin@multimedia.com
- **Password**: Admin@123

**⚠️ Change these immediately in your Google Sheet!**

## 📋 Database Schema

### Users Sheet
- id, name, email, password, role, createdAt, updatedAt

### Clients Sheet
- id, name, email, phone, company, address, status, createdAt, updatedAt

### Bookings Sheet
- id, clientId, clientName, projectType, startDate, endDate, status, notes, createdAt, updatedAt

### Invoices Sheet
- id, clientId, clientName, lineItems, subtotal, tax, total, status, createdAt, updatedAt

### Freelancers Sheet
- id, name, email, phone, skills, dailyRate, status, createdAt, updatedAt

### Employees Sheet
- id, name, email, phone, role, joinDate, status, createdAt, updatedAt

### Expenses Sheet
- id, description, amount, category, date, approvalStatus, createdAt, updatedAt

## 🛠️ Integration Examples

### Example 1: Update Admin Login
```typescript
import { authService } from '../services/googleSheetsService';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const response = await authService.login(email, password);
  
  if (response.success && response.data) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    navigate('/admin');
  } else {
    setError(response.message);
  }
};
```

### Example 2: Fetch Clients with Loading
```typescript
import { clientService } from '../services/googleSheetsService';

useEffect(() => {
  const fetchClients = async () => {
    setLoading(true);
    const response = await clientService.getAll();
    if (response.success) {
      setClients(response.data || []);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };
  
  fetchClients();
}, []);
```

### Example 3: Create New Record
```typescript
const handleCreate = async (data) => {
  const response = await clientService.create(data);
  if (response.success) {
    setSuccess('Client created!');
    await fetchClients(); // Refresh list
  } else {
    setError(response.message);
  }
};
```

### Example 4: Update Record
```typescript
const handleUpdate = async (clientId, updates) => {
  const response = await clientService.update(clientId, updates);
  if (response.success) {
    setSuccess('Client updated!');
    await fetchClients();
  } else {
    setError(response.message);
  }
};
```

### Example 5: Delete Record
```typescript
const handleDelete = async (clientId) => {
  if (confirm('Delete this client?')) {
    const response = await clientService.delete(clientId);
    if (response.success) {
      setSuccess('Client deleted!');
      await fetchClients();
    }
  }
};
```

## 🔍 Error Handling

All responses include error information:

```typescript
const response = await clientService.getAll();

if (!response.success) {
  console.error('Error:', response.message);
  console.error('Status:', response.statusCode);
  // Handle error based on statusCode:
  // 400 - Bad request
  // 401 - Unauthorized
  // 403 - Forbidden
  // 404 - Not found
  // 500 - Server error
}
```

## 📝 Next Steps for Implementation

1. **Update Admin Login Component**
   - Import `authService`
   - Replace local verification with API call
   - Store token and user info in localStorage

2. **Update Each Admin Page**
   - Import corresponding service
   - Add `useEffect` to fetch data on mount
   - Implement create/update/delete handlers
   - Add loading and error states

3. **Implement Role-Based Access**
   - Check user role from localStorage
   - Show/hide features based on role

4. **Add Data Validation**
   - Validate form inputs before submission
   - Add required field indicators
   - Show validation errors

5. **Implement Loading States**
   - Show spinners during API calls
   - Disable buttons during submission
   - Add success/error notifications

6. **Add Search & Filter**
   - Filter records on frontend or backend
   - Implement pagination if needed

## ⚠️ Security Notes

### Current Implementation
- Simple email/password authentication
- No password hashing (for demonstration)
- Basic session tokens

### For Production
1. **Implement Password Hashing**
   - Use bcrypt or similar in Apps Script

2. **Add OAuth Integration**
   - Use Google Sign-In instead of passwords

3. **Add Rate Limiting**
   - Prevent brute force attacks

4. **Implement Audit Logs**
   - Track all changes to records

5. **Use Environment Variables**
   - Never commit sensitive data

6. **Regular Backups**
   - Set up automatic Google Sheet backups

7. **HTTPS Only**
   - Ensure all communications are encrypted

8. **Validation & Sanitization**
   - Validate all inputs on both client and server

## 🐛 Troubleshooting

### "Sheet not found" Error
- Verify Spreadsheet ID is correct in Script Properties
- Ensure initialization was completed
- Check sheet names match exactly

### CORS Issues
- Google Apps Script handles CORS automatically
- Make sure deployment is public

### Changes Not Appearing
- Refresh the page
- Clear browser cache
- Check browser console for errors

### Login Always Fails
- Verify Apps Script URL is correct
- Check that Apps Script is deployed
- Try logging in with default credentials

### Slow Performance
- Google Sheets may have rate limits
- Consider implementing caching
- Use pagination for large datasets

## 📖 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API Reference](https://developers.google.com/sheets/api)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Tips

- Store frequently accessed data in component state with localStorage for offline support
- Implement pagination for tables with many rows
- Use React Query or SWR for better caching and synchronization
- Consider implementing real-time updates with Firebase instead of polling
- Add image upload functionality by storing URLs in Sheets
- Create templates for recurring invoices

## 📞 Support

For issues or questions:
1. Check the SETUP.md guide
2. Review example components
3. Check browser console for error messages
4. Verify all environment variables are set correctly
5. Test Apps Script deployment URL directly in browser

---

**Created with TypeScript + React + Google Apps Script + Google Sheets**
