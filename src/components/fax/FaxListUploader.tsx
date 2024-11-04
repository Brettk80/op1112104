import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, X, Edit2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { readFileHeaders, validateFileType, validateFileSize } from './FileHeaderReader';
import ColumnMapper from './ColumnMapper';
import type { FaxRecipient, ListInfo } from './types';

interface FaxListUploaderProps {
  onListProcessed: (recipients: FaxRecipient[], listInfo: ListInfo) => void;
  onListRemoved: (id: string) => void;
  existingLists?: ListInfo[];
  onNext: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

interface UploadedList {
  id: string;
  file: File;
  columns: string[];
  mapping?: {
    faxNumber: string;
    toHeader?: string;
  };
  hasInternational?: boolean;
  isProcessed?: boolean;
  recordCount?: number;
}

const FaxListUploader: React.FC<FaxListUploaderProps> = ({
  onListProcessed,
  onListRemoved,
  existingLists = [],
  onNext,
  onBack,
  onStartOver
}) => {
  const [uploadedLists, setUploadedLists] = useState<UploadedList[]>([]);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = async (file: File): Promise<{ headers: string[]; recordCount: number }> => {
    if (!validateFileType(file)) {
      throw new Error('Invalid file type. Please upload a CSV, XLS, or XLSX file.');
    }

    if (!validateFileSize(file, 10)) {
      throw new Error('File size exceeds 10MB limit.');
    }

    try {
      const headers = await readFileHeaders(file);
      
      if (!headers || headers.length === 0) {
        throw new Error('No headers found in file.');
      }

      const recordCount = Math.floor(Math.random() * 100) + 1;
      return { headers, recordCount };
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error(`Failed to process ${file.name}. Please ensure the file is not corrupted and contains valid data.`);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      if (uploadedLists.some(l => l.file.name === file.name) ||
          existingLists.some(l => l.fileName === file.name)) {
        toast.error(`File "${file.name}" already exists`);
        continue;
      }

      try {
        const { headers, recordCount } = await processFile(file);
        const id = Date.now().toString();

        const faxPattern = /^(fax|faxnumber|fax.?number|fax.?#)$/i;
        const toPattern = /^(to|name|company|organization|physician|office)$/i;

        const faxColumn = headers.find(c => faxPattern.test(c));
        const toColumn = headers.find(c => toPattern.test(c));

        const mapping = faxColumn ? {
          faxNumber: faxColumn,
          toHeader: toColumn
        } : undefined;

        setUploadedLists(prev => [...prev, {
          id,
          file,
          columns: headers,
          mapping,
          isProcessed: false,
          recordCount
        }]);

        toast.success(`Successfully loaded ${file.name}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Failed to process ${file.name}`);
      }
    }
    
    setIsUploading(false);
  }, [uploadedLists, existingLists]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const handleRemoveList = (id: string) => {
    setUploadedLists(prev => prev.filter(list => list.id !== id));
    onListRemoved(id);
    if (editingListId === id) {
      setEditingListId(null);
    }
  };

  const handleColumnMapped = (
    listId: string,
    mapping: { faxNumber: string; toHeader?: string },
    hasInternational: boolean
  ) => {
    const list = uploadedLists.find(l => l.id === listId);
    if (!list) return;

    const listInfo: ListInfo = {
      id: list.id,
      fileName: list.file.name,
      recipientCount: list.recordCount || 0,
      mapping,
      hasInternational
    };

    const mockRecipients: FaxRecipient[] = Array(list.recordCount || 0)
      .fill(null)
      .map((_, i) => ({
        faxNumber: `+1234567${i.toString().padStart(3, '0')}`,
        toHeader: `Recipient ${i + 1}`
      }));

    setUploadedLists(prev =>
      prev.map(l =>
        l.id === listId
          ? { ...l, mapping, hasInternational, isProcessed: true }
          : l
      )
    );

    onListProcessed(mockRecipients, listInfo);
    setEditingListId(null);
  };

  const canProceed = uploadedLists.length > 0 && uploadedLists.every(list => list.isProcessed);

  return (
    <div className="space-y-6">
      {existingLists.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Uploaded Lists</h3>
          {existingLists.map(list => (
            <div
              key={list.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{list.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {list.recipientCount.toLocaleString()} recipients
                    {list.hasInternational && ' • Contains international numbers'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingListId(list.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleRemoveList(list.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {existingLists.length > 0 ? 'Add Another Contact List' : 'Upload Contact List'}
        </h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop your recipient lists, or click to select files
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: XLS, XLSX, CSV, TXT
          </p>
        </div>
      </div>

      {uploadedLists.map(list => (
        <React.Fragment key={list.id}>
          {(!list.isProcessed || editingListId === list.id) && (
            <ColumnMapper
              fileName={list.file.name}
              columns={list.columns}
              initialMapping={list.mapping}
              onConfirm={(mapping, hasInternational) => 
                handleColumnMapped(list.id, mapping, hasInternational)
              }
              onCancel={() => {
                if (!list.isProcessed) {
                  handleRemoveList(list.id);
                }
                setEditingListId(null);
              }}
              autoMapped={!!list.mapping}
            />
          )}
        </React.Fragment>
      ))}

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
          disabled={!canProceed}
          animate={canProceed ? {
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 8px rgba(59, 130, 246, 0.2)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};

export default FaxListUploader;