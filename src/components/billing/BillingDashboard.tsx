import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Download, 
  Search, 
  Calendar,
  Clock as ClockIcon,
  Filter,
  FileText,
  Phone,
  CreditCard,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  items: {
    type: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

const BillingDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // Mock data
  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: new Date(),
      amount: 1250.00,
      status: 'paid',
      description: 'October Fax Services',
      items: [
        { type: 'Fax Broadcast', quantity: 1000, rate: 0.10, amount: 100.00 },
        { type: 'IVR Service', quantity: 1, rate: 150.00, amount: 150.00 }
      ]
    },
    {
      id: 'INV-002',
      date: new Date(),
      amount: 875.50,
      status: 'pending',
      description: 'November Fax Services',
      items: [
        { type: 'Fax Broadcast', quantity: 750, rate: 0.10, amount: 75.00 },
        { type: 'IVR Service', quantity: 1, rate: 150.00, amount: 150.00 }
      ]
    }
  ];

  const stats = {
    currentBalance: 2125.50,
    pendingCharges: 875.50,
    lastPayment: 1250.00,
    lastPaymentDate: new Date(),
    monthlyAverage: 1500.00
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesDate = !startDate || !endDate || 
                       (invoice.date >= startDate && invoice.date <= endDate);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.currentBalance)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Charges</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.pendingCharges)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Payment</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.lastPayment)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(stats.lastPaymentDate, 'MMM d, yyyy')}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Average</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.monthlyAverage)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              placeholderText="Select date range"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <button
              onClick={() => {/* Handle export */}}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-500">{invoice.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(invoice.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                        ${invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                      `}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;