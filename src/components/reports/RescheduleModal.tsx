import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import DateTimePicker from '../fax/DateTimePicker';
import ScheduleOption from './schedule/ScheduleOption';
import TimeZoneDisplay from './schedule/TimeZoneDisplay';

interface RescheduleModalProps {
  job: any;
  onClose: () => void;
  onReschedule: (date: Date | null) => void;
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

export default function RescheduleModal({ 
  job, 
  onClose, 
  onReschedule 
}: RescheduleModalProps) {
  const [sendImmediately, setSendImmediately] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleReschedule = () => {
    onReschedule(sendImmediately ? null : selectedDate);
  };

  const needsApproval = job.status === 'pending_test';
  const buttonText = needsApproval ? 'Approve & Schedule' : (sendImmediately ? 'Release Now' : 'Update Schedule');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {needsApproval ? 'Approve & Schedule Broadcast' : 'Reschedule Broadcast'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Job #{job.id} • {job.recipients.total.toLocaleString()} recipients
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <ScheduleOption
              selected={sendImmediately}
              onClick={() => setSendImmediately(true)}
              title="Release immediately"
              description="Broadcast will begin processing right away"
            />

            <ScheduleOption
              selected={!sendImmediately}
              onClick={() => setSendImmediately(false)}
              title="Schedule for later"
              description="Choose when to continue processing"
            >
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2">
                    Your time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </p>
                  <DateTimePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                  />
                </div>

                <TimeZoneDisplay
                  timeZones={timeZones}
                  selectedDate={selectedDate}
                />
              </div>
            </ScheduleOption>
          </div>

          {needsApproval && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <p>This action will approve the broadcast and set its schedule.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleReschedule}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 0 8px rgba(59, 130, 246, 0.2)",
                  "0 0 0 0 rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {buttonText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}