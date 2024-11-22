import { useState, useEffect } from 'react';
import { SupportedCrypto } from '../types';
import {checkPaymentStatus} from '../../../lib/api'

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
  console.log(address)

  useEffect(() => {
    if (!address || !currency) {
      setStatus({ isReceived: false });
      setError(null);
      return;
    }
    console.log("here")

    const checkPayment = async () => {
      try {
        const data = await checkPaymentStatus(
            address,
            currency,
            expectedAmount,
        )
        console.log(data)

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