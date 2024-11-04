import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMinutes } from 'date-fns';
import { Clock, Play, Pause } from 'lucide-react';
import DateTimePicker from '../fax/DateTimePicker';

interface PauseResumeModalProps {
  job: any;
  isPaused: boolean;
  onClose: () => void;
  onPauseResume: (resumeTime?: Date) => void;
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

export default function PauseResumeModal({ 
  job, 
  isPaused, 
  onClose, 
  onPauseResume 
}: PauseResumeModalProps) {
  const [scheduleResume, setScheduleResume] = useState(false);
  const [resumeTime, setResumeTime] = useState<Date>(new Date());

  const getTimeForZone = (offset: number) => {
    if (!resumeTime) return "--:--";
    const zoneTime = addMinutes(resumeTime, offset);
    return format(zoneTime, "h:mm a");
  };

  const handleSubmit = () => {
    onPauseResume(scheduleResume ? resumeTime : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-xl w-full p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isPaused ? 'Resume Broadcast' : 'Pause Broadcast'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Job #{job.id} • {job.recipients.total.toLocaleString()} recipients
          </p>
        </div>

        {isPaused ? (
          <div className="space-y-4">
            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                !scheduleResume 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setScheduleResume(false)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  !scheduleResume 
                    ? 'border-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {!scheduleResume && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Resume immediately</h4>
                  <p className="text-xs text-gray-600">
                    Continue processing right away
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                scheduleResume 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setScheduleResume(true)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  scheduleResume 
                    ? 'border-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {scheduleResume && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">Schedule resume time</h4>
                  <p className="text-xs text-gray-600">
                    Choose when to continue processing
                  </p>
                </div>
              </div>

              {scheduleResume && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Your time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </p>
                    <DateTimePicker
                      value={resumeTime}
                      onChange={setResumeTime}
                      minDate={new Date()}
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-xs font-medium text-gray-900 mb-2">Resume Times</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {timeZones.map((zone) => (
                        <div key={zone.name} className="flex justify-between text-xs">
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
        ) : (
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Pause className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900 font-medium">
                  Pause Broadcast
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Processing will stop after completing the current batch. You can resume manually or schedule an automatic resume time.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <motion.button
            onClick={handleSubmit}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 0 8px rgba(59, 130, 246, 0.2)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                {scheduleResume ? 'Schedule Resume' : 'Resume Now'}
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Broadcast
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}