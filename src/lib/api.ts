const API_BASE_URL = 'http://localhost:3000/api';

interface CreateCheckoutData {
  amount: number;
  currency: string;
  supportedCurrencies: ('ETH' | 'BTC')[];
  description?: string;
}

interface CreatePaymentData {
  amount: number;
  currency: 'ETH' | 'BTC';
  webhookUrl?: string;
  expiresIn?: number;
}

interface PaymentResponse {
  address: string;
  currency: 'ETH' | 'BTC';
  amount: number;
  expiresAt: string;
}

interface CheckoutResponse {
  id: string;
  amount: number;
  currency: string;
  supportedCurrencies: ('ETH' | 'BTC')[];
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentAddress?: string;
  txHash?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStatusResponse {
  isReceived: boolean;
  status?: 'pending' | 'completed' | 'expired';
  txHash?: string;
  confirmations?: number;
}

export const createCheckout = async (data: CreateCheckoutData): Promise<CheckoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create checkout');
  }
  
  return response.json();
};

export const getCheckout = async (id: string): Promise<CheckoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/checkout/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to get checkout');
  }
  
  return response.json();
};

export const updateCheckout = async (
  id: string,
  data: {
    status: 'pending' | 'completed' | 'failed';
    txHash?: string;
  }
): Promise<CheckoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/checkout/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update checkout');
  }
  
  return response.json();
};

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

export const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: 'ETH' | 'BTC'
): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/payment/exchange-rate`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      from: fromCurrency,
      to: toCurrency,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get exchange rate');
  }

  const data = await response.json();
  return data.rate;
};