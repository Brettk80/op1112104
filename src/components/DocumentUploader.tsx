import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, MoveUp, MoveDown, File, Eye, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import DocumentOptimizationWarning from './DocumentOptimizationWarning';
import DocumentPreview from './DocumentPreview';
import GoogleDocsImport from './GoogleDocsImport';
import { analyzePdfDocument } from '../../lib/pdfAnalyzer';
import { createPdfPreview } from '../../lib/pdfPreview';

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
  onNext: () => void;
  onBack: () => void;
  onStartOver: () => void;
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
  const [showGoogleDocs, setShowGoogleDocs] = useState(false);
  const uploadedFilesRef = useRef<File[]>([]);

  useEffect(() => {
    const processFiles = async () => {
      const updatedFiles = [...files];
      let hasChanges = false;

      for (let i = 0; i < updatedFiles.length; i++) {
        const file = updatedFiles[i];
        if (!file.optimizationIssues && file.file.type === 'application/pdf') {
          try {
            const issues = await analyzePdfDocument(file.file);
            updatedFiles[i] = { ...file, optimizationIssues: issues };
            hasChanges = true;
          } catch (error) {
            console.error('Error analyzing PDF:', error);
          }
        }
      }

      if (hasChanges) {
        setFiles(updatedFiles);
      }
    };

    processFiles();
  }, [files]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    onUploadingChange?.(true);

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    for (const newFile of newFiles) {
      let progress = 0;
      const interval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(interval);
          return;
        }
        progress += 10;
        setFiles(prev =>
          prev.map(f =>
            f.id === newFile.id ? { ...f, progress } : f
          )
        );
      }, 200);
    }

    // Update uploaded files ref
    uploadedFilesRef.current = [...uploadedFilesRef.current, ...acceptedFiles];
    onDocumentsUploaded(uploadedFilesRef.current);

    setIsUploading(false);
    onUploadingChange?.(false);
  }, [onDocumentsUploaded, onUploadingChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      uploadedFilesRef.current = updatedFiles.map(f => f.file);
      onDocumentsUploaded(uploadedFilesRef.current);
      return updatedFiles;
    });
  };

  const handleMoveFile = (fileId: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(f => f.id === fileId);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updatedFiles = [...prev];
      [updatedFiles[index], updatedFiles[newIndex]] = [updatedFiles[newIndex], updatedFiles[index]];
      
      uploadedFilesRef.current = updatedFiles.map(f => f.file);
      onDocumentsUploaded(uploadedFilesRef.current);
      
      return updatedFiles;
    });
  };

  const handleGoogleDocsImport = (file: File) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        onUploadingChange?.(false);
        return;
      }
      progress += 10;
      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id ? { ...f, progress } : f
        )
      );
    }, 200);

    // Update uploaded files ref
    uploadedFilesRef.current = [...uploadedFilesRef.current, file];
    onDocumentsUploaded(uploadedFilesRef.current);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowGoogleDocs(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Import from Google Docs
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
            <div
              key={file.id}
              className="bg-gray-50 rounded-lg p-4"
            >
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
                  {file.progress < 100 ? (
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {file.optimizationIssues && (
                <DocumentOptimizationWarning
                  fileName={file.file.name}
                  issues={file.optimizationIssues}
                  onPreview={() => setPreviewFile({ file: file.file, name: file.file.name })}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <button
            onClick={onStartOver}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Start Over
          </button>
        </div>

        <motion.button
          onClick={onNext}
          disabled={files.length === 0 || files.some(f => f.progress < 100)}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 8px rgba(59, 130, 246, 0.2)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Continue
        </motion.button>
      </div>

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

      {showGoogleDocs && (
        <GoogleDocsImport
          onImport={handleGoogleDocsImport}
          onClose={() => setShowGoogleDocs(false)}
        />
      )}
    </div>
  );
};

export default DocumentUploader;