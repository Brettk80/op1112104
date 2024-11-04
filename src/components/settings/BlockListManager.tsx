import React, { useState } from 'react';
import { Ban, Upload, Download, Plus, Search, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BlockedNumber {
  number: string;
  dateAdded: string;
  method: 'WEB' | 'IVR';
}

const BlockListManager: React.FC = () => {
  const [blockedNumbers, setBlockedNumbers] = useState<BlockedNumber[]>([
    { number: '5555551212', dateAdded: '2022-09-28 02:13:08 PM CDT', method: 'WEB' },
    { number: '7677640968', dateAdded: '2021-12-17 06:42:03 PM CST', method: 'WEB' },
    { number: '15555551212', dateAdded: '2021-07-14 12:07:46 PM CDT', method: 'WEB' },
    { number: '15552223333', dateAdded: '2019-01-25 12:58:22 PM CST', method: 'IVR' },
    { number: '18554444444', dateAdded: '2018-11-14 10:52:21 PM CST', method: 'IVR' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [numberType, setNumberType] = useState<'US_CANADA' | 'INTERNATIONAL'>('US_CANADA');

  const handleAddNumber = () => {
    if (!newNumber.trim()) {
      toast.error('Please enter a valid fax number');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });

    setBlockedNumbers(prev => [
      {
        number: newNumber,
        dateAdded: formattedDate,
        method: 'WEB'
      },
      ...prev
    ]);

    toast.success('Number added to block list');
    setNewNumber('');
    setShowAddForm(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock file processing
    toast.success(`Processing ${file.name}`);
    setTimeout(() => {
      toast.success('Block list imported successfully');
    }, 1500);
  };

  const handleExportAll = () => {
    // Create CSV content
    const csvContent = [
      ['Fax Number', 'Date Added', 'Method'],
      ...blockedNumbers.map(entry => [
        entry.number,
        entry.dateAdded,
        entry.method
      ])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `block-list-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Downloading complete block list...');
  };

  const filteredNumbers = blockedNumbers.filter(entry =>
    entry.number.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Ban className="h-6 w-6 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Block List Manager</h2>
          </div>
          <div className="flex items-center space-x-2">
            <label className="relative inline-block">
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Import List
              </button>
            </label>
            <button
              onClick={handleExportAll}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Number
          </button>

          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search numbers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>

        {/* Add Number Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gray-50 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Number to Block List</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number Type
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="US_CANADA"
                      checked={numberType === 'US_CANADA'}
                      onChange={(e) => setNumberType(e.target.value as 'US_CANADA')}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">US & Canada Number</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="INTERNATIONAL"
                      checked={numberType === 'INTERNATIONAL'}
                      onChange={(e) => setNumberType(e.target.value as 'INTERNATIONAL')}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">International Number</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fax Number
                </label>
                <input
                  type="text"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="Enter fax number"
                  className="mt-1 block w-full px-4 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNumber}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add to Block List
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Warning Message */}
        <div className="mb-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700">
                Numbers added to the block list cannot be removed. This ensures compliance with opt-out requests and helps maintain a permanent record of blocked numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Block List Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fax Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNumbers.map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.dateAdded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.method === 'IVR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.method}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlockListManager;