export type SupportedCrypto = 'ETH' | 'BTC';

export interface PaymentDetails {
  amount: number;
  currency: SupportedCrypto;
  description?: string;
}

export interface CryptoPaymentProps {
  amount: number;
  currency?: string;
  onPaymentComplete?: (txHash: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentPending?: (id:string) => string;
  supportedCurrencies?: SupportedCrypto[];
  description?: string;
}