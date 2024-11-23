import { Router } from 'express';
import { CheckoutSchema, CheckoutUpdateSchema } from '../types';
import { CheckoutModel } from '../models/checkout';
import { generatePaymentAddress } from '../utils';

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const checkoutData = CheckoutSchema.parse(req.body);
    const selectedCurrency = checkoutData.supportedCurrencies[0];
    const paymentAddress = await generatePaymentAddress(selectedCurrency);
    console.log(paymentAddress)
    const checkout = new CheckoutModel({
      ...checkoutData,
      paymentAddress,
    });
    
    await checkout.save();
    res.json(checkout);
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(400).json({ error: 'Invalid checkout data' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const checkout = await CheckoutModel.findById(req.params.id);
    
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }
    
    res.json(checkout);
  } catch (error) {
    console.error('Get checkout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updateData = CheckoutUpdateSchema.parse(req.body);
    const checkout = await CheckoutModel.findByIdAndUpdate(
      updateData.id,
      { 
        $set: {
          status: updateData.status,
          txHash: updateData.txHash,
        }
      },
      { new: true }
    );
    
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }
    
    res.json(checkout);
  } catch (error) {
    console.error('Update checkout error:', error);
    res.status(400).json({ error: 'Invalid update data' });
  }
});

export default router;