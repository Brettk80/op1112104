import React, { useState } from 'react';
import { 
  Eye, 
  Mail, 
  ChevronDown, 
  X, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Pause, 
  Play,
  Ban,
  Calendar,
  Flag,
  Loader2,
  ChevronRight,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import TestFaxApproval from './TestFaxApproval';
import RescheduleModal from './RescheduleModal';
import DocumentPreview from '../fax/DocumentPreview';
import TestFaxResendModal from './TestFaxResendModal';
import PauseResumeModal from './PauseResumeModal';

const MAX_RESEND_ATTEMPTS = 4;

interface BroadcastJob {
  id: string;
  billingCode: string;
  scheduledTime: Date;
  status: 'pending_test' | 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  documents: {
    name: string;
    pageCount: number;
    previewUrl?: string;
  }[];
  recipientLists: {
    fileName: string;
    recipientCount: number;
  }[];
  blockLists?: {
    fileName: string;
    numberCount: number;
  }[];
  recipients: {
    total: number;
    delivered: number;
    failed: number;
    pending: number;
  };
  testFax?: {
    status: 'pending' | 'delivered' | 'failed';
    deliveryTime?: Date;
    resendCount?: number;
  };
}

const BroadcastReports: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<BroadcastJob | null>(null);
  const [showTestFaxApproval, setShowTestFaxApproval] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showPreview, setShowPreview] = useState<{ file: File; name: string } | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [showTestFaxResend, setShowTestFaxResend] = useState(false);
  const [showPauseResume, setShowPauseResume] = useState(false);

  // Mock data
  const jobs: BroadcastJob[] = [
    {
      id: '66461',
      billingCode: 'Q4-STATEMENTS',
      scheduledTime: new Date('2024-10-31T15:00:00'),
      status: 'pending_test',
      documents: [
        { name: 'Q4_Statement.pdf', pageCount: 3 }
      ],
      recipientLists: [
        { fileName: 'customers.csv', recipientCount: 850 },
        { fileName: 'vendors.xlsx', recipientCount: 400 }
      ],
      blockLists: [
        { fileName: 'global_blocklist.csv', numberCount: 1250 },
        { fileName: 'custom_blocklist.xlsx', numberCount: 551 }
      ],
      recipients: {
        total: 1250,
        delivered: 0,
        failed: 0,
        pending: 1250
      },
      testFax: {
        status: 'delivered',
        deliveryTime: new Date('2024-10-30T14:45:00'),
        resendCount: 0
      }
    },
    {
      id: '66460',
      billingCode: 'MONTHLY-NEWSLETTER',
      scheduledTime: new Date('2024-10-30T09:00:00'),
      status: 'in_progress',
      documents: [
        { name: 'Newsletter_Oct2024.pdf', pageCount: 2 }
      ],
      recipientLists: [
        { fileName: 'subscribers.csv', recipientCount: 850 }
      ],
      recipients: {
        total: 850,
        delivered: 425,
        failed: 25,
        pending: 400
      }
    }
  ];

  const handleTestFaxApproval = (jobId: string, approved: boolean) => {
    if (approved) {
      toast.success('Test fax approved. Broadcast will begin at scheduled time');
    } else {
      toast.error('Test fax rejected. Broadcast has been cancelled');
    }
    setShowTestFaxApproval(false);
  };

  const handleReschedule = (jobId: string, newDate: Date | null) => {
    const message = newDate 
      ? `Broadcast rescheduled for ${format(newDate, "MMM d, yyyy 'at' h:mm a")}`
      : 'Broadcast approved and released for immediate delivery';
    
    toast.success(message);
    setShowReschedule(false);
  };

  const handlePauseResume = (jobId: string, resumeTime?: Date) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const isPaused = job.status === 'paused';
    const message = isPaused
      ? resumeTime 
        ? `Broadcast will resume at ${format(resumeTime, "h:mm a")}`
        : 'Broadcast resumed'
      : 'Broadcast paused';

    toast.success(message);
    setShowPauseResume(false);
  };

  const handleCancel = (jobId: string) => {
    toast.success('Broadcast cancelled');
    setShowCancelConfirm(null);
  };

  const handleTestFaxResend = (jobId: string, countryCode: string, faxNumber: string) => {
    toast.success('Test fax resent successfully');
    setShowTestFaxResend(false);
  };

  const getStatusBadge = (status: BroadcastJob['status']) => {
    const badges = {
      pending_test: { color: 'bg-yellow-100 text-yellow-800', icon: Flag },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      in_progress: { color: 'bg-green-100 text-green-800', icon: Play },
      paused: { color: 'bg-orange-100 text-orange-800', icon: Pause },
      completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle2 },
      cancelled: { color: 'bg-red-100 text-red-800', icon: Ban }
    };

    const { color, icon: Icon } = badges[status];
    const label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Fax Broadcasts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor and manage your fax broadcast jobs
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {jobs.map((job) => (
          <div key={job.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  Job #{job.id}
                  {job.billingCode && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({job.billingCode})
                    </span>
                  )}
                </h3>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    Scheduled for {format(job.scheduledTime, 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
              {getStatusBadge(job.status)}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Documents Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Documents</h4>
                <div className="space-y-3">
                  {job.documents.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.pageCount} pages</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPreview({ 
                          file: new File([], doc.name),
                          name: doc.name
                        })}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Lists Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    {job.recipientLists && job.recipientLists.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Recipient Lists</h5>
                        {job.recipientLists.map((list, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{list.fileName}</span>
                            <span className="text-gray-500">
                              ({list.recipientCount.toLocaleString()} recipients)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {job.blockLists && job.blockLists.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Block Lists</h5>
                        {job.blockLists.map((list, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <Ban className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{list.fileName}</span>
                            <span className="text-gray-500">
                              ({list.numberCount.toLocaleString()} numbers)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recipients Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recipients</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-medium text-gray-900">
                      {job.recipients.total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivered</p>
                    <p className="text-lg font-medium text-green-600">
                      {job.recipients.delivered.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Failed</p>
                    <p className="text-lg font-medium text-red-600">
                      {job.recipients.failed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-lg font-medium text-gray-900">
                      {job.recipients.pending.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Fax Section */}
            {job.testFax && (
              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Flag className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-900">Test Fax Status</h4>
                    <div className="mt-2 flex items-center space-x-4">
                      {job.testFax.status === 'pending' ? (
                        <div className="flex items-center text-yellow-800">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Processing test fax...
                        </div>
                      ) : job.testFax.status === 'delivered' ? (
                        <>
                          <div className="flex items-center text-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Delivered at {format(job.testFax.deliveryTime!, 'h:mm a')}
                          </div>
                          {(job.testFax.resendCount || 0) < MAX_RESEND_ATTEMPTS && (
                            <button
                              onClick={() => {
                                setSelectedJob(job);
                                setShowTestFaxResend(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Resend Test
                            </button>
                          )}
                          {job.status === 'pending_test' && (
                            <button
                              onClick={() => {
                                setSelectedJob(job);
                                setShowReschedule(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Approve & Schedule
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center text-red-700">
                            <XCircle className="h-4 w-4 mr-2" />
                            Delivery failed
                          </div>
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowTestFaxResend(true);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Retry Test
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex items-center space-x-4">
              {job.status !== 'pending_test' && (
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowReschedule(true);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </button>
              )}

              {job.status === 'in_progress' && (
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowPauseResume(true);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </button>
              )}

              {job.status === 'paused' && (
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowPauseResume(true);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </button>
              )}

              {['scheduled', 'in_progress', 'paused'].includes(job.status) && (
                <button
                  onClick={() => setShowCancelConfirm(job.id)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedJob && showTestFaxApproval && (
        <TestFaxApproval
          job={selectedJob}
          onClose={() => setShowTestFaxApproval(false)}
          onApprove={(approved) => handleTestFaxApproval(selectedJob.id, approved)}
        />
      )}

      {selectedJob && showReschedule && (
        <RescheduleModal
          job={selectedJob}
          onClose={() => setShowReschedule(false)}
          onReschedule={(date) => handleReschedule(selectedJob.id, date)}
        />
      )}

      {selectedJob && showPauseResume && (
        <PauseResumeModal
          job={selectedJob}
          isPaused={selectedJob.status === 'paused'}
          onClose={() => setShowPauseResume(false)}
          onPauseResume={(resumeTime) => handlePauseResume(selectedJob.id, resumeTime)}
        />
      )}

      {showPreview && (
        <DocumentPreview
          file={showPreview.file}
          fileName={showPreview.name}
          onClose={() => setShowPreview(null)}
          onDownload={() => {/* Handle download */}}
        />
      )}

      {selectedJob && showTestFaxResend && (
        <TestFaxResendModal
          jobId={selectedJob.id}
          attemptsLeft={MAX_RESEND_ATTEMPTS - (selectedJob.testFax?.resendCount || 0)}
          onClose={() => setShowTestFaxResend(false)}
          onResend={(countryCode, number) => handleTestFaxResend(selectedJob.id, countryCode, number)}
        />
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cancel Broadcast?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All pending faxes will be cancelled.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Keep Broadcasting
              </button>
              <button
                onClick={() => handleCancel(showCancelConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Yes, Cancel Broadcast
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BroadcastReports;