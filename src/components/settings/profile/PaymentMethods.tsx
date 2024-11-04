import React, { useState } from 'react';
import { CreditCard, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AddCardForm from '../../fax/payment/AddCardForm';

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

const PaymentMethods: React.FC = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
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
  ]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetDefault = async (cardId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSavedCards(cards =>
        cards.map(card => ({
          ...card,
          isDefault: card.id === cardId
        }))
      );
      
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to update default payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (savedCards.length === 1) {
      toast.error('Cannot remove last payment method');
      return;
    }

    const card = savedCards.find(c => c.id === cardId);
    if (card?.isDefault) {
      toast.error('Cannot remove default payment method');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSavedCards(cards => cards.filter(card => card.id !== cardId));
      toast.success('Payment method removed');
    } catch (error) {
      toast.error('Failed to remove payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCardSuccess = (cardId: string) => {
    // Add new card to list
    const newCard: SavedCard = {
      id: cardId,
      type: 'visa',
      last4: '1234',
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: false
    };
    
    setSavedCards(prev => [...prev, newCard]);
    setShowAddCard(false);
    toast.success('New payment method added');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
      </div>

      <div className="space-y-6">
        {/* Saved Cards */}
        <div className="space-y-4">
          {savedCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CreditCard className={`h-6 w-6 ${card.isDefault ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {card.type.charAt(0).toUpperCase() + card.type.slice(1)} ending in {card.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {card.expiryMonth}/{card.expiryYear}
                  </p>
                </div>
                {card.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {!card.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(card.id)}
                      disabled={isProcessing}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                    >
                      Make Default
                    </button>
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      disabled={isProcessing}
                      className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Card */}
        {showAddCard ? (
          <AddCardForm
            onCancel={() => setShowAddCard(false)}
            onSuccess={handleAddCardSuccess}
          />
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;