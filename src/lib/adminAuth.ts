import { forceSaveStore, getDataStore, reloadStore } from '../../services/dataStore';
import { getCurrentInsforgeUserAsync, signInWithEmail, signOutFromInsforge } from './insforge';

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

export async function isAdminAuthenticatedAsync(): Promise<boolean> {
  try {
    const user = await getCurrentInsforgeUserAsync();
    return Boolean(user?.id);
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

export async function logoutAdmin(): Promise<void> {
  try {
    // Force save all data before logout
    const dataStore = getDataStore();
    forceSaveStore(dataStore);
    clearAdminSessionStorage();
    await signOutFromInsforge();
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

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  try {
    const response = await signInWithEmail({ email, password });
    const error = (response as any)?.error;
    if (error) {
      return false;
    }

    const user = (response as any)?.data?.user ?? (response as any)?.data;
    return Boolean(user?.id);
  } catch (e) {
    return false;
  }
}
