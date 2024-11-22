const API_BASE_URL = 'http://localhost:3000/api';

export const createCheckout = async (data: {
  amount: number;
  currency: string;
  // blockchainId: string
  supportedCurrencies: ('ETH' | 'BTC')[];
  description?: string;
}) => {
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

export const getCheckout = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/checkout/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to get checkout');
  }
  
  return response.json();
};

export const updateCheckout = async (id: string, data: {
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}) => {
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