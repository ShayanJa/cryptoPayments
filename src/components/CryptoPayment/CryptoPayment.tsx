import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Check } from 'lucide-react';
import { CryptoPaymentProps, SupportedCrypto } from './types';
import {formatCryptoAmount } from './utils';
import { CheckoutButton } from './CheckoutButton';
import { Modal } from './Modal';
import { PaymentStatus } from './PaymentStatus';
import { CountdownTimer } from './CountdownTimer';
import { usePaymentMonitor } from './hooks/usePaymentMonitor';
import { createPayment } from '../../lib/api';
import {getPriceFromCoingecko} from '../CryptoPayment/utils'

const PAYMENT_WINDOW_MINUTES = 30;

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  amount,
  currency = 'USD',
  onPaymentComplete,
  onPaymentError,
  onPaymentPending,
  supportedCurrencies = ['ETH'],
  description,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCrypto | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [session_id, setSessionId] = useState<number | null>(null)
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const { status, error } = usePaymentMonitor(
    paymentAddress,
    selectedCurrency,
    amount
  );

  useEffect(() => {
    const getPrices = async () => {
      const price = await getPriceFromCoingecko(selectedCurrency)
      console.log(price)
      if (price) {
        setEstimatedCost(amount / price)
      }
    }
    getPrices()
  }, [selectedCurrency])


  useEffect(() => {
    if (status.isReceived && status.txHash) {
      onPaymentComplete?.(status.txHash);
      setTimeout(() => setIsModalOpen(false), 2000);
    }
  }, [status.isReceived, status.txHash]);

  useEffect(() => {
    if (error) {
      onPaymentError?.(error);
    }
  }, [error]);

  useEffect(() => {
    if (isModalOpen && selectedCurrency) {
      const setupPayment = async () => {
        setIsLoading(true);
        try {
          const price = await getPriceFromCoingecko(selectedCurrency)
          if (price) {
            setEstimatedCost(amount / price)
          }
          
          const res = await createPayment({amount: amount / price, currency:selectedCurrency})
          setPaymentAddress(res.address)

          // Set expiry time to 30 minutes from now
          setExpiryTime(new Date(Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000));
          onPaymentPending?.(res.id)
        } catch (error) {
          onPaymentError?.(error as Error);
        } finally {
          setIsLoading(false);
        }
      };
      setupPayment();
    } else {
      setPaymentAddress('');
      setExpiryTime(null);
    }
  }, [selectedCurrency, isModalOpen]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(paymentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCurrencySelect = (crypto: SupportedCrypto) => {
    setSelectedCurrency(crypto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!status.isReceived) {
      setIsModalOpen(false);
      setSelectedCurrency(null);
    }
  };

  const handleExpire = () => {
    if (!status.isReceived) {
      setIsModalOpen(false);
      setSelectedCurrency(null);
      onPaymentError?.(new Error('Payment window expired'));
    }
  };

  const PaymentModal = () => (
    <div className="p-6">
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedCurrency} Payment
        </h2>
      </div>

      {description && (
        <p className="text-gray-600 mb-4 animate-fadeIn delay-100">{description}</p>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-fadeIn delay-200">
        <div className="text-center mb-2">
          <span className="text-sm text-gray-600">Amount to Pay</span>
          <div className="text-2xl font-bold text-gray-900">
            {selectedCurrency && estimatedCost && formatCryptoAmount(estimatedCost, selectedCurrency)}
          </div>
          <div className="text-sm text-gray-500">≈ {amount} {currency}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px] animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6 animate-fadeIn delay-300">
            <div className="p-3 bg-white rounded-lg transform transition-transform duration-300 hover:scale-105">
              <QRCode
                value={paymentAddress}
                size={200}
                level="H"
                className="mx-auto"
              />
            </div>
          </div>

          {expiryTime && (
            <div className="mb-4 animate-fadeIn delay-300">
              <CountdownTimer
                expiryTime={expiryTime}
                onExpire={handleExpire}
              />
            </div>
          )}

          <div className="mb-6">
            <PaymentStatus
              isReceived={status.isReceived}
              confirmations={status.confirmations}
              error={error}
            />
          </div>

          <div className="relative animate-fadeIn delay-400">
            <input
              type="text"
              value={paymentAddress}
              readOnly
              className="w-full px-4 py-3 bg-gray-50 rounded-lg pr-12 font-mono text-sm transition-all duration-200 hover:bg-gray-100"
            />
            <button
              onClick={handleCopyAddress}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <CheckoutButton
        amount={amount}
        currency={currency}
        onCurrencySelect={handleCurrencySelect}
        supportedCurrencies={supportedCurrencies}
      />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <PaymentModal />
      </Modal>
    </>
  );
};