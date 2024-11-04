import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import type { ProcessingJob } from './FaxListProcessor';

interface ProcessingStatusProps {
  jobs: ProcessingJob[];
  onDismiss: (jobId: string) => void;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ jobs, onDismiss }) => {
  if (jobs.length === 0) return null;

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg border p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {job.status === 'queued' && <Clock className="h-5 w-5 text-gray-400" />}
              {job.status === 'processing' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
              {job.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {job.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-500" />}
              <span className="font-medium text-gray-900">{job.fileName}</span>
            </div>
            {job.status !== 'processing' && (
              <button
                onClick={() => onDismiss(job.id)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Dismiss
              </button>
            )}
          </div>

          {job.status === 'processing' && job.totalRecords && (
            <div className="space-y-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {job.processedRecords?.toLocaleString()} of {job.totalRecords.toLocaleString()} records
                </span>
                <span>{job.progress}%</span>
              </div>
            </div>
          )}

          {job.status === 'failed' && job.error && (
            <p className="mt-2 text-sm text-red-600">{job.error}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ProcessingStatus;