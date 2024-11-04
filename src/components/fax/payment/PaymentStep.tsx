import React, { useState } from 'react';
import { ArrowLeft, Plus, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SavedCardList from './SavedCardList';
import AccountCredit from './AccountCredit';
import AddCardForm from './AddCardForm';
import OrderConfirmation from '../OrderConfirmation';

interface PaymentStepProps {
  scheduleData: {
    sendImmediately: boolean;
    scheduledDate?: Date;
  } | null;
  isTestFaxRequested: boolean;
  recipientCount?: number;
  onBack: () => void;
  onStartOver: () => void;
}

const mockSavedCards = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '24',
    isDefault: true
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8888',
    expiryMonth: '06',
    expiryYear: '25',
    isDefault: false
  }
];

const mockAccountCredit = {
  balance: 500.00,
  pendingHolds: 150.00,
  availableCredit: 350.00,
  orderAmount: 275.50
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  scheduleData,
  isTestFaxRequested,
  recipientCount = 0,
  onBack,
  onStartOver
}) => {
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string>(mockSavedCards[0].id);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const handleAddCardSuccess = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowAddCard(false);
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order ID
      const newOrderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setOrderId(newOrderId);

      // Handle different payment scenarios
      if (mockAccountCredit.availableCredit >= mockAccountCredit.orderAmount) {
        console.log('Using account credit');
      } else if (mockAccountCredit.availableCredit > 0) {
        console.log('Using partial credit and card hold');
      } else {
        console.log('Processing full card charge');
      }

      setOrderComplete(true);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  const remainingCharge = Math.max(0, mockAccountCredit.orderAmount - mockAccountCredit.availableCredit);
  const requiresCard = remainingCharge > 0;

  if (orderComplete) {
    return (
      <OrderConfirmation
        orderId={orderId}
        scheduledTime={scheduleData?.scheduledDate || new Date()}
        isTestFaxRequested={isTestFaxRequested}
        recipientCount={recipientCount}
        onViewReports={handleViewReports}
        onSubmitAnother={onStartOver}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Credit Section */}
      <AccountCredit {...mockAccountCredit} />

      {/* Payment Warning for Test Fax */}
      {isTestFaxRequested && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700">
                Your card will be authorized for the estimated order amount but won't be charged until the test fax is approved and the order is finalized.
              </p>
              {scheduleData?.scheduledDate && (
                <p className="text-sm text-yellow-700 mt-2">
                  The scheduled delivery time may be adjusted if it has passed during the test fax approval process.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Section */}
      {requiresCard && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
            <div className="text-sm text-gray-500">
              Amount to be charged: ${remainingCharge.toFixed(2)}
            </div>
          </div>

          {showAddCard ? (
            <AddCardForm
              onCancel={() => setShowAddCard(false)}
              onSuccess={handleAddCardSuccess}
            />
          ) : (
            <div className="space-y-4">
              <SavedCardList
                cards={mockSavedCards}
                selectedCardId={selectedCardId}
                onCardSelect={setSelectedCardId}
              />

              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add new card
              </button>
            </div>
          )}
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${mockAccountCredit.orderAmount.toFixed(2)}</span>
          </div>
          {mockAccountCredit.availableCredit > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account Credit Applied</span>
              <span className="text-green-600">
                -${Math.min(mockAccountCredit.availableCredit, mockAccountCredit.orderAmount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium">
                {isTestFaxRequested ? 'Amount to be authorized' : 'Total to be charged'}
              </span>
              <span className="font-medium">
                ${remainingCharge.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <button
            onClick={onStartOver}
            disabled={isProcessing}
            className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            Start Over
          </button>
        </div>

        <motion.button
          onClick={handleCompleteOrder}
          disabled={isProcessing || (requiresCard && !selectedCardId)}
          animate={!isProcessing ? {
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 8px rgba(59, 130, 246, 0.2)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              {isTestFaxRequested ? 'Authorize Payment' : 'Complete Order'}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default PaymentStep;