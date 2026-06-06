export class GoogleDriveService {
  private static accessToken: string | null = null;

  static setAccessToken(token: string) {
    this.accessToken = token;
    try {
      localStorage.setItem('googleDriveToken', token);
    } catch (e) {
      // ignore storage errors in non-browser environments
    }
  }
  static async getFolderIdsAsync(): Promise<Record<string, string>> {
    return {
      root: 'root-folder-id',
      projects: 'projects-folder-id',
      invoices: 'invoices-folder-id',
      reports: 'reports-folder-id',
    };
  }
}
