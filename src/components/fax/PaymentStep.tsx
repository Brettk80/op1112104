import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import SavedCardList from './payment/SavedCardList';
import AccountCredit from './payment/AccountCredit';
import AddCardForm from './payment/AddCardForm';

interface PaymentStepProps {
  scheduleData: {
    sendImmediately: boolean;
    scheduledDate?: Date;
    scheduledTime?: string;
  } | null;
  isTestFaxRequested: boolean;
  onBack: () => void;
  onStartOver: () => void;
}

// Mock data for demonstration
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
  onBack,
  onStartOver
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(mockSavedCards[0].id);
  const [showAddCard, setShowAddCard] = useState(false);

  const handleAddCardSuccess = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowAddCard(false);
  };

  return (
    <div className="space-y-6">
      {/* Account Credit Section */}
      <AccountCredit {...mockAccountCredit} />

      {/* Payment Method Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h3>

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
              <span className="text-green-600">-${Math.min(mockAccountCredit.availableCredit, mockAccountCredit.orderAmount).toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium">Total to be charged</span>
              <span className="font-medium">
                ${Math.max(0, mockAccountCredit.orderAmount - mockAccountCredit.availableCredit).toFixed(2)}
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

        <button
          onClick={() => {/* Handle payment submission */}}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;