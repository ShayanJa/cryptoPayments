import mongoose from 'mongoose';
import { Checkout } from '../types';

const checkoutSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  supportedCurrencies: [{ type: String, enum: ['ETH', 'BTC'] }],
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAddress: String,
  txHash: String,
}, {
  timestamps: { 
    createdAt: true, 
    updatedAt: true 
  }
});

export const CheckoutModel = mongoose.model<Checkout>('Checkout', checkoutSchema);