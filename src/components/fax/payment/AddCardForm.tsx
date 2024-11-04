import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { countries } from '../../../data/countries';

interface AddCardFormProps {
  onCancel: () => void;
  onSuccess: (cardId: string) => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onCancel, onSuccess }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const firstDigit = value.charAt(0);
    
    // Detect card type
    if (firstDigit === '4') setCardType('visa');
    else if (firstDigit === '5') setCardType('mastercard');
    else if (firstDigit === '6') setCardType('discover');
    else if (firstDigit === '3') setCardType('amex');
    else setCardType('');

    // Format card number
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }

    setCardNumber(formatted);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const getCardIcon = () => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      discover: '💳',
      amex: '💳'
    };
    return cardType ? icons[cardType] : '💳';
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className={`h-5 w-5 ${cardType ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
            {cardType && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-xl">{getCardIcon()}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
          <input
            type="text"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Name on card"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <select className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <select className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">YY</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year.toString().slice(-2)}>
                      {year.toString().slice(-2)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CVC</label>
            <input
              type="text"
              maxLength={4}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="mt-1 block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apt, Suite, etc. (optional)</label>
          <input
            type="text"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {selectedCountry === 'US' ? 'State' : 'Province'}
            </label>
            <input
              type="text"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {selectedCountry === 'US' ? 'ZIP Code' : 'Postal Code'}
            </label>
            <input
              type="text"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 8px rgba(59, 130, 246, 0.2)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Add Card
        </motion.button>
      </div>
    </form>
  );
};

export default AddCardForm;