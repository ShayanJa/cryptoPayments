import { useState, useEffect } from 'react';
import { SupportedCrypto } from '../types';

interface PaymentStatus {
  isReceived: boolean;
  txHash?: string;
  confirmations?: number;
}

export const usePaymentMonitor = (
  address: string,
  currency: SupportedCrypto | null,
  expectedAmount: number
) => {
  const [status, setStatus] = useState<PaymentStatus>({
    isReceived: false,
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !currency) {
      setStatus({ isReceived: false });
      setError(null);
      return;
    }

    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/payment/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            currency,
            expectedAmount,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to check payment status');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setStatus({
          isReceived: data.isReceived,
          txHash: data.txHash,
          confirmations: data.confirmations,
        });
        setError(null);
      } catch (err) {
        setError(err as Error);
        setStatus({ isReceived: false });
      }
    };

    // Check immediately and then every 15 seconds
    checkPayment();
    const interval = setInterval(checkPayment, 15000);

    return () => clearInterval(interval);
  }, [address, currency, expectedAmount]);

  return { status, error };
};