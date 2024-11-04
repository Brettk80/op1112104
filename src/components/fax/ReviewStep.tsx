import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flag, Send, FileText } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import DateTimePicker from './DateTimePicker';

interface ReviewStepProps {
  hasTestFax?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  onStartOver?: () => void;
}

const timeZones = [
  { name: "Honolulu", offset: -600 },
  { name: "Los Angeles", offset: -420 },
  { name: "Denver", offset: -360 },
  { name: "Chicago", offset: -300 },
  { name: "New York", offset: -240 },
  { name: "Berlin", offset: 120 },
  { name: "Beijing", offset: 480 },
  { name: "Shanghai", offset: 480 }
];

const ReviewStep: React.FC<ReviewStepProps> = ({
  hasTestFax = false,
  onNext,
  onBack,
  onStartOver
}) => {
  const [sendImmediately, setSendImmediately] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [showChoicePrompt, setShowChoicePrompt] = useState(false);

  const handleDateChange = (date: Date) => {
    setScheduledDate(date);
  };

  const getTimeForZone = (offset: number) => {
    if (!scheduledDate) return "--:--";
    const zoneTime = addMinutes(scheduledDate, offset);
    return format(zoneTime, "h:mm a");
  };

  const handleScheduleComplete = () => {
    setShowChoicePrompt(true);
  };

  const handleSubmitAnother = () => {
    onStartOver?.();
  };

  const handleProceedToPayment = () => {
    onNext?.();
  };

  return (
    <div className="space-y-6">
      {!showChoicePrompt ? (
        <>
          <h2 className="text-2xl font-semibold">Schedule Delivery</h2>

          <div className="space-y-4">
            <div 
              className={`p-6 rounded-lg border cursor-pointer transition-colors ${
                sendImmediately 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSendImmediately(true)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  sendImmediately 
                    ? 'border-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {sendImmediately && (
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">Send immediately</h3>
                  <p className="text-gray-600">
                    {hasTestFax 
                      ? 'Broadcast will begin after test fax approval'
                      : 'Broadcast will begin processing right away'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`p-6 rounded-lg border cursor-pointer transition-colors ${
                !sendImmediately 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSendImmediately(false)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  !sendImmediately 
                    ? 'border-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {!sendImmediately && (
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">Schedule for later</h3>
                  <p className="text-gray-600">
                    {hasTestFax 
                      ? 'Broadcast will begin at scheduled time after test fax approval'
                      : 'Broadcast will begin at your scheduled time'
                    }
                  </p>
                </div>
              </div>

              {!sendImmediately && (
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Your time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                    <DateTimePicker
                      value={scheduledDate}
                      onChange={handleDateChange}
                      minDate={new Date()}
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Broadcast Times</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {timeZones.map((zone) => (
                        <div key={zone.name} className="flex justify-between text-sm">
                          <span className="text-gray-600">{zone.name}</span>
                          <span className="text-gray-900">{getTimeForZone(zone.offset)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
              onClick={handleScheduleComplete}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 0 8px rgba(59, 130, 246, 0.2)",
                  "0 0 0 0 rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </motion.button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Broadcast Scheduled</h2>
            <p className="text-gray-600">
              {sendImmediately 
                ? "Your broadcast has been scheduled to begin immediately" 
                : `Your broadcast has been scheduled for ${format(scheduledDate, "MMM d, yyyy 'at' h:mm a")}`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.button
              onClick={handleSubmitAnother}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 bg-white"
            >
              <Send className="h-8 w-8 text-gray-400 mb-3" />
              <span className="text-lg font-medium">Submit Another Order</span>
              <span className="text-sm text-gray-500 mt-1">Create a new fax broadcast</span>
            </motion.button>

            <motion.button
              onClick={handleProceedToPayment}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center p-6 border-2 border-blue-100 rounded-xl hover:border-blue-200 bg-blue-50"
            >
              <FileText className="h-8 w-8 text-blue-600 mb-3" />
              <span className="text-lg font-medium text-blue-900">Proceed to Payment</span>
              <span className="text-sm text-blue-600 mt-1">Complete your order</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;