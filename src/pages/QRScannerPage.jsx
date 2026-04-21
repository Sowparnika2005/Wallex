// ============================================
// QR Scanner Page — Camera-based scanning with simulated payment
// ============================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiCheck, FiArrowLeft, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();
  const { addTransaction, settings } = useApp();
  const currency = settings.currency || 'INR';

  const startScanning = async () => {
    setScanning(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      
      // Small delay to ensure DOM element is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // QR code scanned successfully
          handleScanSuccess(decodedText);
          html5QrCode.stop();
        },
        () => {} // ignore errors during scanning
      );
    } catch (err) {
      console.error('Camera error:', err);
      // Simulate a scan for demo purposes
      toast('Camera not available — simulating scan', { icon: '📷' });
      setTimeout(() => {
        handleScanSuccess('upi://pay?pa=merchant@upi&pn=Coffee Shop&am=350&cu=INR');
      }, 2000);
    }
  };

  const handleScanSuccess = (data) => {
    setScanning(false);
    // Parse UPI-style QR data
    try {
      const params = new URLSearchParams(data.split('?')[1] || '');
      setScannedData({
        merchant: params.get('pn') || 'Unknown Merchant',
        amount: Number(params.get('am')) || 350,
        upiId: params.get('pa') || 'merchant@upi',
        raw: data,
      });
    } catch {
      setScannedData({
        merchant: 'Scanned Payment',
        amount: 350,
        upiId: 'merchant@upi',
        raw: data,
      });
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await addTransaction({
      amount: scannedData.amount,
      category: 'shopping',
      recipient: scannedData.merchant,
      note: `QR Payment to ${scannedData.merchant}`,
      type: 'expense',
    });

    setLoading(false);
    setPaymentDone(true);
  };

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="page-container max-w-lg mx-auto">
      <AnimatePresence mode="wait">

        {/* ---- Initial State — Start Scan ---- */}
        {!scanning && !scannedData && !paymentDone && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-12"
          >
            <div className="flex items-center gap-3 self-start mb-8 w-full">
              <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800">
                <FiArrowLeft size={20} className="text-surface-600 dark:text-surface-300" />
              </button>
              <div>
                <h1 className="page-title">Scan & Pay</h1>
                <p className="page-subtitle">Scan a QR code to make payment</p>
              </div>
            </div>

            <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-8">
              <div className="w-32 h-32 border-4 border-dashed border-primary-300 dark:border-primary-600 rounded-2xl flex items-center justify-center">
                <FiCamera size={48} className="text-primary-400" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Scan QR Code</h3>
            <p className="text-sm text-surface-400 text-center mb-8 max-w-xs">
              Point your camera at a QR code to scan and make instant payments
            </p>

            <Button onClick={startScanning} className="px-8">
              <FiCamera size={20} /> Open Scanner
            </Button>
          </motion.div>
        )}

        {/* ---- Scanning State ---- */}
        {scanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="page-title">Scanning...</h1>
              <button
                onClick={() => {
                  setScanning(false);
                  if (html5QrCodeRef.current) html5QrCodeRef.current.stop().catch(() => {});
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black">
              <div id="qr-reader" ref={scannerRef} className="w-full" />
            </div>

            <p className="text-center text-surface-400 text-sm mt-4">
              Position the QR code within the frame
            </p>
          </motion.div>
        )}

        {/* ---- Scanned — Confirm Payment ---- */}
        {scannedData && !paymentDone && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setScannedData(null)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800">
                <FiArrowLeft size={20} className="text-surface-600 dark:text-surface-300" />
              </button>
              <h1 className="page-title">Confirm Payment</h1>
            </div>

            <div className="premium-card p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>

              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{scannedData.merchant}</h3>
              <p className="text-sm text-surface-400 mb-6">{scannedData.upiId}</p>

              <div className="py-6 border-y border-surface-100 dark:border-surface-700 mb-6">
                <p className="text-4xl font-bold text-gradient">{formatCurrency(scannedData.amount, currency)}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setScannedData(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handlePayment} loading={loading} className="flex-1">
                  {loading ? 'Paying...' : 'Pay Now'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- Payment Success ---- */}
        {paymentDone && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6"
            >
              <FiCheck size={48} className="text-emerald-500" />
            </motion.div>

            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-surface-400 mb-8">
              {formatCurrency(scannedData?.amount || 0, currency)} paid to {scannedData?.merchant}
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { setScannedData(null); setPaymentDone(false); }}>
                Scan Again
              </Button>
              <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
