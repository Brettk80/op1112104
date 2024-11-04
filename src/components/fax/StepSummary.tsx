import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Pencil, FileSpreadsheet, Ban } from 'lucide-react';

interface RecipientList {
  fileName: string;
  recipientCount: number;
  mapping: {
    faxNumber: string;
    toHeader?: string;
  };
  hasInternational: boolean;
}

interface Recipient {
  faxNumber: string;
  toHeader?: string;
}

interface BlockList {
  fileName: string;
  numberCount: number;
}

interface StepSummaryProps {
  documents?: File[];
  recipientLists?: RecipientList[];
  recipients?: Recipient[];
  blockLists?: BlockList[];
  currentStep: string;
  onEditStep: (step: 'documents' | 'recipients' | 'blocklist' | 'review') => void;
}

const formatNumber = (num: number | undefined): string => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString();
};

const StepSummary: React.FC<StepSummaryProps> = ({
  documents = [],
  recipientLists = [],
  recipients = [],
  blockLists = [],
  currentStep,
  onEditStep,
}) => {
  if (!documents.length && !recipientLists.length && !blockLists.length) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      {/* Documents Summary */}
      {documents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Documents</h4>
              <p className="mt-1 text-sm text-gray-500">
                {documents.length} document{documents.length !== 1 ? 's' : ''} selected
              </p>
              <ul className="mt-1 space-y-1">
                {documents.map((doc, index) => (
                  <li key={`${doc.name}-${index}`} className="text-xs text-gray-500 flex items-center">
                    <span className="w-4 text-center mr-2">{index + 1}.</span>
                    <span className="truncate max-w-xs">{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {currentStep !== 'documents' && (
            <button
              onClick={() => onEditStep('documents')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
        </motion.div>
      )}

      {/* Recipient Lists Summary */}
      {recipientLists.length > 0 && currentStep !== 'recipients' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-start justify-between ${documents.length > 0 ? 'pt-4 border-t' : ''}`}
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Recipient Lists</h4>
              <p className="mt-1 text-sm text-gray-500">
                {recipientLists.length} list{recipientLists.length !== 1 ? 's' : ''} uploaded
              </p>
              <ul className="mt-1 space-y-1">
                {recipientLists.map((list, index) => (
                  <li key={`${list.fileName}-${index}`} className="text-xs text-gray-500">
                    <div className="flex items-center">
                      <span className="truncate max-w-xs">{list.fileName}</span>
                      <span className="ml-2 text-gray-400">
                        ({formatNumber(list.recipientCount)} recipient{list.recipientCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                    {list.hasInternational && (
                      <span className="text-blue-600 text-[10px]">
                        Includes international numbers
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {recipients && recipients.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Total unique recipients: {formatNumber(recipients.length)}
                </p>
              )}
            </div>
          </div>
          {currentStep !== 'recipients' && (
            <button
              onClick={() => onEditStep('recipients')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
        </motion.div>
      )}

      {/* Block Lists Summary */}
      {blockLists.length > 0 && currentStep !== 'blocklist' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-start justify-between ${(documents.length > 0 || recipientLists.length > 0) ? 'pt-4 border-t' : ''}`}
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Ban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Block Lists</h4>
              <p className="mt-1 text-sm text-gray-500">
                {blockLists.length} list{blockLists.length !== 1 ? 's' : ''} uploaded
              </p>
              <ul className="mt-1 space-y-1">
                {blockLists.map((list, index) => (
                  <li key={`${list.fileName}-${index}`} className="text-xs text-gray-500">
                    <div className="flex items-center">
                      <span className="truncate max-w-xs">{list.fileName}</span>
                      <span className="ml-2 text-gray-400">
                        ({formatNumber(list.numberCount)} number{list.numberCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {currentStep !== 'blocklist' && (
            <button
              onClick={() => onEditStep('blocklist')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StepSummary;