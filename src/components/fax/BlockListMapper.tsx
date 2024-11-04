import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface BlockListMapperProps {
  fileName: string;
  columns: string[];
  initialMapping?: { faxNumber: string };
  onConfirm: (mapping: { faxNumber: string }) => void;
  onCancel: () => void;
}

const BlockListMapper: React.FC<BlockListMapperProps> = ({
  fileName,
  columns,
  initialMapping,
  onConfirm,
  onCancel
}) => {
  const [selectedColumn, setSelectedColumn] = useState(initialMapping?.faxNumber || '');

  useEffect(() => {
    if (!selectedColumn && !initialMapping?.faxNumber) {
      // Auto-detect fax number column if not already mapped
      const faxPattern = /^(fax|faxnumber|fax.?number|fax.?#)$/i;
      const faxColumn = columns.find(col => faxPattern.test(col));
      if (faxColumn) {
        setSelectedColumn(faxColumn);
      }
    }
  }, [columns, initialMapping]);

  const handleConfirm = () => {
    if (selectedColumn) {
      onConfirm({ faxNumber: selectedColumn });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="px-4 py-3 bg-blue-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Map Block List Columns</h3>
          <p className="text-sm text-gray-500">{fileName}</p>
          {initialMapping && (
            <p className="text-sm text-blue-600 mt-1">
              Currently using column: {initialMapping.faxNumber}
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

      <div className="p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fax Number Column
          </label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="mt-1 block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select the column containing fax numbers to block
          </p>
        </div>
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
          disabled={!selectedColumn}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};

export default BlockListMapper;