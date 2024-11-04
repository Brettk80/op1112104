import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import GoogleDriveService from '../../lib/googleDrive';

interface GoogleDrivePickerProps {
  onFileSelected: (file: File) => void;
  onClose: () => void;
  allowedMimeTypes?: string[];
}

const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  onFileSelected,
  onClose,
  allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const driveService = GoogleDriveService.getInstance();
      const selectedFile = await driveService.createPicker(response.access_token, allowedMimeTypes);
      
      if (!selectedFile) {
        onClose();
        return;
      }

      const blob = await driveService.downloadFile(selectedFile.id, response.access_token);
      const file = new File([blob], selectedFile.name, { type: selectedFile.mimeType });
      
      onFileSelected(file);
      onClose();
      toast.success('File imported successfully');

    } catch (error) {
      console.error('Google Drive error:', error);
      setError('Failed to access Google Drive. Please try again.');
      toast.error('Failed to import file from Google Drive');
    } finally {
      setIsLoading(false);
    }
  }, [allowedMimeTypes, onFileSelected, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Import from Google Drive
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="mt-2 text-sm text-gray-600">
                Connecting to Google Drive...
              </p>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                setError('Failed to connect to Google Drive');
                toast.error('Google Sign In Failed');
              }}
              scope="https://www.googleapis.com/auth/drive.readonly"
              useOneTap
              flow="implicit"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GoogleDrivePicker;