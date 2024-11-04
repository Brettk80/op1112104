import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, MoveUp, MoveDown, File, Eye, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import DocumentOptimizationWarning from './DocumentOptimizationWarning';
import DocumentPreview from './DocumentPreview';
import GoogleDrivePicker from './GoogleDrivePicker';
import { analyzePdfDocument } from '../../lib/pdfAnalyzer';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  optimizationIssues?: {
    hasColorContent: boolean;
    hasBackgroundElements: boolean;
    hasLargeImages: boolean;
    pageCount: number;
  };
}

interface DocumentUploaderProps {
  onDocumentsUploaded: (files: File[]) => void;
  existingDocuments?: File[];
  onUploadingChange?: (isUploading: boolean) => void;
  onNext?: () => void;
  onBack?: () => void;
  onStartOver?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentsUploaded,
  existingDocuments = [],
  onUploadingChange,
  onNext,
  onBack,
  onStartOver
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(() =>
    existingDocuments.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 100
    }))
  );
  const [previewFile, setPreviewFile] = useState<{ file: File; name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showGoogleDrive, setShowGoogleDrive] = useState(false);
  const [optimizationWarnings, setOptimizationWarnings] = useState<{[key: string]: any}>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    onUploadingChange?.(true);

    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Analyze each PDF for optimization warnings
    for (const fileWrapper of newFiles) {
      if (fileWrapper.file.type === 'application/pdf') {
        try {
          const issues = await analyzePdfDocument(fileWrapper.file);
          setOptimizationWarnings(prev => ({
            ...prev,
            [fileWrapper.id]: issues
          }));
        } catch (error) {
          console.error('PDF analysis error:', error);
        }
      }
    }

    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prev => 
        prev.map(f => ({
          ...f,
          progress: Math.min(f.progress + 10, 100)
        }))
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      onUploadingChange?.(false);
      onDocumentsUploaded(acceptedFiles);
    }, 2000);
  }, [onDocumentsUploaded, onUploadingChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setOptimizationWarnings(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleMoveFile = (id: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(f => f.id === id);
      if (index === -1) return prev;
      
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= newFiles.length) return prev;
      
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleGoogleDriveFile = async (file: File) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id ? { ...f, progress: Math.min(progress, 100) } : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        onUploadingChange?.(false);
        onDocumentsUploaded([file]);
      }
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowGoogleDrive(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Import from Google Drive
        </button>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop your fax documents here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, DOC, DOCX (Max 10MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={file.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewFile({ file: file.file, name: file.file.name })}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {index > 0 && (
                    <button
                      onClick={() => handleMoveFile(file.id, 'up')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoveUp className="h-4 w-4" />
                    </button>
                  )}
                  {index < files.length - 1 && (
                    <button
                      onClick={() => handleMoveFile(file.id, 'down')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoveDown className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {file.progress < 100 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {optimizationWarnings[file.id] && (
                <DocumentOptimizationWarning
                  fileName={file.file.name}
                  issues={optimizationWarnings[file.id]}
                  onPreview={() => setPreviewFile({ file: file.file, name: file.file.name })}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {showGoogleDrive && (
        <GoogleDrivePicker
          onFileSelected={handleGoogleDriveFile}
          onClose={() => setShowGoogleDrive(false)}
        />
      )}

      {previewFile && (
        <DocumentPreview
          file={previewFile.file}
          fileName={previewFile.name}
          onClose={() => setPreviewFile(null)}
          onDownload={() => {
            const url = URL.createObjectURL(previewFile.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = previewFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        />
      )}

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {onStartOver && (
            <button
              onClick={onStartOver}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Start Over
            </button>
          )}
        </div>
        {onNext && files.length > 0 && (
          <button
            onClick={onNext}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;