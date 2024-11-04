import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import CountrySelect from './CountrySelect';

interface TestFaxModalProps {
  onClose: () => void;
  onSubmit: (countryCode: string, number: string) => void;
}

const TestFaxModal: React.FC<TestFaxModalProps> = ({ onClose, onSubmit }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [faxNumber, setFaxNumber] = useState('');
  const [isSending, setIsSending] = useState(false);

  const formatFaxNumber = (value: string) => {
    // Remove all non-numeric characters except spaces, dashes, and parentheses
    const cleaned = value.replace(/[^\d\s()-]/g, '');
    
    // Prevent consecutive special characters
    const formatted = cleaned.replace(/[\s()-]{2,}/g, '');
    
    return formatted;
  };

  const validateFaxNumber = (number: string) => {
    // Must have at least 10 digits (ignoring special characters)
    const digitCount = number.replace(/\D/g, '').length;
    return digitCount >= 10;
  };

  const handleFaxNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFaxNumber(e.target.value);
    setFaxNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFaxNumber(faxNumber)) {
      return;
    }

    setIsSending(true);
    onSubmit(selectedCountry, faxNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Send Test Fax</h3>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Test faxes typically take 10-15 minutes to process. Your broadcast will remain paused until you review and approve the test fax results in your in-progress reports. Please note that delays may occur with busy lines or electronic fax services.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Country
            </label>
            <CountrySelect
              value={selectedCountry}
              onChange={setSelectedCountry}
              disabled={isSending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fax Number
            </label>
            <input
              type="tel"
              value={faxNumber}
              onChange={handleFaxNumberChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter fax number"
              disabled={isSending}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Format: (123) 456-7890 or 123-456-7890
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !validateFaxNumber(faxNumber)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Sending test...
                </>
              ) : (
                'Send Test'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestFaxModal;