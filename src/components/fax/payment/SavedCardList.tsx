import React from 'react';
import { CreditCard } from 'lucide-react';

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface SavedCardListProps {
  cards: SavedCard[];
  selectedCardId: string | null;
  onCardSelect: (id: string) => void;
}

const SavedCardList: React.FC<SavedCardListProps> = ({
  cards,
  selectedCardId,
  onCardSelect
}) => {
  const getCardLogo = (type: string) => {
    // Replace with actual card logos
    return <CreditCard className="h-6 w-6 text-gray-400" />;
  };

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onCardSelect(card.id)}
          className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
            selectedCardId === card.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getCardLogo(card.type)}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2">
                <span className="font-medium capitalize">{card.type}</span>
                <span className="text-gray-500">•••• {card.last4}</span>
              </div>
              <span className="text-sm text-gray-500">
                Expires {card.expiryMonth}/{card.expiryYear}
              </span>
            </div>
          </div>
          {card.isDefault && (
            <span className="text-sm text-gray-500">Default</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SavedCardList;