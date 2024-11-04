import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, X, Loader2, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

interface GoogleDocsImportProps {
  onImport: (file: File) => void;
  onClose: () => void;
}

const GoogleDocsImport: React.FC<GoogleDocsImportProps> = ({ onImport, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  const hasClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      // In development without a client ID, use mock data
      if (isDevelopment && !hasClientId) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setDocuments([
          {
            id: '1',
            name: 'Sample Document 1.pdf',
            mimeType: 'application/pdf',
            modifiedTime: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Sample Document 2.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            modifiedTime: new Date().toISOString()
          }
        ]);
        return;
      }

      // Real implementation for production
      const response = await fetch('/api/google/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!response.ok) throw new Error('Failed to authenticate');

      const { accessToken } = await response.json();

      const filesResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          q: "mimeType='application/pdf' or mimeType='application/msword' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType='application/vnd.google-apps.document'",
          fields: 'files(id, name, mimeType, modifiedTime)',
        },
      });

      if (!filesResponse.ok) throw new Error('Failed to fetch files');

      const { files } = await filesResponse.json();
      setDocuments(files);

    } catch (error) {
      console.error('Google Drive import error:', error);
      toast.error('Failed to connect to Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedDoc) return;

    setIsLoading(true);
    try {
      const doc = documents.find(d => d.id === selectedDoc);
      
      // In development without a client ID, create a mock file
      if (isDevelopment && !hasClientId) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        const mockContent = new Blob(['Mock file content'], { type: 'application/pdf' });
        const file = new File([mockContent], doc.name, { type: doc.mimeType });
        onImport(file);
        onClose();
        toast.success('File imported successfully');
        return;
      }

      // Real implementation for production
      if (doc.mimeType === 'application/vnd.google-apps.document') {
        const response = await fetch(`/api/google/export?fileId=${selectedDoc}&mimeType=application/pdf`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to export document');

        const blob = await response.blob();
        const file = new File([blob], `${doc.name}.pdf`, { type: 'application/pdf' });
        onImport(file);
      } else {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${selectedDoc}?alt=media`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to download file');

        const blob = await response.blob();
        const file = new File([blob], doc.name, { type: doc.mimeType });
        onImport(file);
      }

      onClose();
      toast.success('File imported successfully');

    } catch (error) {
      console.error('File import error:', error);
      toast.error('Failed to import file');
    } finally {
      setIsLoading(false);
    }
  };

  // If in development without client ID, show mock sign-in button
  const renderSignIn = () => {
    if (isDevelopment && !hasClientId) {
      return (
        <button
          onClick={() => handleSuccess({})}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign in with Google (Development Mode)
        </button>
      );
    }

    return (
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          toast.error('Google Sign In Failed');
        }}
        useOneTap
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-lg w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Import from Google Drive</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!documents.length ? (
          <div className="text-center py-8">
            {isDevelopment && !hasClientId && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Running in development mode without Google OAuth configuration. 
                  Mock functionality is enabled for testing.
                </p>
              </div>
            )}
            {renderSignIn()}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    selectedDoc === doc.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      Modified {new Date(doc.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={isLoading || !selectedDoc}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Importing...
                  </>
                ) : (
                  'Import Selected'
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GoogleDocsImport;