import { forceSaveStore, getDataStore, reloadStore } from '../../services/dataStore';

const ADMIN_AUTH_KEY = 'admin_authenticated';
const ADMIN_LAST_ACTIVE_KEY = 'admin_last_active';
const ADMIN_LAST_VISIT_KEY = 'admin_last_visit';
const ADMIN_INACTIVITY_TIMEOUT_MS = 2 * 60 * 1000;
const ADMIN_SESSION_TIMEOUT_MS = 3 * 60 * 1000;

function getTimestamp(key: string): number {
  const value = localStorage.getItem(key);
  if (!value) return 0;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function updateTimestamp(key: string, timestamp = Date.now()): void {
  localStorage.setItem(key, timestamp.toString());
}

function clearAdminSessionStorage(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_LAST_ACTIVE_KEY);
  localStorage.removeItem(ADMIN_LAST_VISIT_KEY);
}

export function isAdminAuthenticated(): boolean {
	try {
		const isAuthenticated = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
		if (!isAuthenticated) return false;

		const now = Date.now();
		const lastActive = getTimestamp(ADMIN_LAST_ACTIVE_KEY);
		const lastVisit = getTimestamp(ADMIN_LAST_VISIT_KEY);

		if (lastActive && now - lastActive > ADMIN_INACTIVITY_TIMEOUT_MS) {
			clearAdminSessionStorage();
			return false;
		}

		if (lastVisit && now - lastVisit > ADMIN_SESSION_TIMEOUT_MS) {
			clearAdminSessionStorage();
			return false;
		}

		return true;
	} catch (e) {
		return false;
	}
}

export function loginAdmin(): void {
	try {
		localStorage.setItem(ADMIN_AUTH_KEY, 'true');
		updateTimestamp(ADMIN_LAST_ACTIVE_KEY);
		updateTimestamp(ADMIN_LAST_VISIT_KEY);

		// Reload persisted data into in-memory arrays so the dashboard shows stored data after login
		reloadStore();
	} catch (e) {
		// ignore
	}
}

export function logoutAdmin(): void {
	try {
		// Force save all data before logout
		const dataStore = getDataStore();
		forceSaveStore(dataStore);
		clearAdminSessionStorage();
  } catch (e) {
    // ignore
  }
}

export function updateAdminLastActive(): void {
  try {
    updateTimestamp(ADMIN_LAST_ACTIVE_KEY);
  } catch (e) {
    // ignore
  }
}

export function updateAdminLastVisit(): void {
  try {
    updateTimestamp(ADMIN_LAST_VISIT_KEY);
  } catch (e) {
    // ignore
  }
}

export function verifyAdminCredentials(email: string, password: string): boolean {
	// Legacy credential fallback is disabled. Authentication must be handled by backend services.
	void email;
	void password;
	return false;
}
