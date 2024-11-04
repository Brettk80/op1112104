import React from 'react';
import { DollarSign } from 'lucide-react';

interface AccountCreditProps {
  balance: number;
  pendingHolds: number;
  availableCredit: number;
  orderAmount: number;
}

const AccountCredit: React.FC<AccountCreditProps> = ({
  balance,
  pendingHolds,
  availableCredit,
  orderAmount
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const remainingAfterOrder = availableCredit - orderAmount;
  const willUseCredit = orderAmount <= availableCredit;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Account Credit</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-lg font-medium text-gray-900">{formatCurrency(balance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Holds</p>
            <p className="text-lg font-medium text-gray-900">{formatCurrency(pendingHolds)}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available Credit</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(availableCredit)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Amount</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(orderAmount)}</p>
            </div>
          </div>
        </div>

        {willUseCredit ? (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-sm text-green-800">
              This order will be covered by your available credit. Remaining credit after order: {formatCurrency(remainingAfterOrder)}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your available credit will be applied to this order. Remaining balance to be charged: {formatCurrency(orderAmount - availableCredit)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountCredit;