import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TestFaxApprovalProps {
  job: any;
  onClose: () => void;
  onApprove: (approved: boolean) => void;
}

export default function TestFaxApproval({ job, onClose, onApprove }: TestFaxApprovalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (approved: boolean) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onApprove(approved);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Review Test Fax</h3>
          <p className="mt-1 text-sm text-gray-500">
            Job #{job.id} • Delivered at {format(job.testFax.deliveryTime, 'h:mm a')}
          </p>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="aspect-[8.5/11] bg-white rounded-lg shadow-sm">
            {/* Test fax preview would go here */}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700">
                Please verify that all pages are rendering correctly and the content is legible.
                The broadcast will not begin until you approve the test fax.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Review Later
          </button>
          <button
            onClick={() => handleApprove(false)}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject & Cancel
          </button>
          <motion.button
            onClick={() => handleApprove(true)}
            disabled={isSubmitting}
            animate={!isSubmitting ? {
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 0 8px rgba(59, 130, 246, 0.2)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve & Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}