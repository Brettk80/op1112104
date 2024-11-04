import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Get client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Validate client ID
if (!GOOGLE_CLIENT_ID) {
  console.warn('Missing VITE_GOOGLE_CLIENT_ID environment variable. Google Drive integration will be disabled.');
}

// Get the correct origin based on the environment
const getOrigin = () => {
  // Production URLs
  if (import.meta.env.PROD) {
    return 'https://bolt.new';
  }
  
  // Development URLs - must match exactly what's configured in Google Cloud Console
  if (window.location.hostname.includes('stackblitz.io')) {
    return 'https://stackblitz.io';
  }
  if (window.location.hostname.includes('webcontainer.io')) {
    return 'https://webcontainer.io';
  }
  
  return window.location.origin;
};

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  // Only render provider if client ID is available
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={(error) => {
        console.error('Google OAuth script failed to load:', error);
      }}
    >
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;