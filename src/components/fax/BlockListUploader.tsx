import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, X, AlertCircle, Ban, Edit2, Phone, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { readFileHeaders } from './FileHeaderReader';
import BlockListMapper from './BlockListMapper';
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '../ui/Notification';

interface BlockListUploaderProps {
  onBlockListProcessed: (blockedNumbers: string[], listInfo?: { fileName: string; numberCount: number }) => void;
  existingLists?: { fileName: string }[];
  onNext: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

const BlockListUploader: React.FC<BlockListUploaderProps> = ({ 
  onBlockListProcessed,
  existingLists = [],
  onNext,
  onBack,
  onStartOver
}) => {
  const [uploadedLists, setUploadedLists] = useState<any[]>([]);
  const [editingList, setEditingList] = useState<{
    id: string;
    file: File;
    headers: string[];
    mapping?: { faxNumber: string };
  } | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateFileName, setDuplicateFileName] = useState('');

  // Mock data for account block lists
  const accountBlockLists = {
    tollFreeNumber: '1-800-555-0123',
    tollFreeCount: 1250,
    storedCount: 551
  };

  const totalBlockedNumbers = accountBlockLists.tollFreeCount + 
    accountBlockLists.storedCount + 
    uploadedLists.reduce((sum, list) => sum + list.numberCount, 0);

  const handleEditList = (list: any) => {
    const file = new File([], list.fileName);
    setEditingList({
      id: list.id,
      file,
      headers: [list.mapping.faxNumber],
      mapping: list.mapping
    });
  };

  const handleRemoveList = (id: string) => {
    const removedList = uploadedLists.find(list => list.id === id);
    setUploadedLists(prev => prev.filter(list => list.id !== id));
    if (removedList) {
      onBlockListProcessed([], { fileName: removedList.fileName, numberCount: 0 });
    }
  };

  const handleMapComplete = (id: string, mapping: { faxNumber: string }) => {
    const updatedList = {
      ...uploadedLists.find(list => list.id === id)!,
      mapping,
      numberCount: 100 // Mock count
    };

    setUploadedLists(prev =>
      prev.map(list =>
        list.id === id ? updatedList : list
      )
    );

    setEditingList(null);
    onBlockListProcessed([], { 
      fileName: updatedList.fileName, 
      numberCount: updatedList.numberCount 
    });
    
    showNotification({
      type: 'success',
      title: 'Block list updated',
      message: `Successfully mapped columns for ${updatedList.fileName}`,
      duration: 5000
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // Check if file name exists in contact lists
      if (existingLists.some(list => list.fileName === file.name)) {
        setDuplicateFileName(file.name);
        setShowDuplicateWarning(true);
        continue;
      }

      // Check if file is already in block lists
      if (uploadedLists.some(list => list.fileName === file.name)) {
        showNotification({
          type: 'error',
          title: 'File already exists',
          message: `"${file.name}" has already been uploaded`,
          duration: 5000
        });
        continue;
      }

      try {
        const headers = await readFileHeaders(file);
        const id = uuidv4();
        
        // Auto-detect fax number column
        const faxPattern = /^(fax|faxnumber|fax.?number|fax.?#)$/i;
        const faxColumn = headers.find(h => faxPattern.test(h));
        
        if (faxColumn) {
          // Auto-map and process
          const listInfo = {
            id,
            fileName: file.name,
            mapping: { faxNumber: faxColumn },
            numberCount: 100 // Mock count
          };
          setUploadedLists(prev => [...prev, listInfo]);
          onBlockListProcessed([], { fileName: file.name, numberCount: 100 });
          showNotification({
            type: 'success',
            title: 'Auto-mapped fax column',
            message: `Successfully detected fax number column: ${faxColumn}`,
            duration: 5000
          });
        } else {
          // Show mapper
          setEditingList({
            id,
            file,
            headers,
          });
        }
      } catch (error) {
        showNotification({
          type: 'error',
          title: 'Processing Error',
          message: `Failed to process ${file.name}`,
          duration: 5000
        });
      }
    }
  }, [uploadedLists, existingLists, onBlockListProcessed]);

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

  return (
    <div className="space-y-6">
      {/* Block List Summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Ban className="h-6 w-6 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-blue-900">Block Lists</h3>
            <p className="text-lg text-blue-700 mt-2">
              Total block list size: {totalBlockedNumbers.toLocaleString()} numbers
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-4 bg-white bg-opacity-50 rounded-lg p-4">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {accountBlockLists.tollFreeCount.toLocaleString()} numbers
                  </p>
                  <p className="text-gray-600">
                    From toll-free opt-out list ({accountBlockLists.tollFreeNumber})
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white bg-opacity-50 rounded-lg p-4">
                <Ban className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {accountBlockLists.storedCount.toLocaleString()} numbers
                  </p>
                  <p className="text-gray-600">
                    From stored block lists
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {showDuplicateWarning && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Block list cannot be added
                </p>
                <p className="mt-1 text-sm text-yellow-700">
                  "{duplicateFileName}" is already being used as a contact list. Please remove the contact list or provide a different block list file.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDuplicateWarning(false)}
              className="px-3 py-1 text-sm font-medium text-yellow-800 hover:text-yellow-900 bg-yellow-100 rounded-md"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Lists */}
      {uploadedLists.length > 0 && !editingList && (
        <div className="space-y-3">
          {uploadedLists.map(list => (
            <div
              key={list.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{list.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {list.numberCount.toLocaleString()} numbers • Using column: {list.mapping.faxNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditList(list)}
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

      {/* Upload Area */}
      {!editingList && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              {uploadedLists.length > 0 ? 'Add Another Block List' : 'Upload Block List'}
            </h4>
            <div className="flex items-center text-sm text-gray-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              Optional
            </div>
          </div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop your block lists, or click to select files
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: XLS, XLSX, CSV, TXT
            </p>
          </div>
        </div>
      )}

      {/* Column Mapper */}
      {editingList && (
        <BlockListMapper
          key={editingList.id}
          fileName={editingList.file.name}
          columns={editingList.headers}
          initialMapping={editingList.mapping}
          onConfirm={(mapping) => handleMapComplete(editingList.id, mapping)}
          onCancel={() => setEditingList(null)}
        />
      )}

      {/* Navigation Footer */}
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
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 8px rgba(59, 130, 246, 0.2)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};

export default BlockListUploader;