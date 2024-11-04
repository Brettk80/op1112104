import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { countries } from '../../../data/countries';

// States/Provinces data
const statesByCountry = {
  US: [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    // ... (rest of US states)
  ],
  CA: [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    // ... (rest of Canadian provinces)
  ]
};

const countriesWithStates = Object.keys(statesByCountry);

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  country: z.string().min(1, 'Country is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal/ZIP code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Invalid email address')
});

type CompanyFormData = z.infer<typeof companySchema>;

const CompanyInfo: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      country: 'US',
      companyName: 'Acme Corp',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      phone: '+1 (555) 123-4567',
      contactName: 'John Doe',
      contactEmail: 'john@acmecorp.com'
    }
  });

  const watchCountry = watch('country');

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Company information updated successfully');
    } catch (error) {
      toast.error('Failed to update company information');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Building2 className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              {...register('companyName')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Country/Region
            </label>
            <select
              {...register('country')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              {...register('addressLine1')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.addressLine1 && (
              <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Apartment, suite, etc.
            </label>
            <input
              type="text"
              {...register('addressLine2')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          {countriesWithStates.includes(watchCountry) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {watchCountry === 'US' ? 'State' : 'Province'}
              </label>
              <select
                {...register('state')}
                className="mt-1 block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select {watchCountry === 'US' ? 'state' : 'province'}</option>
                {statesByCountry[watchCountry as keyof typeof statesByCountry]?.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {watchCountry === 'US' ? 'ZIP Code' : 'Postal Code'}
            </label>
            <input
              type="text"
              {...register('postalCode')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Name
            </label>
            <input
              type="text"
              {...register('contactName')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Email
            </label>
            <input
              type="email"
              {...register('contactEmail')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfo;