import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface DailyData {
  date: string;
  amount: number;
  faxCount: number;
}

const DailyOverview: React.FC = () => {
  // Mock data for the chart
  const data: DailyData[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: format(date, 'MMM d'),
      amount: Math.random() * 1000,
      faxCount: Math.floor(Math.random() * 100)
    };
  }).reverse();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Amount: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Faxes: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-6">Daily Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
            <YAxis yAxisId="right" orientation="right" stroke="#9333EA" />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="amount" fill="#93C5FD" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="faxCount" fill="#C4B5FD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOverview;