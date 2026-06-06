/**
 * Google Apps Script Backend for Multimedia Admin System
 * Handles authentication, CRUD operations, and Google Sheets management
 */

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || 'YOUR_SPREADSHEET_ID';

// ==================== SHEET STRUCTURE ====================
const SHEETS = {
  USERS: 'Users',
  CLIENTS: 'Clients',
  BOOKINGS: 'Bookings',
  INVOICES: 'Invoices',
  FREELANCERS: 'Freelancers',
  EMPLOYEES: 'Employees',
  EXPENSES: 'Expenses'
};

// ==================== AUTHENTICATION ====================

/**
 * POST: Verify admin credentials
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'verifyLogin':
        return handleVerifyLogin(payload);
      case 'createRecord':
        return handleCreateRecord(payload);
      case 'updateRecord':
        return handleUpdateRecord(payload);
      case 'deleteRecord':
        return handleDeleteRecord(payload);
      case 'getRecords':
        return handleGetRecords(payload);
      case 'getSingleRecord':
        return handleGetSingleRecord(payload);
      case 'getDashboardMetrics':
        return handleGetDashboardMetrics();
      case 'generateInvoice':
        return handleGenerateInvoice(payload);
      default:
        return createResponse(false, 'Unknown action', null, 400);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return createResponse(false, 'Server error: ' + error.message, null, 500);
  }
}

/**
 * GET: Initialize spreadsheet if needed
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'init';

    if (action === 'init') {
      initializeSpreadsheet();
      return HtmlService.createHtmlOutput('Spreadsheet initialized');
    }

    return HtmlService.createHtmlOutput('Google Apps Script API ready');
  } catch (error) {
    return HtmlService.createHtmlOutput('Error: ' + error.message);
  }
}

// ==================== AUTHENTICATION LOGIC ====================

function handleVerifyLogin(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    return createResponse(false, 'Email and password required', null, 400);
  }

  const users = getSheetData(SHEETS.USERS);
  const user = users.find(u => u.email === email);

  if (!user) {
    return createResponse(false, 'Invalid email or password', null, 401);
  }

  // Simple password check (in production, use proper hashing/verification)
  if (user.password !== password) {
    return createResponse(false, 'Invalid email or password', null, 401);
  }

  if (user.role !== 'Admin' && user.role !== 'Employee') {
    return createResponse(false, 'Insufficient permissions', null, 403);
  }

  const sessionToken = generateSessionToken();
  
  return createResponse(true, 'Login successful', {
    token: sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

// ==================== CRUD OPERATIONS ====================

function handleCreateRecord(payload) {
  const { sheet, data } = payload;

  if (!sheet || !data) {
    return createResponse(false, 'Sheet and data required', null, 400);
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetObj = ss.getSheetByName(sheet);

    if (!sheetObj) {
      return createResponse(false, `Sheet '${sheet}' not found`, null, 404);
    }

    // Add ID if not exists
    if (!data.id) {
      data.id = generateUniqueId();
    }

    // Add timestamp
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();

    // Get headers from first row
    const headers = sheetObj.getRange(1, 1, 1, sheetObj.getLastColumn()).getValues()[0];
    
    // Build row data
    const rowData = headers.map(header => data[header] || '');
    
    // Append row
    sheetObj.appendRow(rowData);

    return createResponse(true, 'Record created', { id: data.id });
  } catch (error) {
    Logger.log('Error creating record: ' + error);
    return createResponse(false, 'Error creating record: ' + error.message, null, 500);
  }
}

function handleUpdateRecord(payload) {
  const { sheet, recordId, data } = payload;

  if (!sheet || !recordId || !data) {
    return createResponse(false, 'Sheet, recordId, and data required', null, 400);
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetObj = ss.getSheetByName(sheet);

    if (!sheetObj) {
      return createResponse(false, `Sheet '${sheet}' not found`, null, 404);
    }

    const headers = sheetObj.getRange(1, 1, 1, sheetObj.getLastColumn()).getValues()[0];
    const lastRow = sheetObj.getLastRow();
    
    // If no data rows exist, return not found
    if (lastRow < 2) {
      return createResponse(false, 'Record not found', null, 404);
    }
    
    const allData = sheetObj.getRange(2, 1, lastRow - 1, sheetObj.getLastColumn()).getValues();

    // Find row with matching ID
    let rowIndex = -1;
    for (let i = 0; i < allData.length; i++) {
      if (allData[i][headers.indexOf('id')] === recordId) {
        rowIndex = i + 2; // +2 because we start from row 2 and arrays are 0-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      return createResponse(false, 'Record not found', null, 404);
    }

    // Update timestamp
    data.updatedAt = new Date().toISOString();

    // Update cells
    headers.forEach((header, idx) => {
      if (data[header] !== undefined) {
        sheetObj.getRange(rowIndex, idx + 1).setValue(data[header]);
      }
    });

    return createResponse(true, 'Record updated', { id: recordId });
  } catch (error) {
    Logger.log('Error updating record: ' + error);
    return createResponse(false, 'Error updating record: ' + error.message, null, 500);
  }
}

function handleDeleteRecord(payload) {
  const { sheet, recordId } = payload;

  if (!sheet || !recordId) {
    return createResponse(false, 'Sheet and recordId required', null, 400);
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetObj = ss.getSheetByName(sheet);

    if (!sheetObj) {
      return createResponse(false, `Sheet '${sheet}' not found`, null, 404);
    }

    const headers = sheetObj.getRange(1, 1, 1, sheetObj.getLastColumn()).getValues()[0];
    const lastRow = sheetObj.getLastRow();
    
    // If no data rows exist, return not found
    if (lastRow < 2) {
      return createResponse(false, 'Record not found', null, 404);
    }
    
    const allData = sheetObj.getRange(2, 1, lastRow - 1, sheetObj.getLastColumn()).getValues();

    // Find row with matching ID
    let rowIndex = -1;
    for (let i = 0; i < allData.length; i++) {
      if (allData[i][headers.indexOf('id')] === recordId) {
        rowIndex = i + 2;
        break;
      }
    }

    if (rowIndex === -1) {
      return createResponse(false, 'Record not found', null, 404);
    }

    sheetObj.deleteRow(rowIndex);
    return createResponse(true, 'Record deleted', { id: recordId });
  } catch (error) {
    Logger.log('Error deleting record: ' + error);
    return createResponse(false, 'Error deleting record: ' + error.message, null, 500);
  }
}

function handleGetRecords(payload) {
  const { sheet, filter } = payload;

  if (!sheet) {
    return createResponse(false, 'Sheet required', null, 400);
  }

  try {
    let records = getSheetData(sheet);

    // Apply filters if provided
    if (filter) {
      records = records.filter(record => {
        return Object.keys(filter).every(key => record[key] === filter[key]);
      });
    }

    return createResponse(true, 'Records retrieved', records);
  } catch (error) {
    Logger.log('Error getting records: ' + error);
    return createResponse(false, 'Error getting records: ' + error.message, null, 500);
  }
}

function handleGetSingleRecord(payload) {
  const { sheet, recordId } = payload;

  if (!sheet || !recordId) {
    return createResponse(false, 'Sheet and recordId required', null, 400);
  }

  try {
    const records = getSheetData(sheet);
    const record = records.find(r => r.id === recordId);

    if (!record) {
      return createResponse(false, 'Record not found', null, 404);
    }

    return createResponse(true, 'Record retrieved', record);
  } catch (error) {
    return createResponse(false, 'Error getting record: ' + error.message, null, 500);
  }
}

// ==================== DASHBOARD & METRICS ====================

function handleGetDashboardMetrics() {
  try {
    const bookings = getSheetData(SHEETS.BOOKINGS);
    const clients = getSheetData(SHEETS.CLIENTS);
    const invoices = getSheetData(SHEETS.INVOICES);
    const freelancers = getSheetData(SHEETS.FREELANCERS);

    const metrics = {
      totalBookings: bookings.length,
      activeClients: clients.filter(c => c.status === 'Active').length,
      pendingInvoices: invoices.filter(i => i.status === 'Pending').length,
      activeFreelancers: freelancers.filter(f => f.status === 'Active').length,
      recentBookings: bookings.slice(-5).reverse(),
      recentInvoices: invoices.slice(-5).reverse()
    };

    return createResponse(true, 'Metrics retrieved', metrics);
  } catch (error) {
    return createResponse(false, 'Error getting metrics: ' + error.message, null, 500);
  }
}

// ==================== INVOICE GENERATION ====================

function handleGenerateInvoice(payload) {
  const { clientId, lineItems, taxRate } = payload;

  if (!clientId || !lineItems || lineItems.length === 0) {
    return createResponse(false, 'Client and line items required', null, 400);
  }

  try {
    const clients = getSheetData(SHEETS.CLIENTS);
    const client = clients.find(c => c.id === clientId);

    if (!client) {
      return createResponse(false, 'Client not found', null, 404);
    }

    const invoiceId = generateUniqueId();
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = subtotal * (taxRate || 0);
    const total = subtotal + tax;

    const invoiceData = {
      id: invoiceId,
      clientId: clientId,
      clientName: client.name,
      lineItems: JSON.stringify(lineItems),
      subtotal: subtotal,
      tax: tax,
      total: total,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create new invoice
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const invoiceSheet = ss.getSheetByName(SHEETS.INVOICES);
    const headers = invoiceSheet.getRange(1, 1, 1, invoiceSheet.getLastColumn()).getValues()[0];
    const rowData = headers.map(header => invoiceData[header] || '');
    invoiceSheet.appendRow(rowData);

    return createResponse(true, 'Invoice generated', {
      invoiceId: invoiceId,
      invoice: invoiceData
    });
  } catch (error) {
    return createResponse(false, 'Error generating invoice: ' + error.message, null, 500);
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all data from a sheet as array of objects
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found`);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const lastRow = sheet.getLastRow();
  
  // If only header row exists, return empty array
  if (lastRow < 2) {
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

  return data.map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx];
    });
    return obj;
  });
}

/**
 * Initialize spreadsheet with required sheets and headers
 */
function initializeSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheetConfigs = {
    [SHEETS.USERS]: ['id', 'name', 'email', 'password', 'role', 'createdAt', 'updatedAt'],
    [SHEETS.CLIENTS]: ['id', 'name', 'email', 'phone', 'company', 'address', 'status', 'createdAt', 'updatedAt'],
    [SHEETS.BOOKINGS]: ['id', 'clientId', 'clientName', 'projectType', 'startDate', 'endDate', 'status', 'notes', 'createdAt', 'updatedAt'],
    [SHEETS.INVOICES]: ['id', 'clientId', 'clientName', 'lineItems', 'subtotal', 'tax', 'total', 'status', 'createdAt', 'updatedAt'],
    [SHEETS.FREELANCERS]: ['id', 'name', 'email', 'phone', 'skills', 'dailyRate', 'status', 'createdAt', 'updatedAt'],
    [SHEETS.EMPLOYEES]: ['id', 'name', 'email', 'phone', 'role', 'joinDate', 'status', 'createdAt', 'updatedAt'],
    [SHEETS.EXPENSES]: ['id', 'description', 'amount', 'category', 'date', 'approvalStatus', 'createdAt', 'updatedAt']
  };

  Object.keys(sheetConfigs).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(sheetConfigs[sheetName]);
    }
  });

  // Add default admin user if Users sheet is empty
  const users = getSheetData(SHEETS.USERS);
  if (users.length === 0) {
    const userSheet = ss.getSheetByName(SHEETS.USERS);
    userSheet.appendRow([
      generateUniqueId(),
      'Admin',
      'admin@multimedia.com',
      'Admin@123', // Change this in production!
      'Admin',
      new Date().toISOString(),
      new Date().toISOString()
    ]);
  }
}

/**
 * Generate unique ID
 */
function generateUniqueId() {
  return 'ID_' + Utilities.getUuid().substr(0, 8).toUpperCase();
}

/**
 * Generate session token (simple implementation)
 */
function generateSessionToken() {
  return Utilities.getUuid() + '_' + Date.now();
}

/**
 * Create consistent response format
 */
function createResponse(success, message, data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify({
    success,
    message,
    data,
    statusCode
  })).setMimeType(ContentService.MimeType.JSON);
}
