import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentUploader from './DocumentUploader';
import FaxListUploader from './FaxListUploader';
import BlockListUploader from './BlockListUploader';
import DocumentPreviewStep from './DocumentPreviewStep';
import ReviewStep from './ReviewStep';
import PaymentStep from './PaymentStep';

const steps = [
  { id: "documents", title: "Upload Documents" },
  { id: "recipients", title: "Add Recipients" },
  { id: "blocklist", title: "Block List" },
  { id: "preview", title: "Preview" },
  { id: "review", title: "Review & Schedule" },
  { id: "payment", title: "Payment" }
] as const;

type StepId = typeof steps[number]['id'];

interface ScheduleData {
  sendImmediately: boolean;
  scheduledDate?: Date;
  scheduledTime?: string;
}

const FaxBroadcast: React.FC = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [recipientLists, setRecipientLists] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [blockedNumbers, setBlockedNumbers] = useState<string[]>([]);
  const [blockLists, setBlockLists] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<StepId>('documents');
  const [isUploading, setIsUploading] = useState(false);
  const [isTestFaxRequested, setIsTestFaxRequested] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  const handleDocumentsUploaded = (files: File[]) => {
    setDocuments(files);
  };

  const handleListProcessed = (newRecipients: any[], listInfo: any) => {
    setRecipientLists(prev => {
      const existingIndex = prev.findIndex(list => list.id === listInfo.id);
      if (existingIndex >= 0) {
        return [
          ...prev.slice(0, existingIndex),
          listInfo,
          ...prev.slice(existingIndex + 1)
        ];
      }
      return [...prev, listInfo];
    });

    setRecipients(prev => {
      const withoutCurrentList = prev.filter(r => r.faxNumber !== listInfo.id);
      return [...withoutCurrentList, ...newRecipients];
    });
  };

  const handleListRemoved = (id: string) => {
    setRecipientLists(prev => prev.filter(list => list.id !== id));
    setRecipients(prev => prev.filter(r => r.faxNumber !== id));
  };

  const handleBlockListProcessed = (numbers: string[], listInfo?: { fileName: string; numberCount: number }) => {
    setBlockedNumbers(numbers);
    if (listInfo) {
      setBlockLists(prev => {
        const exists = prev.some(list => list.fileName === listInfo.fileName);
        if (!exists) {
          return [...prev, listInfo];
        }
        return prev;
      });
    }
  };

  const handleStartOver = () => {
    if (!isUploading) {
      setDocuments([]);
      setRecipientLists([]);
      setRecipients([]);
      setBlockedNumbers([]);
      setBlockLists([]);
      setCurrentStep('documents');
      setIsTestFaxRequested(false);
      setScheduleData(null);
    }
  };

  const handleTestFaxRequested = () => {
    setIsTestFaxRequested(true);
  };

  const handleSchedulingComplete = (data: ScheduleData) => {
    setScheduleData(data);
    setCurrentStep('payment');
  };

  const getNextStep = (current: StepId): StepId => {
    const stepIndex = steps.findIndex(s => s.id === current);
    return steps[stepIndex + 1]?.id || current;
  };

  const getPreviousStep = (current: StepId): StepId => {
    const stepIndex = steps.findIndex(s => s.id === current);
    return steps[stepIndex - 1]?.id || current;
  };

  const handleNext = () => {
    setCurrentStep(getNextStep(currentStep));
  };

  const handleBack = () => {
    setCurrentStep(getPreviousStep(currentStep));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'documents':
        return (
          <DocumentUploader 
            onDocumentsUploaded={handleDocumentsUploaded}
            existingDocuments={documents}
            onUploadingChange={setIsUploading}
            onNext={handleNext}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        );
      case 'recipients':
        return (
          <FaxListUploader 
            onListProcessed={handleListProcessed}
            onListRemoved={handleListRemoved}
            existingLists={recipientLists}
            onNext={handleNext}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        );
      case 'blocklist':
        return (
          <BlockListUploader 
            onBlockListProcessed={handleBlockListProcessed}
            existingLists={recipientLists}
            onNext={handleNext}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        );
      case 'preview':
        return (
          <DocumentPreviewStep
            documents={documents}
            onTestFaxRequested={handleTestFaxRequested}
            onNext={handleNext}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        );
      case 'review':
        return (
          <ReviewStep
            isTestFaxRequested={isTestFaxRequested}
            onBack={handleBack}
            onStartOver={handleStartOver}
            onNext={handleSchedulingComplete}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            scheduleData={scheduleData}
            isTestFaxRequested={isTestFaxRequested}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Fax Broadcast</h2>
              <p className="mt-1 text-sm text-gray-600">
                Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {steps.find(s => s.id === currentStep)?.title}
              </p>
            </div>
          </div>
          
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="p-6">
          {renderCurrentStep()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FaxBroadcast;