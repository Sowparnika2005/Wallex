// ============================================
// Payments Page — Send money with category selection
// ============================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiPhone, FiDollarSign, FiFileText,
  FiCheck, FiArrowLeft, FiSend
} from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { DEFAULT_CATEGORIES, ICON_MAP } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const { addTransaction, categories, settings } = useApp();
  const [step, setStep] = useState(1); // 1=form, 2=category, 3=confirm, 4=success
  const [formData, setFormData] = useState({
    recipient: '', phone: '', amount: '', note: '', category: ''
  });
  const [loading, setLoading] = useState(false);

  const currency = settings.currency || 'INR';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (catId) => {
    setFormData(prev => ({ ...prev, category: catId }));
    setStep(3);
  };

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    await addTransaction({
      amount: Number(formData.amount),
      category: formData.category,
      recipient: formData.recipient,
      note: formData.note || `Payment to ${formData.recipient}`,
      type: 'expense',
    });

    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setFormData({ recipient: '', phone: '', amount: '', note: '', category: '' });
    setStep(1);
  };

  const getCatInfo = (id) => categories.find(c => c.id === id) || DEFAULT_CATEGORIES.find(c => c.id === id);
  const inputClass = "input-field";

  return (
    <div className="page-container max-w-lg mx-auto">
      <AnimatePresence mode="wait">

        {/* ---- STEP 1: Payment Form ---- */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6">
              <h1 className="page-title">Send Money</h1>
              <p className="page-subtitle">Enter payment details</p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Recipient Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="text" value={formData.recipient} onChange={(e) => handleInputChange('recipient', e.target.value)}
                    placeholder="Enter name" className={`${inputClass} pl-11`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX" className={`${inputClass} pl-11`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 font-medium">₹</span>
                  <input type="number" value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00" className={`${inputClass} pl-9 text-2xl font-bold`} min="1" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Note (optional)</label>
                <div className="relative">
                  <FiFileText className="absolute left-3.5 top-3 text-surface-400" />
                  <textarea value={formData.note} onChange={(e) => handleInputChange('note', e.target.value)}
                    placeholder="What's this for?" className={`${inputClass} pl-11 resize-none`} rows={2} />
                </div>
              </div>

              <Button
                onClick={() => {
                  if (!formData.recipient || !formData.amount) {
                    toast.error('Please enter recipient and amount');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full"
              >
                Continue <FiSend size={18} />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ---- STEP 2: Category Selection ---- */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(1)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800">
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="page-title">Select Category</h1>
                <p className="page-subtitle">Choose a spending category</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => {
                const IconComponent = ICON_MAP[cat.icon];
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="premium-card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                      {IconComponent && <IconComponent style={{ color: cat.color }} size={22} />}
                    </div>
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 text-center leading-tight">
                      {cat.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ---- STEP 3: Confirm ---- */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(2)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800">
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="page-title">Confirm Payment</h1>
                <p className="page-subtitle">Review details before sending</p>
              </div>
            </div>

            <Card className="p-6">
              <div className="text-center mb-6">
                <p className="text-surface-400 text-sm mb-1">Sending to</p>
                <p className="text-xl font-bold text-surface-900 dark:text-white">{formData.recipient}</p>
                {formData.phone && <p className="text-sm text-surface-400">{formData.phone}</p>}
              </div>

              <div className="text-center py-6 border-y border-surface-100 dark:border-surface-700 my-4">
                <p className="text-4xl font-bold text-gradient">{formatCurrency(Number(formData.amount), currency)}</p>
              </div>

              <div className="space-y-3 mb-6">
                {formData.category && (() => {
                  const cat = getCatInfo(formData.category);
                  const IconComponent = cat ? ICON_MAP[cat.icon] : null;
                  return (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-400">Category</span>
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent style={{ color: cat.color }} size={16} />}
                        <span className="text-sm font-medium text-surface-900 dark:text-white">{cat?.name}</span>
                      </div>
                    </div>
                  );
                })()}
                {formData.note && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Note</span>
                    <span className="text-sm font-medium text-surface-900 dark:text-white">{formData.note}</span>
                  </div>
                )}
              </div>

              <Button onClick={handleConfirm} loading={loading} className="w-full">
                {loading ? 'Processing...' : 'Confirm & Send'}
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ---- STEP 4: Success ---- */}
        {step === 4 && (
          <motion.div
            key="step4"
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FiCheck size={48} className="text-emerald-500" />
              </motion.div>
            </motion.div>

            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-surface-400 mb-2">
              {formatCurrency(Number(formData.amount), currency)} sent to {formData.recipient}
            </p>
            <p className="text-xs text-surface-400 mb-8">Transaction ID: #{Date.now().toString(36).toUpperCase()}</p>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetForm}>New Payment</Button>
              <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
