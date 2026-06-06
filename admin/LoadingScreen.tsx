import React from 'react';
const logoUrl = 'https://picsum.photos/seed/sef-export-logo/200/200';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading information...' }) => (
  <div className="min-h-[60vh] w-full flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="relative h-28 w-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        <div className="h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center">
          <img src={logoUrl} alt="SEF Multimedia Global logo" className="h-16 w-16 object-contain animate-pulse" />
        </div>
      </div>
      <div>
        <p className="text-base font-semibold text-gray-800">{message}</p>
        <p className="mt-1 text-sm text-gray-500">Please wait while we prepare your records.</p>
      </div>
    </div>
  </div>
);

export default LoadingScreen;
