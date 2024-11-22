import React from 'react';
import { CryptoPayment } from './components/CryptoPayment/CryptoPayment';

function App() {
  const handlePaymentComplete = (txHash: string) => {
    console.log('Payment completed:', txHash);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Premium Plan</h2>
          <p className="text-gray-600 mb-6">Get access to all premium features</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">$99.99</span>
            <CryptoPayment
              amount={.10}
              currency="USD"
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={handlePaymentError}
              supportedCurrencies={['ETH', 'BTC']}
              description="Payment for Premium Plan"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;