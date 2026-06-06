import { Booking, Client, Commission, Employee, Expense, Freelancer, Invoice, Payment, PettyCash } from '../types';

const STORAGE_KEY = 'sef-multimedia-data-store';

interface StoreData {
	bookings: Booking[];
	payments: Payment[];
	clients: Client[];
	expenses: Expense[];
	pettyCashRecords: PettyCash[];
	employees: Employee[];
	freelancers: Freelancer[];
	commissions: Commission[];
	invoices: Invoice[];
}

const defaultStore: StoreData = {
	bookings: [],
	payments: [],
	clients: [],
	expenses: [],
	pettyCashRecords: [],
	employees: [],
	freelancers: [],
	commissions: [],
	invoices: [],
};

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

const dateKeys = new Set([
	'createdAt',
	'updatedAt',
	'lastBooking',
	'scheduledDate',
	'dueDate',
	'paidDate',
	'hireDate',
	'joinDate',
	'paymentDate',
	'issuedDate',
	'date',
]);

function reviveDateFields<T extends object>(item: T): T {
	const revived = { ...item } as Record<string, unknown>;
	for (const key of Object.keys(revived)) {
		if (dateKeys.has(key) && typeof revived[key] === 'string') {
			const parsed = new Date(revived[key] as string);
			if (!Number.isNaN(parsed.getTime())) {
				revived[key] = parsed;
			}
		}
	}
	return revived as T;
}

function reviveArray<T extends object>(items: unknown[]): T[] {
	return items.map((item) => (typeof item === 'object' && item !== null ? reviveDateFields(item as T) : item as T));
}

function loadStore(): StoreData {
	if (!isBrowser()) {
		return defaultStore;
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return defaultStore;
		}

		const parsed = JSON.parse(raw) as Partial<StoreData>;
		return {
			bookings: Array.isArray(parsed.bookings) ? reviveArray<Booking>(parsed.bookings) : defaultStore.bookings,
			payments: Array.isArray(parsed.payments) ? reviveArray<Payment>(parsed.payments) : defaultStore.payments,
			clients: Array.isArray(parsed.clients) ? reviveArray<Client>(parsed.clients) : defaultStore.clients,
			expenses: Array.isArray(parsed.expenses) ? reviveArray<Expense>(parsed.expenses) : defaultStore.expenses,
			pettyCashRecords: Array.isArray(parsed.pettyCashRecords) ? reviveArray<PettyCash>(parsed.pettyCashRecords) : defaultStore.pettyCashRecords,
			employees: Array.isArray(parsed.employees) ? reviveArray<Employee>(parsed.employees) : defaultStore.employees,
			freelancers: Array.isArray(parsed.freelancers) ? reviveArray<Freelancer>(parsed.freelancers) : defaultStore.freelancers,
			commissions: Array.isArray(parsed.commissions) ? reviveArray<Commission>(parsed.commissions) : defaultStore.commissions,
			invoices: Array.isArray(parsed.invoices) ? reviveArray<Invoice>(parsed.invoices) : defaultStore.invoices,
		};
	} catch (error) {
		console.warn('Failed to load persisted data store:', error);
		return defaultStore;
	}
}

let saveTimeout: NodeJS.Timeout | null = null;

function saveStore(store: StoreData): void {
	if (!isBrowser()) {
		return;
	}

	// Clear previous timeout if exists
	if (saveTimeout) {
		clearTimeout(saveTimeout);
	}

	// Debounce saves to avoid excessive localStorage writes
	saveTimeout = setTimeout(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
			console.log('Data store saved to localStorage');
		} catch (error) {
			console.warn('Failed to save persisted data store:', error);
		}
		saveTimeout = null;
	}, 100);
}

// Export a function to force immediate save (useful for logout/critical operations)
export function forceSaveStore(store: StoreData): void {
	if (!isBrowser()) {
		return;
	}

	if (saveTimeout) {
		clearTimeout(saveTimeout);
		saveTimeout = null;
	}

	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
		console.log('Data store saved immediately to localStorage');
	} catch (error) {
		console.warn('Failed to save persisted data store:', error);
	}
}

const loadedStore = loadStore();

const dataStore: StoreData = {
	bookings: loadedStore.bookings,
	payments: loadedStore.payments,
	clients: loadedStore.clients,
	expenses: loadedStore.expenses,
	pettyCashRecords: loadedStore.pettyCashRecords,
	employees: loadedStore.employees,
	freelancers: loadedStore.freelancers,
	commissions: loadedStore.commissions,
	invoices: loadedStore.invoices,
};

function persistedArray<T>(arr: T[], key: keyof StoreData): T[] {
	return new Proxy(arr, {
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof prop === 'string' && typeof value === 'function') {
				const mutatingMethods = [
					'copyWithin',
					'fill',
					'pop',
					'push',
					'reverse',
					'shift',
					'sort',
					'splice',
					'unshift',
				];

				if (mutatingMethods.includes(prop)) {
					return (...args: any[]) => {
						const result = (value as Function).apply(target, args);
						saveStore(dataStore);
						return result;
					};
				}
			}
			return value;
		},
		set(target, prop, value, receiver) {
			const result = Reflect.set(target, prop, value, receiver);
			if (typeof prop === 'string') {
				const index = Number(prop);
				if (!Number.isNaN(index) || prop === 'length') {
					saveStore(dataStore);
				}
			}
			return result;
		},
	});
}

export const bookings: Booking[] = persistedArray(dataStore.bookings, 'bookings');
export const payments: Payment[] = persistedArray(dataStore.payments, 'payments');
export const clients: Client[] = persistedArray(dataStore.clients, 'clients');
export const expenses: Expense[] = persistedArray(dataStore.expenses, 'expenses');
export const pettyCashRecords: PettyCash[] = persistedArray(dataStore.pettyCashRecords, 'pettyCashRecords');
export const employees: Employee[] = persistedArray(dataStore.employees, 'employees');
export const freelancers: Freelancer[] = persistedArray(dataStore.freelancers, 'freelancers');
export const commissions: Commission[] = persistedArray(dataStore.commissions, 'commissions');
export const invoices: Invoice[] = persistedArray(dataStore.invoices, 'invoices');

// Export function to get the raw data store (for manual persistence operations)
export function getDataStore(): StoreData {
	return dataStore;
}
export function reloadStore(): void {
	if (!isBrowser()) return;
	try {
		const loaded = loadStore();

		// Mutate the existing arrays so any references (proxies) stay valid
		dataStore.bookings.splice(0, dataStore.bookings.length, ...reviveArray<Booking>(loaded.bookings));
		dataStore.payments.splice(0, dataStore.payments.length, ...reviveArray<Payment>(loaded.payments));
		dataStore.clients.splice(0, dataStore.clients.length, ...reviveArray<Client>(loaded.clients));
		dataStore.expenses.splice(0, dataStore.expenses.length, ...reviveArray<Expense>(loaded.expenses));
		dataStore.pettyCashRecords.splice(0, dataStore.pettyCashRecords.length, ...reviveArray<PettyCash>(loaded.pettyCashRecords));
		dataStore.employees.splice(0, dataStore.employees.length, ...reviveArray<Employee>(loaded.employees));
		dataStore.freelancers.splice(0, dataStore.freelancers.length, ...reviveArray<Freelancer>(loaded.freelancers));
		dataStore.commissions.splice(0, dataStore.commissions.length, ...reviveArray<Commission>(loaded.commissions));
		dataStore.invoices.splice(0, dataStore.invoices.length, ...reviveArray<Invoice>(loaded.invoices));
		console.log('Data store reloaded from localStorage');
	} catch (err) {
		console.warn('Failed to reload persisted data store:', err);
	}
}

// Ensure store is saved initially (debounced)
saveStore(dataStore);
