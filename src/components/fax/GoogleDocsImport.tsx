import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import GoogleDriveButton from './GoogleDriveButton';

interface GoogleDocsImportProps {
  onImport: (file: File) => void;
  onClose: () => void;
}

interface GoogleDocument {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

const GoogleDocsImport: React.FC<GoogleDocsImportProps> = ({ onImport, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<GoogleDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDevelopment = import.meta.env.DEV && !import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isDevelopment) {
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocuments([
          {
            id: '1',
            name: 'Example Document.pdf',
            mimeType: 'application/pdf',
            modifiedTime: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Sample Contract.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            modifiedTime: new Date().toISOString()
          }
        ]);
        return;
      }

      const { credential } = response;
      if (!credential) {
        throw new Error('Authentication failed');
      }

      const files = await fetchGoogleDriveFiles(credential);
      setDocuments(files);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoogleDriveFiles = async (credential: string) => {
    const response = await fetch('/api/google/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch files from Google Drive');
    }

    return response.json();
  };

  const handleImport = async () => {
    if (!selectedDoc) return;

    setIsLoading(true);
    setError(null);

    try {
      const doc = documents.find(d => d.id === selectedDoc);
      if (!doc) throw new Error('Document not found');

      if (isDevelopment) {
        // Mock file for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockBlob = new Blob(['Mock content'], { type: 'application/pdf' });
        const file = new File([mockBlob], doc.name, { type: 'application/pdf' });
        onImport(file);
        onClose();
        return;
      }

      const response = await fetch(`/api/google/download?fileId=${selectedDoc}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const file = new File([blob], doc.name, { type: doc.mimeType });
      
      onImport(file);
      onClose();
      toast.success('File imported successfully');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import file';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
            {isDevelopment && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Development mode: Using mock Google Drive integration
                </p>
              </div>
            )}
            <GoogleDriveButton 
              onSuccess={handleSuccess}
              isDevelopment={isDevelopment}
            />
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
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      Modified {new Date(doc.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

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