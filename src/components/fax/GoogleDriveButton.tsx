import React from 'react';
import { LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

interface GoogleDriveButtonProps {
  onSuccess: (response: any) => void;
  isDevelopment?: boolean;
}

const GoogleDriveButton: React.FC<GoogleDriveButtonProps> = ({ 
  onSuccess,
  isDevelopment = false
}) => {
  const handleError = () => {
    toast.error('Failed to connect to Google Drive');
  };

  if (isDevelopment) {
    return (
      <button
        onClick={() => onSuccess({ credential: 'mock-credential' })}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign in with Google (Development)
      </button>
    );
  }

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={handleError}
      useOneTap
      theme="filled_blue"
      text="continue_with"
      shape="rectangular"
      size="large"
      width="250"
      context="use"
    />
  );
};

export default GoogleDriveButton;