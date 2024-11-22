import React, { useState } from 'react';
import { Bitcoin, Wallet, ChevronDown } from 'lucide-react';
import { SupportedCrypto } from './types';

interface CheckoutButtonProps {
  amount: number;
  currency?: string;
  onCurrencySelect: (currency: SupportedCrypto) => void;
  supportedCurrencies: SupportedCrypto[];
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  amount,
  currency = 'USD',
  onCurrencySelect,
  supportedCurrencies,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrencyIcon = (crypto: SupportedCrypto) => {
    return crypto === 'BTC' ? <Bitcoin className="w-4 h-4" /> : <Wallet className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
      >
        <span className="font-medium">Pay {amount} {currency}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
          {supportedCurrencies.map((crypto) => (
            <button
              key={crypto}
              onClick={() => {
                onCurrencySelect(crypto);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                {getCurrencyIcon(crypto)}
              </div>
              <span className="font-medium text-gray-700">Pay with {crypto}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};