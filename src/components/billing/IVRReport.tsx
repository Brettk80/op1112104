import React from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';

interface IVRReportProps {
  filters: {
    dateRange: [Date | null, Date | null];
    status: string;
    search: string;
  };
}

const IVRReport: React.FC<IVRReportProps> = ({ filters }) => {
  // Mock data
  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    date: format(new Date(2024, 2, i + 1), 'MMM d'),
    calls: Math.floor(Math.random() * 50),
    optOuts: Math.floor(Math.random() * 10),
    cost: Math.random() * 100
  }));

  const summary = {
    totalCalls: 850,
    totalOptOuts: 125,
    totalCost: 425.50,
    callsChange: 15.5,
    optOutsChange: -8.2,
    costChange: 12.3
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Calls: {payload[0].value}
          </p>
          <p className="text-sm text-gray-600">
            Opt-outs: {payload[1].value}
          </p>
          <p className="text-sm text-gray-600">
            Cost: {formatCurrency(payload[2].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                <p className="text-lg font-semibold text-gray-900">
                  {summary.totalCalls.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              {summary.callsChange > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={summary.callsChange > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(summary.callsChange)}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Ban className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Opt-outs</p>
                <p className="text-lg font-semibold text-gray-900">
                  {summary.totalOptOuts.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              {summary.optOutsChange > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              )}
              <span className={summary.optOutsChange > 0 ? 'text-red-600' : 'text-green-600'}>
                {Math.abs(summary.optOutsChange)}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(summary.totalCost)}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              {summary.costChange > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              )}
              <span className={summary.costChange > 0 ? 'text-red-600' : 'text-green-600'}>
                {Math.abs(summary.costChange)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Activity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="calls"
                stackId="1"
                stroke="#2563EB"
                fill="#93C5FD"
              />
              <Area
                type="monotone"
                dataKey="optOuts"
                stackId="1"
                stroke="#DC2626"
                fill="#FCA5A5"
              />
              <Area
                type="monotone"
                dataKey="cost"
                stackId="2"
                stroke="#059669"
                fill="#6EE7B7"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default IVRReport;