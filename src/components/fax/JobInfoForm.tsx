import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info, AlertCircle, Ban, Phone, FileSpreadsheet } from 'lucide-react';

const jobInfoSchema = z.object({
  billCode: z.string().optional(),
  toHeader: z.string().max(15, 'To Header must be 15 characters or less'),
  toHeaderMode: z.enum(['replace_all', 'fill_missing']),
  fromHeader: z.string().max(15, 'From Header must be 15 characters or less')
});

type JobInfoFormData = z.infer<typeof jobInfoSchema>;

interface JobInfoFormProps {
  onSubmit: (data: JobInfoFormData) => void;
  defaultFromHeader?: string;
  hasToHeaderMappings?: boolean;
  mappedContactCount?: number;
  unmappedContactCount?: number;
  accountBlockLists?: {
    tollFreeNumber: string;
    tollFreeBlockCount: number;
    storedBlockListCount: number;
  };
  uploadedBlockLists?: {
    fileName: string;
    numberCount: number;
  }[];
  onEditBlockList?: () => void;
}

const JobInfoForm: React.FC<JobInfoFormProps> = ({
  onSubmit,
  defaultFromHeader = '',
  hasToHeaderMappings = false,
  mappedContactCount = 0,
  unmappedContactCount = 0,
  accountBlockLists = {
    tollFreeNumber: '1-800-555-0123',
    tollFreeBlockCount: 1250,
    storedBlockListCount: 551
  },
  uploadedBlockLists = [],
  onEditBlockList
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<JobInfoFormData>({
    resolver: zodResolver(jobInfoSchema),
    defaultValues: {
      fromHeader: defaultFromHeader,
      toHeaderMode: 'fill_missing'
    }
  });

  const toHeaderMode = watch('toHeaderMode');
  const toHeader = watch('toHeader');

  const totalBlockedNumbers = accountBlockLists.tollFreeBlockCount + 
    accountBlockLists.storedBlockListCount + 
    uploadedBlockLists.reduce((sum, list) => sum + list.numberCount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Job Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure billing and fax header information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Billing Code */}
        <div className="bg-white rounded-lg">
          <div className="border border-gray-200 rounded-lg">
            <label htmlFor="billCode" className="block text-sm font-medium text-gray-700 p-4 border-b border-gray-200 bg-gray-50">
              Billing Code / Description
            </label>
            <div className="p-4 space-y-4">
              <input
                type="text"
                id="billCode"
                autoComplete="off"
                autoFocus
                placeholder="Enter billing code or description"
                {...register('billCode')}
                className="block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
              />
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">
                      This description will appear on your invoice and reports to help identify this broadcast
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block List Summary */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Ban className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Block Lists</h4>
              <p className="text-sm text-blue-700 mt-1">
                Total block list size: {totalBlockedNumbers.toLocaleString()} numbers
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3 bg-white bg-opacity-50 rounded-lg p-3">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-sm text-gray-900 font-medium">
                      {accountBlockLists.tollFreeBlockCount.toLocaleString()} numbers
                    </span>
                    <p className="text-sm text-gray-600">
                      From toll-free opt-out list
                      <span className="text-gray-500 ml-1">
                        ({accountBlockLists.tollFreeNumber})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white bg-opacity-50 rounded-lg p-3">
                  <Ban className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-sm text-gray-900 font-medium">
                      {accountBlockLists.storedBlockListCount.toLocaleString()} numbers
                    </span>
                    <p className="text-sm text-gray-600">
                      From stored block lists
                    </p>
                  </div>
                </div>

                {uploadedBlockLists.length > 0 && (
                  <div className="flex items-center justify-between space-x-3 bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-900 font-medium">
                          {uploadedBlockLists.reduce((sum, list) => sum + list.numberCount, 0).toLocaleString()} numbers
                        </span>
                        <p className="text-sm text-gray-600">
                          From {uploadedBlockLists.length} uploaded block {uploadedBlockLists.length === 1 ? 'list' : 'lists'}
                        </p>
                      </div>
                    </div>
                    {onEditBlockList && (
                      <button
                        type="button"
                        onClick={onEditBlockList}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit Lists
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* To Header */}
        <div className="bg-white rounded-lg">
          <div className="border border-gray-200 rounded-lg">
            <label htmlFor="toHeader" className="block text-sm font-medium text-gray-700 p-4 border-b border-gray-200 bg-gray-50">
              To Header
            </label>
            <div className="p-4 space-y-4">
              <div>
                <input
                  type="text"
                  id="toHeader"
                  maxLength={15}
                  autoComplete="off"
                  placeholder="Enter To Header (max 15 characters)"
                  {...register('toHeader')}
                  className="block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
                />
                {errors.toHeader && (
                  <p className="mt-1 text-sm text-red-600">{errors.toHeader.message}</p>
                )}
              </div>

              {hasToHeaderMappings && toHeader && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="radio"
                        id="fill_missing"
                        value="fill_missing"
                        {...register('toHeaderMode')}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="fill_missing" className="text-sm font-medium text-gray-900">
                        Use for contacts without a To Header
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        {unmappedContactCount.toLocaleString()} contacts will use this value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="radio"
                        id="replace_all"
                        value="replace_all"
                        {...register('toHeaderMode')}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="replace_all" className="text-sm font-medium text-gray-900">
                        Replace all To Headers with this value
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        Will override {mappedContactCount.toLocaleString()} existing To Headers
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          {toHeaderMode === 'replace_all' 
                            ? `All ${(mappedContactCount + unmappedContactCount).toLocaleString()} contacts will use "${toHeader}" as their To Header`
                            : `${mappedContactCount.toLocaleString()} contacts will keep their mapped To Headers, ${unmappedContactCount.toLocaleString()} will use "${toHeader}"`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hasToHeaderMappings && toHeader && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        No To Headers are mapped in your contact lists. All contacts will use this value.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* From Header */}
        <div className="bg-white rounded-lg">
          <div className="border border-gray-200 rounded-lg">
            <label htmlFor="fromHeader" className="block text-sm font-medium text-gray-700 p-4 border-b border-gray-200 bg-gray-50">
              From Header
            </label>
            <div className="p-4">
              <input
                type="text"
                id="fromHeader"
                maxLength={15}
                autoComplete="off"
                placeholder="Enter From Header (max 15 characters)"
                {...register('fromHeader')}
                className="block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
              />
              {errors.fromHeader && (
                <p className="mt-1 text-sm text-red-600">{errors.fromHeader.message}</p>
              )}

              {defaultFromHeader && (
                <div className="mt-4 rounded-md bg-blue-50 border border-blue-100 p-4">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Using account default From Header. You can override it for this broadcast only.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobInfoForm;