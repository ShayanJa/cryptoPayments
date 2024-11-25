import { ethers } from 'ethers';
import { SupportedCrypto } from './types';
import axios from 'axios'
export const generatePaymentAddress = async (currency: SupportedCrypto): Promise<string> => {
  if (currency === 'ETH') {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
  } else {
    // For demo purposes, returning a static BTC address
    // In production, you'd want to generate this properly using bitcoinjs-lib
    return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  }
};

export const formatCryptoAmount = (amount: number, currency: SupportedCrypto): string => {
  return `${amount.toFixed(10)} ${currency}`;
};

export const getCurrencyIcon = (currency: SupportedCrypto): string => {
  const icons: Record<SupportedCrypto, string> = {
    ETH: '₿',
    BTC: 'Ξ',
  };
  return icons[currency];
};

export const getPriceFromCoingecko = async (crypto: SupportedCrypto): Promise<number> => {
  
  if (!import.meta.env.VITE_COINGECKO_API_KEY) throw new Error('Missing COINGECKO_API_KEY environment variable');
  const geckoCryptoName = {"ETH": "ethereum", "BTC": 'bitcoin'}  
  console.log(geckoCryptoName[crypto])
  const apiClient = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    headers: {
      'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
    }
  });
  try {
    const response = await apiClient.get(
      `/simple/price?ids=${geckoCryptoName[crypto]}&vs_currencies=usd`
    );
    return response.data[geckoCryptoName[crypto]].usd;
  } catch (error) {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Consider upgrading your CoinGecko plan.');
    } else {
      console.error(`Error fetching price for ${crypto}:`, error.message);
    }
    return null;
  }
}