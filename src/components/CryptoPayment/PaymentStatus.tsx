import React from 'react';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';

interface PaymentStatusProps {
  isReceived: boolean;
  confirmations?: number;
  error?: Error | null;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  isReceived,
  confirmations = 0,
  error,
}) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg animate-fadeIn">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">Error checking payment status</span>
      </div>
    );
  }

  if (isReceived) {
    return (
      <div className="flex items-center gap-2 text-green-500 bg-green-50 p-3 rounded-lg animate-fadeIn">
        <CheckCircle className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Payment received!</span>
          <span className="text-xs text-green-600">
            {confirmations} confirmation{confirmations !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-blue-500 bg-blue-50 p-3 rounded-lg animate-fadeIn">
      <Loader className="w-5 h-5 animate-spin" />
      <span className="text-sm">Waiting for payment...</span>
    </div>
  );
};