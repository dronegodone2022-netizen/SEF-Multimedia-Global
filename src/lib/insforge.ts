import { createClient } from '@insforge/sdk';

const insforgeBaseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || 'https://u982itk4.us-east.insforge.app';
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || '';
const adminDashboardRedirectUrl = typeof window !== 'undefined' ? window.location.origin + '/admin' : 'http://localhost:3001/admin';
const academyPortalRedirectUrl = typeof window !== 'undefined' ? window.location.origin + '/courses' : 'http://localhost:3001/courses';

export interface InsforgeUser {
  id: string;
  email: string;
  name: string;
}

export interface AcademyEnrollmentRecord {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  course_title: string;
  payment_status: string;
  total_fee: number;
  notes: string;
  created_at: string;
}

const DASHBOARD_FORM_RECORD_TABLES = {
  client: 'client_form_records',
  booking: 'booking_form_records',
  project: 'project_form_records',
  employee: 'employee_form_records',
  freelancer: 'freelancer_form_records',
  invoice: 'invoice_form_records',
  payment: 'payment_form_records',
  expense: 'expense_form_records',
  petty_cash: 'petty_cash_form_records',
  asset: 'asset_form_records',
  student: 'student_form_records',
  dashboard: 'dashboard_form_records',
} as const;

export const insforgeClient = createClient({
  baseUrl: insforgeBaseUrl,
  anonKey: insforgeAnonKey,
});

const normalizeInsforgeUser = (user: any): InsforgeUser | null => {
  if (!user?.id || !user?.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.profile?.name || user.name || user.email,
  };
};

export const getCurrentInsforgeUser = (): InsforgeUser | null => {
  const authApi = (insforgeClient as any)?.auth;
  const session = typeof authApi?.getSession === 'function' ? authApi.getSession() : null;
  const userResponse = typeof authApi?.getUser === 'function' ? authApi.getUser() : null;
  const user = userResponse?.data ?? userResponse;

  if (!session || !user) {
    return null;
  }

  return normalizeInsforgeUser(user);
};

export const getCurrentInsforgeUserAsync = async (): Promise<InsforgeUser | null> => {
  const authApi = (insforgeClient as any)?.auth;
  if (typeof authApi?.getCurrentUser !== 'function') {
    return getCurrentInsforgeUser();
  }

  const { data, error } = await authApi.getCurrentUser();
  const user = data?.user ?? data;
  if (error || !user?.id || !user?.email) {
    return getCurrentInsforgeUser();
  }

  return normalizeInsforgeUser(user);
};

export const signUpWithEmail = async (input: { email: string; password: string; name: string; redirectTo?: string }) => {
  return insforgeClient.auth.signUp({
    email: input.email,
    password: input.password,
    name: input.name,
    redirectTo: input.redirectTo || academyPortalRedirectUrl,
  });
};

export const signInWithEmail = async (input: { email: string; password: string }) => {
  return insforgeClient.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
};

export const signOutFromInsforge = async () => {
  const authApi = (insforgeClient as any)?.auth;
  if (typeof authApi?.signOut === 'function') {
    await authApi.signOut();
  }
  return true;
};

const resolveInsforgeAdminCredentialsFromStorage = (): { email: string; password: string; name?: string } | null => {
  try {
    const lastAdminEmail = localStorage.getItem('last_admin_email');
    const storedAccountsRaw = localStorage.getItem('sef_admin_accounts');

    const candidateAccounts = [
      ...(storedAccountsRaw ? JSON.parse(storedAccountsRaw) : []),
    ].filter(Boolean);

    const match = candidateAccounts.find((account: any) => {
      const email = String(account?.email || '').trim().toLowerCase();
      return email && (email === String(lastAdminEmail || '').trim().toLowerCase() || !lastAdminEmail);
    });

    if (match?.email && match?.password) {
      return {
        email: String(match.email),
        password: String(match.password),
        name: String(match.name || match.email),
      };
    }
  } catch {
    // Ignore malformed local admin credentials; the save will fail cleanly if no valid session exists.
  }

  return null;
};

const ensureInsforgeWriteSession = async (): Promise<InsforgeUser | null> => {
  const currentUser = await getCurrentInsforgeUserAsync();
  if (currentUser?.id) {
    return currentUser;
  }

  const adminCredentials = resolveInsforgeAdminCredentialsFromStorage();
  if (!adminCredentials) {
    return null;
  }

  const signInResponse = await signInWithEmail({ email: adminCredentials.email, password: adminCredentials.password });
  if (!(signInResponse as any)?.error) {
    const signedInUser = normalizeInsforgeUser((signInResponse as any).data?.user ?? (signInResponse as any).data);
    if (signedInUser) {
      return signedInUser;
    }
    return getCurrentInsforgeUserAsync();
  }

  return null;
};

const bootstrapDashboardFormTables = async () => {
  try {
    const { data, error } = await insforgeClient.functions.invoke('bootstrap', {
      body: { purpose: 'ensure-dashboard-form-record-tables' },
      method: 'POST',
    });

    if (error) {
      console.warn('Dashboard form table bootstrap failed.', error);
      return false;
    }

    return Boolean(data?.ok);
  } catch (error) {
    console.warn('Dashboard form table bootstrap threw an error.', error);
    return false;
  }
};

export const persistAdminDashboardFormRecord = async (input: {
  tableKey: keyof typeof DASHBOARD_FORM_RECORD_TABLES;
  formName: string;
  sourceView: string;
  formData: object;
  status?: string;
}) => {
  const currentUser = await ensureInsforgeWriteSession();
  if (!currentUser?.id) {
    console.warn('Skipping dashboard form persistence because the browser has no active InsForge user session.');
    return null;
  }

  const tableName = DASHBOARD_FORM_RECORD_TABLES[input.tableKey];
  const payload = {
    form_name: input.formName,
    source_view: input.sourceView,
    form_data: input.formData,
    status: input.status || 'submitted',
  };

  const response = await insforgeClient.database
    .from(tableName)
    .insert([payload])
    .select();

  if ((response as any)?.error) {
    const errorText = JSON.stringify((response as any).error || {});
    const missingTable = /does not exist|relation .* does not exist|not found/i.test(errorText);

    if (missingTable) {
      const bootstrapSucceeded = await bootstrapDashboardFormTables();
      if (bootstrapSucceeded) {
        const retryResponse = await insforgeClient.database
          .from(tableName)
          .insert([payload])
          .select();

        if (!(retryResponse as any)?.error) {
          return retryResponse;
        }

        console.warn(`Dashboard form persistence retry failed for ${tableName}.`, (retryResponse as any).error);
        return null;
      }
    }

    console.warn(`Dashboard form persistence failed for ${tableName}.`, (response as any).error);
    return null;
  }

  return response;
};

export const uploadAdminFileToStorage = async (input: {
  file: File;
  folder: string;
  fileName?: string;
}) => {
  const currentUser = await ensureInsforgeWriteSession();
  if (!currentUser?.id) {
    throw new Error('No active admin session is available for file upload.');
  }

  const normalizedFolder = String(input.folder || 'files')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'files';

  const extension = input.file.name.includes('.')
    ? input.file.name.slice(input.file.name.lastIndexOf('.'))
    : '';
  const objectKey = `${normalizedFolder}/${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`;

  const { data, error } = await insforgeClient.storage
    .from('admin-files')
    .upload(objectKey, input.file);

  if (error || !data) {
    throw error || new Error('File upload failed.');
  }

  return {
    ...data,
    key: objectKey,
    url: data.url || '',
  };
};

export const removeAdminStoredFile = async (storageKey: string) => {
  const currentUser = await ensureInsforgeWriteSession();
  if (!currentUser?.id) {
    return false;
  }

  const { error } = await insforgeClient.storage
    .from('admin-files')
    .remove(storageKey);

  if (error) {
    console.warn('Failed to remove stored admin file.', error);
    return false;
  }

  return true;
};

export const createAcademyEnrollment = async (input: {
  full_name: string;
  email: string;
  phone: string;
  course_title: string;
  payment_status?: string;
  total_fee?: number;
  notes?: string;
}) => {
  const currentUser = await getCurrentInsforgeUserAsync();
  if (!currentUser?.id) {
    throw new Error('Student session is not available for enrollment save.');
  }

  const payload = {
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    course_title: input.course_title,
    payment_status: input.payment_status || 'unpaid',
    total_fee: input.total_fee || 0,
    notes: input.notes || '',
    user_id: currentUser.id,
  };

  const response = await insforgeClient.database
    .from('academy_enrollments')
    .insert([payload])
    .select();

  if ((response as any)?.error) {
    throw (response as any).error;
  }

  return response;
};

export const loadUserEnrollments = async (userId: string) => {
  return insforgeClient.database
    .from('academy_enrollments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};
