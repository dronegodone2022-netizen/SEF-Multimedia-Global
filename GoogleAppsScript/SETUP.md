# Google Apps Script Integration Setup Guide

This guide will help you set up Google Sheets as your admin database using Google Apps Script.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "SEF Multimedia Admin System"
3. Copy the **Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/1n3srw_VOGEzMgw9zs8TuyBdr6KHPIc7VJzMTbtPhYh0/edit`
   - Example: `1n3srw_VOGEzMgw9zs8TuyBdr6KHPIc7VJzMTbtPhYh0`

## Step 2: Create Google Apps Script Project

1. In your Google Sheet, go to **Extensions > Apps Script**
2. A new Apps Script project will open
3. Delete the default `myFunction()` code
4. Copy the entire contents of `GoogleAppsScript/Code.gs` into the editor
5. Add your Spreadsheet ID:
   - Click **Project Settings** (gear icon)
   - Under "Script Properties", create a new property:
     - **Key**: `SPREADSHEET_ID`
     - **Value**: 1n3srw_VOGEzMgw9zs8TuyBdr6KHPIc7VJzMTbtPhYh0

## Step 3: Deploy as Web App

1. In Apps Script, click **Deploy** > **New Deployment**
2. Select **Type**: "Web app"
3. Set **Execute as**: Your Google Account
4. Set **Who has access**: "Anyone" or "Anyone with a Google account"
5. Click **Deploy**
6. Copy the **Deployment URL** (it will look like):
   ```
   https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback
   ```

## Step 4: Update React Environment

1. Edit `.env.local` in your project root
2. Add:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercallback
   ```
3. Replace `{YOUR_DEPLOYMENT_ID}` with the actual deployment ID from Step 3

## Step 5: Initialize Spreadsheet

1. Visit the deployment URL in your browser
2. Add `?action=init` to the URL:
   ```
   https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallback?action=init
   ```
3. Click Enter - this will create all required sheets
4. Your Google Sheet will now have these sheets:
   - Users (with default admin: admin@multimedia.com / Admin@123)
   - Clients
   - Bookings
   - Invoices
   - Freelancers
   - Employees
   - Expenses

## Step 6: Update Admin Login

Update `admin/AdminLogin.tsx` to use the Google Sheets API:

```typescript
import { authService } from '../services/googleSheetsService';

const handleSubmit = async (event: any) => {
  event.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await authService.login(email, password);
    
    if (response.success && response.data) {
      // Store token and user info
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      navigate('/admin', { replace: true });
    } else {
      setError(response.message || 'Login failed');
    }
  } catch (error) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Step 7: Update Admin Components

For each admin page, import and use the services:

```typescript
import { clientService, bookingService, invoiceService } from '../services/googleSheetsService';

// Fetch clients
const fetchClients = async () => {
  const response = await clientService.getAll();
  if (response.success) {
    setClients(response.data || []);
  }
};

// Create new client
const handleCreateClient = async (clientData) => {
  const response = await clientService.create(clientData);
  if (response.success) {
    // Refresh list
    await fetchClients();
  }
};

// Update client
const handleUpdateClient = async (clientId, updates) => {
  const response = await clientService.update(clientId, updates);
  if (response.success) {
    await fetchClients();
  }
};

// Delete client
const handleDeleteClient = async (clientId) => {
  const response = await clientService.delete(clientId);
  if (response.success) {
    await fetchClients();
  }
};
```

## Available Services

### Authentication
```typescript
authService.login(email, password)
```

### Clients
```typescript
clientService.getAll()
clientService.getById(recordId)
clientService.create(data)
clientService.update(recordId, data)
clientService.delete(recordId)
```

### Bookings
```typescript
bookingService.getAll()
bookingService.getById(recordId)
bookingService.create(data)
bookingService.update(recordId, data)
bookingService.delete(recordId)
```

### Invoices
```typescript
invoiceService.getAll()
invoiceService.getById(recordId)
invoiceService.create(data)
invoiceService.update(recordId, data)
invoiceService.delete(recordId)
invoiceService.generate(clientId, lineItems, taxRate)
```

### Freelancers
```typescript
freelancerService.getAll()
freelancerService.getById(recordId)
freelancerService.create(data)
freelancerService.update(recordId, data)
freelancerService.delete(recordId)
```

### Employees
```typescript
employeeService.getAll()
employeeService.getById(recordId)
employeeService.create(data)
employeeService.update(recordId, data)
employeeService.delete(recordId)
```

### Dashboard
```typescript
dashboardService.getMetrics()
```

## Default Credentials

After initialization, use these credentials to log in:
- **Email**: admin@multimedia.com
- **Password**: Admin@123

**⚠️ Important**: Change these credentials immediately in the Google Sheet!

## Troubleshooting

### "Sheet not found" error
- Verify your Spreadsheet ID is correct
- Make sure initialization was completed

### CORS errors
- Google Apps Script handles CORS automatically
- Ensure your deployment is set to "Anyone" or "Anyone with a Google account"

### Changes not appearing
- Google Sheets may cache data. Try refreshing the page
- Clear browser cache if needed

### Can't deploy Apps Script
- Make sure you're logged into the correct Google account
- Try creating a new deployment if the first one fails

## Next Steps

1. Update admin login to use `authService`
2. Update each admin page component to use corresponding services
3. Add loading states and error handling
4. Test CRUD operations for each module
5. Customize dashboard metrics as needed
6. Implement role-based access control (Admin vs Employee)
7. Add data validation in Google Sheets

## Security Notes

- This setup is suitable for small to medium projects
- For production, consider:
  - Implementing proper password hashing
  - Using OAuth instead of email/password
  - Adding rate limiting
  - Implementing audit logs
  - Using more secure session tokens
  - Encrypting sensitive data
  - Regular backups of your Google Sheet
