export function initializeApp(): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
    if (!document.title) document.title = 'SEF Multimedia';
  }
}

export function validateEnvironment(): void {
  const env = (import.meta as any).env || {};
  const missing: string[] = [];
  if (!env.VITE_GOOGLE_CLIENT_ID) missing.push('VITE_GOOGLE_CLIENT_ID');
  if (!env.VITE_ADMIN_EMAIL) missing.push('VITE_ADMIN_EMAIL');
  if (!env.VITE_ADMIN_PASSWORD) missing.push('VITE_ADMIN_PASSWORD');
  if (missing.length > 0) {
    // Friendly console warning for developer
    // Keep silent in production builds if env injection is not present
    try {
      // eslint-disable-next-line no-console
      console.warn(`Missing required env vars: ${missing.join(', ')}. Add them to your .env`);
    } catch (e) {
      // noop
    }
  }
}
