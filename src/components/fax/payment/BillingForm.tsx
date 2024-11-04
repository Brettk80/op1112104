import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import valid from 'card-validator';
import { countries } from '../../../data/countries';

// States/Provinces data
const statesByCountry = {
  US: [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ],
  CA: [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'YT', name: 'Yukon' }
  ]
};

const countriesWithStates = Object.keys(statesByCountry);

const billingSchema = z.object({
  cardNumber: z.string()
    .min(1, 'Card number is required')
    .refine(val => valid.number(val).isValid, 'Invalid card number'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
  expiryYear: z.string().regex(/^\d{2}$/, 'Invalid year'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid security code'),
  country: z.string().min(1, 'Country is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal/ZIP code is required')
});

type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  onSubmit: (data: BillingFormData) => void;
  onCancel: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({ onSubmit, onCancel }) => {
  const [cardType, setCardType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      country: 'US'
    }
  });

  const watchCountry = watch('country');
  const watchCardNumber = watch('cardNumber');

  useEffect(() => {
    if (watchCardNumber) {
      const { card } = valid.number(watchCardNumber);
      setCardType(card?.type || '');
    }
  }, [watchCardNumber]);

  useEffect(() => {
    setSelectedCountry(watchCountry);
    if (!countriesWithStates.includes(watchCountry)) {
      setValue('state', '');
    }
  }, [watchCountry, setValue]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/(\d{1,4})/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue('cardNumber', formatted);
  };

  const getCardLogo = () => {
    if (!cardType) return null;
    
    const logos: Record<string, string> = {
      visa: '💳 Visa',
      mastercard: '💳 Mastercard',
      'american-express': '💳 Amex',
      discover: '💳 Discover'
    };
    
    return (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <span className="text-gray-400 font-medium">{logos[cardType] || cardType}</span>
      </div>
    );
  };

  const handleFormSubmit = async (data: BillingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Card Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              {...register('cardNumber')}
              onChange={handleCardNumberChange}
              className="block w-full pl-3 pr-10 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
            {getCardLogo()}
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cardholder Name
          </label>
          <input
            type="text"
            {...register('cardholderName')}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.cardholderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <select
                {...register('expiryMonth')}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  );
                })}
              </select>
              <select
                {...register('expiryYear')}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">YY</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const year = (new Date().getFullYear() + i).toString().slice(-2);
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            {(errors.expiryMonth || errors.expiryYear) && (
              <p className="mt-1 text-sm text-red-600">Invalid expiration date</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Security Code (CVC)
            </label>
            <input
              type="text"
              {...register('cvc')}
              maxLength={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123"
            />
            {errors.cvc && (
              <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
        
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Country/Region
            </label>
            <select
              {...register('country')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              {...register('addressLine1')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.addressLine1 && (
              <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
            )}
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              {...register('addressLine2')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          {countriesWithStates.includes(selectedCountry) && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {selectedCountry === 'US' ? 'State' : 'Province'}
              </label>
              <select
                {...register('state')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select {selectedCountry === 'US' ? 'state' : 'province'}</option>
                {statesByCountry[selectedCountry as keyof typeof statesByCountry]?.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {selectedCountry === 'US' ? 'ZIP Code' : 'Postal Code'}
            </label>
            <input
              type="text"
              {...register('postalCode')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            'Add Card'
          )}
        </button>
      </div>
    </form>
  );
};

export default BillingForm;