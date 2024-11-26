const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

interface CreatePaymentData {
  amount: number;
  currency: 'ETH' | 'BTC';
  webhookUrl?: string;
  expiresIn?: number;
}

interface PaymentResponse {
  id: string;
  address: string;
  currency: 'ETH' | 'BTC';
  amount: number;
  expiresAt: string;
}

interface PaymentStatusResponse {
  isReceived: boolean;
  status?: 'pending' | 'completed' | 'expired';
  txHash?: string;
  confirmations?: number;
}

export const createPayment = async (data: CreatePaymentData): Promise<PaymentResponse> => {
  const response = await fetch(`${API_BASE_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment');
  }

  return response.json();
};

export const checkPaymentStatus = async (
  address: string,
  currency: 'ETH' | 'BTC',
  expectedAmount: number
): Promise<PaymentStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/payment/check`, {
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

  return response.json();
};