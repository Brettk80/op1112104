import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { toast } from 'sonner';
import TestFaxModal from './TestFaxModal';

interface DocumentPreviewStepProps {
  documents: File[];
  currentPage: number;
  totalPages: number;
  previewUrl: string;
  onPageChange: (page: number) => void;
  onTestFaxRequested: () => void;
  onDownload: () => void;
  onNext: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

const pulseAnimation = {
  boxShadow: [
    "0 0 0 0 rgba(59, 130, 246, 0)",
    "0 0 0 8px rgba(59, 130, 246, 0.2)",
    "0 0 0 0 rgba(59, 130, 246, 0)"
  ]
};

export default function DocumentPreviewStep({
  documents,
  currentPage,
  totalPages,
  previewUrl,
  onPageChange,
  onTestFaxRequested,
  onDownload,
  onNext,
  onBack,
  onStartOver
}: DocumentPreviewStepProps) {
  const [showTestFaxModal, setShowTestFaxModal] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testFaxSent, setTestFaxSent] = useState(false);

  // Initialize audio with preload
  const notificationSound = new Audio('https://vz.weagree.org/audio/wake.mp3');
  notificationSound.preload = 'auto';

  const handleTestFaxComplete = (countryCode: string, faxNumber: string) => {
    setIsSendingTest(true);
    setShowTestFaxModal(false);

    const sid = `FAX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const countryFlag = countryCode === 'US' ? '🇺🇸' : countryCode === 'CA' ? '🇨🇦' : '🌎';

    const playSound = async () => {
      try {
        notificationSound.currentTime = 0;
        await notificationSound.play();
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    };

    setTimeout(() => {
      playSound();
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Test Fax Processing</div>
          <div className="text-sm">
            To: {countryFlag} {faxNumber}
          </div>
          <div className="text-sm text-gray-500">SID: {sid}</div>
          <div className="mt-1">
            Please continue configuring your job settings. You'll be able to approve your order from the in-progress report once your order configuration is complete and test fax is received.
          </div>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Dismiss",
            onClick: () => {}
          }
        }
      );
      
      setIsSendingTest(false);
      setTestFaxSent(true);
      onTestFaxRequested();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
            <p className="mt-1 text-sm text-gray-500">
              Review your document rendering and test fax output
            </p>
          </div>
          <button
            onClick={onDownload}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="Download preview"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <div className="overflow-auto max-h-[calc(90vh-8rem)]">
            <div className="flex flex-col items-center min-h-[600px] relative p-4">
              <img
                src={previewUrl}
                alt={`Document preview - Page ${currentPage}`}
                className="w-full h-auto"
              />
            </div>
          </div>

          {totalPages > 1 && (
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 pointer-events-none">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: currentPage > 1 ? 1 : 0, x: 0 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 shadow-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 border border-blue-100"
              >
                <ArrowLeft className="h-6 w-6" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: currentPage < totalPages ? 1 : 0, x: 0 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 shadow-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 border border-blue-100"
              >
                <ArrowRight className="h-6 w-6" />
              </motion.button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-4">
            {!testFaxSent ? (
              <button
                onClick={() => setShowTestFaxModal(true)}
                disabled={isSendingTest}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                {isSendingTest ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Sending test...
                  </>
                ) : (
                  'Send Test Fax'
                )}
              </button>
            ) : (
              <span className="text-green-600 text-sm font-medium flex items-center">
                <Flag className="h-4 w-4 mr-1" />
                Test Fax Queued
              </span>
            )}
          </div>
        </div>
      </div>

      {showTestFaxModal && (
        <TestFaxModal
          onClose={() => setShowTestFaxModal(false)}
          onSubmit={handleTestFaxComplete}
        />
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
          animate={pulseAnimation}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}