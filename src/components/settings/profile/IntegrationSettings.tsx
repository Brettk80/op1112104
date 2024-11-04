import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Webhook, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const webhookSchema = z.object({
  enabled: z.boolean(),
  protocol: z.enum(['http', 'https']),
  url: z.string().url('Invalid URL').refine(url => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, 'Invalid URL protocol'),
  events: z.object({
    faxReceived: z.boolean(),
    faxSent: z.boolean(),
    faxFailed: z.boolean(),
    optOut: z.boolean()
  })
});

type WebhookFormData = z.infer<typeof webhookSchema>;

const IntegrationSettings: React.FC = () => {
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      enabled: true,
      protocol: 'https',
      url: 'https://api.acmecorp.com/webhooks/fax',
      events: {
        faxReceived: true,
        faxSent: true,
        faxFailed: true,
        optOut: true
      }
    }
  });

  const webhookEnabled = watch('enabled');

  const onSubmit = async (data: WebhookFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Webhook settings updated');
    } catch (error) {
      toast.error('Failed to update webhook settings');
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Webhook test successful');
    } catch (error) {
      toast.error('Webhook test failed');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Webhook className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Webhook Configuration</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register('enabled')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Enable Webhooks
              </label>
              <p className="text-sm text-gray-500">
                Receive real-time notifications for fax events
              </p>
            </div>
          </div>

          <div className={webhookEnabled ? 'space-y-4' : 'space-y-4 opacity-50 pointer-events-none'}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Protocol
              </label>
              <select
                {...register('protocol')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="https">HTTPS</option>
                <option value="http">HTTP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Webhook URL
              </label>
              <input
                type="url"
                {...register('url')}
                className="mt-1 block w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://your-domain.com/webhook"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Events
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('events.faxReceived')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Fax Received
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('events.faxSent')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Fax Sent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('events.faxFailed')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Fax Failed
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('events.optOut')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Opt-Out Received
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isTestingWebhook ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Testing...
                  </>
                ) : (
                  'Test Webhook'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
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

export default IntegrationSettings;