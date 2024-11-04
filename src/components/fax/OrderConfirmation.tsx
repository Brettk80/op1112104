import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Clock, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface OrderConfirmationProps {
  orderId: string;
  scheduledTime: Date;
  isTestFaxRequested: boolean;
  recipientCount: number;
  onViewReports: () => void;
  onSubmitAnother: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  scheduledTime,
  isTestFaxRequested,
  recipientCount,
  onViewReports,
  onSubmitAnother
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center"
      >
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </motion.div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Order Successfully Placed</h2>
        <p className="text-gray-600">Order #{orderId}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-left">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Recipients</span>
            </div>
            <p className="text-lg font-medium">{recipientCount.toLocaleString()} faxes</p>
          </div>

          <div className="text-left">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Scheduled Time</span>
            </div>
            <p className="text-lg font-medium">
              {format(scheduledTime, "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        {isTestFaxRequested && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4 text-left">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Test Fax Required</p>
                <p className="text-sm text-blue-700 mt-1">
                  Your broadcast will begin after you review and approve the test fax. You'll be notified when it's ready.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={onSubmitAnother}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Submit Another Order
        </button>
        <button
          onClick={onViewReports}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View Reports
          <ExternalLink className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;