import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, ExternalLink } from 'lucide-react';
import type { ColumnMapping } from './types';

interface ColumnMapperProps {
  fileName: string;
  columns: string[];
  onConfirm: (mapping: ColumnMapping, hasInternational: boolean) => void;
  onCancel: () => void;
  initialMapping?: ColumnMapping;
  autoMapped?: boolean;
}

const REQUIRED_FIELDS = ['faxNumber'];
const TO_FIELD_PATTERNS = [
  /^to$/i,
  /^(last|last.*name)$/i,
  /^company$/i,
  /^organization$/i,
  /^physician$/i,
  /^office$/i
];

const FAX_FIELD_PATTERNS = [
  /^fax$/i,
  /^fax.*number$/i,
  /^fax.*#$/i
];

const ColumnMapper: React.FC<ColumnMapperProps> = ({
  fileName,
  columns = [],
  onConfirm,
  onCancel,
  initialMapping = { faxNumber: '' },
  autoMapped = false
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping);
  const [hasInternational, setHasInternational] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!initialMapping.faxNumber || !initialMapping.toHeader) {
      const newMapping = { ...initialMapping };
      let shouldUpdate = false;
      
      if (!newMapping.faxNumber) {
        const faxColumn = columns.find(col => 
          FAX_FIELD_PATTERNS.some(pattern => pattern.test(col))
        );
        if (faxColumn) {
          newMapping.faxNumber = faxColumn;
          shouldUpdate = true;
        }
      }

      if (!newMapping.toHeader) {
        const toColumn = columns.find(col =>
          TO_FIELD_PATTERNS.some(pattern => pattern.test(col))
        );
        if (toColumn) {
          newMapping.toHeader = toColumn;
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        setMapping(newMapping);
      }
    }
  }, [columns, initialMapping]);

  const handleFieldChange = (field: keyof ColumnMapping, value: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    const missingFields = REQUIRED_FIELDS.filter(field => !mapping[field as keyof ColumnMapping]);
    if (missingFields.length > 0) {
      setShowWarning(true);
      return;
    }
    onConfirm(mapping, hasInternational);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 bg-blue-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Map List Columns</h3>
          <p className="text-sm text-gray-500">{fileName}</p>
          {autoMapped && (
            <p className="text-sm text-blue-600 mt-1">
              Fields automatically mapped
            </p>
          )}
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fax Number
            </label>
            <select
              value={mapping.faxNumber || ''}
              onChange={(e) => handleFieldChange('faxNumber', e.target.value)}
              className="mt-1 block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select column</option>
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name or department (max 15 chars)
            </label>
            <select
              value={mapping.toHeader || ''}
              onChange={(e) => handleFieldChange('toHeader', e.target.value)}
              className="mt-1 block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Field Ignored</option>
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Appears in fax header and reports
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={hasInternational}
              onChange={(e) => setHasInternational(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-700">
              This list contains international fax numbers (outside North America)
            </label>
            <p className="text-xs text-gray-500 mt-1 mr-4">
              <a
                href="https://openfax.com/rates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                International per minute rates apply
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>
        </div>

        {showWarning && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Required Fields Missing
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please select a column for Fax Number to continue.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ColumnMapper;