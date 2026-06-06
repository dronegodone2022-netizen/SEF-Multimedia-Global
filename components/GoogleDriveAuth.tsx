import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Cloud, CheckCircle, AlertCircle } from 'lucide-react';
import { GoogleDriveService } from '../services/googleDriveService';

interface GoogleDriveAuthProps {
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
}

const GoogleDriveAuth: React.FC<GoogleDriveAuthProps> = ({
  onAuthSuccess,
  onAuthError
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsAuthenticating(true);
        setAuthStatus('idle');

        // Store the access token in both legacy and current keys
        localStorage.setItem('google_access_token', tokenResponse.access_token);
        localStorage.setItem('googleDriveToken', tokenResponse.access_token);
        GoogleDriveService.setAccessToken(tokenResponse.access_token);

        // Initialize folder structure and store folder IDs
        await GoogleDriveService.getFolderIdsAsync();

        setAuthStatus('success');
        onAuthSuccess?.();

        // Reload the page to refresh all data
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error('Authentication error:', error);
        setAuthStatus('error');
        const message = error instanceof Error ? error.message : 'Authentication failed';
        setErrorMessage(message);
        onAuthError?.(message);
      } finally {
        setIsAuthenticating(false);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setAuthStatus('error');
      setErrorMessage('Login failed. Please try again.');
      onAuthError?.('Login failed. Please try again.');
      setIsAuthenticating(false);
    },
    scope: 'https://www.googleapis.com/auth/drive',
  });

  const handleAuth = () => {
    setIsAuthenticating(true);
    setAuthStatus('idle');
    setErrorMessage('');
    login();
  };

  const isAuthenticated = !!(
    localStorage.getItem('google_access_token') ||
    localStorage.getItem('googleDriveToken')
  );

  if (isAuthenticated && authStatus !== 'success') {
    return (
      <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
        <CheckCircle size={20} className="text-green-600" />
        <span className="ml-2 text-sm text-green-800">
          Connected to Google Drive
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={handleAuth}
        disabled={isAuthenticating}
        className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
          isAuthenticating
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
            : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
        }`}
      >
        <Cloud size={20} className={isAuthenticating ? 'text-gray-500' : 'text-blue-600'} />
        <span className={`ml-2 text-sm ${isAuthenticating ? 'text-gray-600' : 'text-blue-800'}`}>
          {isAuthenticating ? 'Connecting...' : 'Connect Google Drive'}
        </span>
      </button>

      {authStatus === 'success' && (
        <div className="flex items-center bg-green-50 px-3 py-2 rounded border border-green-200">
          <CheckCircle size={16} className="text-green-600" />
          <span className="ml-2 text-sm text-green-800">
            Successfully connected! Creating folders...
          </span>
        </div>
      )}

      {authStatus === 'error' && (
        <div className="flex items-center bg-red-50 px-3 py-2 rounded border border-red-200">
          <AlertCircle size={16} className="text-red-600" />
          <span className="ml-2 text-sm text-red-800">
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveAuth;