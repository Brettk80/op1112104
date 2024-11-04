import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const communicationSchema = z.object({
  invoiceEmail: z.string().email('Invalid email address'),
  reportEmail: z.string().email('Invalid email address'),
  dailyDigest: z.boolean(),
  instantNotifications: z.boolean()
});

type CommunicationFormData = z.infer<typeof communicationSchema>;

const CommunicationPrefs: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      invoiceEmail: 'billing@acmecorp.com',
      reportEmail: 'reports@acmecorp.com',
      dailyDigest: true,
      instantNotifications: true
    }
  });

  const onSubmit = async (data: CommunicationFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Communication preferences updated');
    } catch (error) {
      toast.error('Failed to update communication preferences');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Mail className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Communication Preferences</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Email Address
            </label>
            <input
              type="email"
              {...register('invoiceEmail')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.invoiceEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.invoiceEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fax Report Email Address
            </label>
            <input
              type="email"
              {...register('reportEmail')}
              className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.reportEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.reportEmail.message}</p>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register('dailyDigest')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  Daily Digest
                </label>
                <p className="text-sm text-gray-500">
                  Receive a daily summary of all fax activity
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register('instantNotifications')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  Instant Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive immediate notifications for failed faxes and important events
                </p>
              </div>
            </div>
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

export default CommunicationPrefs;