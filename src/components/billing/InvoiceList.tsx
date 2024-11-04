import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Phone,
  Ban
} from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: {
    type: 'fax' | 'ivr' | 'blocklist';
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

interface InvoiceListProps {
  filters: {
    dateRange: [Date | null, Date | null];
    status: string;
    search: string;
  };
}

const InvoiceList: React.FC<InvoiceListProps> = ({ filters }) => {
  const [expandedInvoices, setExpandedInvoices] = useState<Set<string>>(new Set());

  // Mock data
  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: new Date(),
      amount: 1250.75,
      status: 'paid',
      items: [
        {
          type: 'fax',
          description: 'Fax Broadcast - Q4 Statements',
          quantity: 850,
          rate: 0.10,
          amount: 85.00
        },
        {
          type: 'ivr',
          description: 'IVR Service - Monthly',
          quantity: 1,
          rate: 25.00,
          amount: 25.00
        },
        {
          type: 'blocklist',
          description: 'Block List Management',
          quantity: 1,
          rate: 15.00,
          amount: 15.00
        }
      ]
    },
    // Add more mock invoices...
  ];

  const toggleInvoice = (id: string) => {
    setExpandedInvoices(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getItemIcon = (type: 'fax' | 'ivr' | 'blocklist') => {
    switch (type) {
      case 'fax':
        return <FileText className="h-4 w-4 text-gray-400" />;
      case 'ivr':
        return <Phone className="h-4 w-4 text-gray-400" />;
      case 'blocklist':
        return <Ban className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleInvoice(invoice.id)}
                      className="flex items-center text-sm font-medium text-gray-900"
                    >
                      {expandedInvoices.has(invoice.id) ? (
                        <ChevronDown className="h-5 w-5 mr-1.5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-1.5 text-gray-500" />
                      )}
                      {invoice.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(invoice.date, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {/* Handle download */}}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedInvoices.has(invoice.id) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <table className="min-w-full">
                            <thead>
                              <tr className="text-xs text-gray-500 uppercase">
                                <th className="py-2 text-left">Item</th>
                                <th className="py-2 text-right">Quantity</th>
                                <th className="py-2 text-right">Rate</th>
                                <th className="py-2 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {invoice.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="py-2">
                                    <div className="flex items-center">
                                      {getItemIcon(item.type)}
                                      <span className="ml-2 text-sm text-gray-900">
                                        {item.description}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2 text-right text-sm text-gray-500">
                                    {item.quantity.toLocaleString()}
                                  </td>
                                  <td className="py-2 text-right text-sm text-gray-500">
                                    {formatCurrency(item.rate)}
                                  </td>
                                  <td className="py-2 text-right text-sm text-gray-900">
                                    {formatCurrency(item.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className="py-2 text-right text-sm font-medium text-gray-900">
                                  Total
                                </td>
                                <td className="py-2 text-right text-sm font-medium text-gray-900">
                                  {formatCurrency(invoice.amount)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;