var DASHBOARD_FILE_NAME = 'sef-dashboard-data.json';
var ROOT_FOLDER_NAME = 'SEF Multimedia Global';
var DASHBOARD_SHEETS_FOLDER_NAME = 'Dashboard Sheets';
var DASHBOARD_SPREADSHEET_NAME = 'SEF Multimedia Global Records';
var DASHBOARD_SPREADSHEET_PROPERTY = 'SEF_DASHBOARD_SPREADSHEET_ID';

var DASHBOARD_COLLECTIONS = [
	{ key: 'currentUser', sheetName: 'Current User' },
	{ key: 'users', sheetName: 'Users' },
	{ key: 'clients', sheetName: 'Clients' },
	{ key: 'bookings', sheetName: 'Bookings' },
	{ key: 'payments', sheetName: 'Payments' },
	{ key: 'invoices', sheetName: 'Invoices' },
	{ key: 'expenses', sheetName: 'Expenses' },
	{ key: 'pettyCash', sheetName: 'Petty Cash' },
	{ key: 'freelancers', sheetName: 'Freelancers' },
	{ key: 'employees', sheetName: 'Employees' },
	{ key: 'assets', sheetName: 'Assets' },
	{ key: 'students', sheetName: 'Students' }
];

function jsonOutput(payload) {
	return ContentService
		.createTextOutput(JSON.stringify(payload))
		.setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateRootFolder_() {
	var folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
	if (folders.hasNext()) {
		return folders.next();
	}
	return DriveApp.createFolder(ROOT_FOLDER_NAME);
}

function getDashboardSheetsFolder_() {
	var root = getOrCreateRootFolder_();
	var folders = root.getFoldersByName(DASHBOARD_SHEETS_FOLDER_NAME);
	if (folders.hasNext()) {
		return folders.next();
	}
	return root.createFolder(DASHBOARD_SHEETS_FOLDER_NAME);
}

function getScriptProperties_() {
	return PropertiesService.getScriptProperties();
}

function getSavedSpreadsheetId_() {
	return getScriptProperties_().getProperty(DASHBOARD_SPREADSHEET_PROPERTY);
}

function setSavedSpreadsheetId_(spreadsheetId) {
	getScriptProperties_().setProperty(DASHBOARD_SPREADSHEET_PROPERTY, spreadsheetId);
}

function isPlainObject_(value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeCellValue_(value) {
	if (value === null || value === undefined) {
		return '';
	}

	if (value instanceof Date) {
		return value.toISOString();
	}

	if (Array.isArray(value) || isPlainObject_(value)) {
		return JSON.stringify(value);
	}

	return value;
}

function collectHeaders_(rows) {
	var headers = [];
	var seen = {};

	rows.forEach(function (row) {
		if (!isPlainObject_(row)) {
			return;
		}

		Object.keys(row).forEach(function (key) {
			if (!seen[key]) {
				seen[key] = true;
				headers.push(key);
			}
		});
	});

	if (!headers.length) {
		headers = ['id', 'name', 'value'];
	}

	return headers;
}

function writeCollectionSheet_(spreadsheet, sheetName, rows) {
	var sheet = spreadsheet.getSheetByName(sheetName);
	if (!sheet) {
		sheet = spreadsheet.insertSheet(sheetName);
	}

	sheet.clearContents();

	var dataRows = Array.isArray(rows) ? rows : [];
	var headers = collectHeaders_(dataRows);
	var values = [headers];

	dataRows.forEach(function (row) {
		var dataRow = headers.map(function (header) {
			return normalizeCellValue_(row[header]);
		});
		values.push(dataRow);
	});

	if (values.length === 1) {
		values.push(headers.map(function () { return ''; }));
	}

	sheet.getRange(1, 1, values.length, headers.length).setValues(values);
	sheet.setFrozenRows(1);
	sheet.autoResizeColumns(1, headers.length);
}

function getOrCreateDashboardSpreadsheet_() {
	var spreadsheetId = getSavedSpreadsheetId_();
	if (spreadsheetId) {
		try {
			return SpreadsheetApp.openById(spreadsheetId);
		} catch (error) {
			getScriptProperties_().deleteProperty(DASHBOARD_SPREADSHEET_PROPERTY);
		}
	}

	var folder = getDashboardSheetsFolder_();
	var files = folder.getFilesByName(DASHBOARD_SPREADSHEET_NAME);
	if (files.hasNext()) {
		var existingFile = files.next();
		setSavedSpreadsheetId_(existingFile.getId());
		return SpreadsheetApp.openById(existingFile.getId());
	}

	var spreadsheet = SpreadsheetApp.create(DASHBOARD_SPREADSHEET_NAME);
	DriveApp.getFileById(spreadsheet.getId()).moveTo(folder);
	setSavedSpreadsheetId_(spreadsheet.getId());
	return spreadsheet;
}

function syncDashboardSpreadsheet_(payload) {
	var spreadsheet = getOrCreateDashboardSpreadsheet_();
	var snapshot = payload || {};

	DASHBOARD_COLLECTIONS.forEach(function (collection) {
		var sheetRows = collection.key === 'currentUser'
			? (snapshot.currentUser ? [snapshot.currentUser] : [])
			: (Array.isArray(snapshot[collection.key]) ? snapshot[collection.key] : []);
		writeCollectionSheet_(spreadsheet, collection.sheetName, sheetRows);
	});

	var overview = spreadsheet.getSheetByName('Overview');
	if (!overview) {
		overview = spreadsheet.getSheets()[0];
		if (overview) {
			overview.setName('Overview');
		} else {
			overview = spreadsheet.insertSheet('Overview', 0);
		}
	}

	overview.clearContents();
	overview.getRange(1, 1, 5, 2).setValues([
		['Dashboard Snapshot', DASHBOARD_SPREADSHEET_NAME],
		['Last Updated', new Date().toISOString()],
		['Source Folder', ROOT_FOLDER_NAME],
		['Data File', DASHBOARD_FILE_NAME],
		['Cloud Mode', 'Apps Script + Google Drive']
	]);
	overview.autoResizeColumns(1, 2);

	return spreadsheet;
}

function getProductionAccounts_() {
	return [
		{
			id: 'u1',
			name: 'Sylvester SEF',
			email: 'sylvester.sef@sefmultimedia.com',
			password: 'Admin@SEF2024',
			role: 'super_admin'
		},
		{
			id: 'u2',
			name: 'Bintu Gbamoi',
			email: 'bintu.g@sefmultimedia.com',
			password: 'Operation@232',
			role: 'operations'
		},
		{
			id: 'u3',
			name: 'Jestina Y.',
			email: 'jestina.y@sefmultimedia.com',
			password: 'Operation@232',
			role: 'people_admin'
		}
	];
}

function testSavePermission() {
	var sampleData = JSON.stringify({
		currentUser: {
			id: 'u1',
			name: 'Sylvester SEF',
			email: 'sylvester.sef@sefmultimedia.com',
			password: 'admin123',
			role: 'super_admin'
		},
		users: getProductionAccounts_(),
		clients: [],
		bookings: [],
		payments: [],
		invoices: [],
		expenses: [],
		pettyCash: [],
		freelancers: [],
		employees: [],
		assets: [],
		students: []
	});

	var result = saveDashboardPayload_(sampleData);
	Logger.log(JSON.stringify(result, null, 2));
}

function getDashboardFile_() {
	var folder = getOrCreateRootFolder_();
	var files = folder.getFilesByName(DASHBOARD_FILE_NAME);
	if (files.hasNext()) {
		return files.next();
	}
	return null;
}

function saveDashboardPayload_(rawPayload) {
	if (!rawPayload) {
		throw new Error('Missing payload.');
	}

	var parsed = JSON.parse(rawPayload);
	var spreadsheet = syncDashboardSpreadsheet_(parsed);
	var folder = getOrCreateRootFolder_();
	var file = getDashboardFile_();
	var content = JSON.stringify(parsed);
	var sheetUrl = spreadsheet ? spreadsheet.getUrl() : '';

	if (file) {
		file.setContent(content);
		return {
			id: file.getId(),
			name: file.getName(),
			updatedAt: new Date().toISOString(),
			sheetId: getSavedSpreadsheetId_(),
			sheetUrl: sheetUrl
		};
	}

	var created = folder.createFile(DASHBOARD_FILE_NAME, content, MimeType.PLAIN_TEXT);
	return {
		id: created.getId(),
		name: created.getName(),
		updatedAt: new Date().toISOString(),
		sheetId: getSavedSpreadsheetId_(),
		sheetUrl: sheetUrl
	};
}

function loadDashboardPayload_() {
	var file = getDashboardFile_();
	if (!file) {
		return null;
	}

	var content = file.getBlob().getDataAsString();
	if (!content) {
		return null;
	}

	return JSON.parse(content);
}

function normalizeRole_(rawRole) {
	var role = String(rawRole || 'super_admin').toLowerCase();
	if (role === 'operations' || role === 'operation') return 'operation';
	if (role === 'people_ops' || role === 'people' || role === 'people_admin') return 'people_ops';
	return 'super_admin';
}

function authenticateDashboardUser_(email, password) {
	var normalizedEmail = String(email || '').trim().toLowerCase();
	var normalizedPassword = String(password || '');

	if (!normalizedEmail || !normalizedPassword) {
		return null;
	}

	var snapshot = loadDashboardPayload_() || {};
	var snapshotUsers = Array.isArray(snapshot.users) ? snapshot.users : [];
	var users = getProductionAccounts_().concat(snapshotUsers);

	for (var i = 0; i < users.length; i++) {
		var user = users[i] || {};
		var userEmail = String(user.email || '').trim().toLowerCase();
		var userPassword = String(user.password || '');

		if (userEmail === normalizedEmail && userPassword === normalizedPassword) {
			return {
				id: user.id || ('admin-' + (i + 1)),
				name: user.name || 'Administrator',
				email: userEmail,
				role: normalizeRole_(user.role)
			};
		}
	}

	return null;
}

function doGet(e) {
	try {
		var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'load';
		if (action !== 'load') {
			return jsonOutput({ ok: false, error: 'Unsupported action for GET.' });
		}

		return jsonOutput({
			ok: true,
			data: loadDashboardPayload_(),
			sheetId: getSavedSpreadsheetId_(),
			sheetUrl: getSavedSpreadsheetId_() ? SpreadsheetApp.openById(getSavedSpreadsheetId_()).getUrl() : ''
		});
	} catch (error) {
		return jsonOutput({ ok: false, error: String(error) });
	}
}

function doPost(e) {
	try {
		var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
		if (action === 'save') {
			var payload = (e && e.parameter && e.parameter.payload) ? e.parameter.payload : '';
			var result = saveDashboardPayload_(payload);

			return jsonOutput({ ok: true, data: result });
		}

		if (action === 'auth') {
			var email = (e && e.parameter && e.parameter.email) ? e.parameter.email : '';
			var password = (e && e.parameter && e.parameter.password) ? e.parameter.password : '';
			var user = authenticateDashboardUser_(email, password);

			if (!user) {
				return jsonOutput({ ok: false, error: 'Invalid email or password.' });
			}

			return jsonOutput({ ok: true, data: user });
		}

		return jsonOutput({ ok: false, error: 'Unsupported action for POST.' });
	} catch (error) {
		return jsonOutput({ ok: false, error: String(error) });
	}
}
