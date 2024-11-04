import React, { useState } from 'react';
import { Phone, AlertTriangle, CheckCircle2, XCircle, DollarSign, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TollFreeNumber {
  number: string;
  status: 'active' | 'inactive';
  activatedDate: string;
  optOuts: number;
  monthlyCharge: number;
}

const TollFreeManager: React.FC = () => {
  const [tollFreeNumber, setTollFreeNumber] = useState<TollFreeNumber>({
    number: '1-800-555-0123',
    status: 'inactive',
    activatedDate: '2023-01-15',
    optOuts: 1250,
    monthlyCharge: 72.50
  });
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTollFreeNumber(prev => ({
        ...prev,
        status: 'active',
        activatedDate: new Date().toISOString()
      }));
      
      toast.success('Toll-free number activated successfully');
    } catch (error) {
      toast.error('Failed to activate toll-free number');
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = () => {
    setTollFreeNumber(prev => ({
      ...prev,
      status: 'inactive'
    }));
    setShowDeactivateModal(false);
    toast.success('Toll-free number deactivated');
  };

  return (
    <div className="space-y-6">
      {/* Service Information Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900">Important Information</h4>
            <p className="mt-2 text-sm text-blue-700">
              This number can be added to your document with instructions for recipients to call to opt-out of future campaigns.
            </p>
            <p className="mt-2 text-sm text-blue-700">
              Openfax will never modify your document. You must place the opt-out instructions with your assigned number.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Interactive Voice Response (IVR) Opt-Out Service</h2>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              {tollFreeNumber.status === 'active' ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900">
                    {tollFreeNumber.number}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Activated on {new Date(tollFreeNumber.activatedDate).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <h3 className="text-lg font-medium text-gray-500">
                  No active toll-free number
                </h3>
              )}
            </div>
            <div className="flex items-center">
              {tollFreeNumber.status === 'active' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <XCircle className="h-4 w-4 mr-1" />
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Statistics - Only show when active */}
        {tollFreeNumber.status === 'active' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Opt-Outs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tollFreeNumber.optOuts.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Monthly Charge
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${tollFreeNumber.monthlyCharge.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Controls */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Service Controls</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your IVR opt-out service
              </p>
            </div>
            <div>
              {tollFreeNumber.status === 'active' ? (
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate Service
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Activate Service
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Service Details</h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Base rate: $10/month</li>
                <li>• Per opt-out call: $0.05</li>
                <li>• Automatic block list updates</li>
                <li>• 24/7 voice response system for opt-out requests</li>
                <li>• Compliance with federal regulations</li>
                <li>• Permanent record of opt-out requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-start space-x-3 mb-6">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Deactivate Toll-Free Service?
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  ⚠️ Warning: Deactivating this service will permanently delete your phone number. You won't receive any calls to this number, and it cannot be recovered. While your blocked number list will be preserved, you'll need to add a new phone number if you reactivate the service.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Yes, Deactivate Service
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TollFreeManager;