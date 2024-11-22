import { ethers } from 'ethers';
import { SupportedCrypto } from '../components/CryptoPayment/types';

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