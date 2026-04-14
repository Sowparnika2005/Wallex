// ============================================
// Profile Page — User profile information
// ============================================
import { motion } from 'framer-motion';
import { FiMail, FiCalendar, FiDollarSign, FiActivity, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { transactions, monthSpent, settings } = useApp();
  const navigate = useNavigate();
  const currency = settings.currency || 'INR';

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgPerTx = transactions.length > 0 ? totalSpent / transactions.length : 0;

  const stats = [
    { label: 'Total Transactions', value: transactions.length, icon: FiActivity },
    { label: 'Total Spent', value: formatCurrency(totalSpent, currency), icon: FiDollarSign },
    { label: 'This Month', value: formatCurrency(monthSpent, currency), icon: FiCalendar },
    { label: 'Avg per Transaction', value: formatCurrency(Math.round(avgPerTx), currency), icon: FiDollarSign },
  ];

  return (
    <div className="page-container max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Back button for desktop */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-surface-400 hover:text-surface-600 transition-colors md:hidden">
          <FiArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-violet-600 to-purple-700 p-8 text-center text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <Avatar name={currentUser?.displayName || ''} size="xl" className="mx-auto mb-4 !ring-4 !ring-white/30" />
            <h2 className="text-2xl font-bold mb-1">{currentUser?.displayName || 'User'}</h2>
            <p className="text-white/70 flex items-center justify-center gap-1.5">
              <FiMail size={14} />
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4" delay={0}>
              <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-2">
                <stat.icon size={18} />
              </div>
              <p className="text-xs text-surface-400 mb-0.5">{stat.label}</p>
              <p className="text-base font-bold text-surface-900 dark:text-white">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="secondary" onClick={() => navigate('/settings')} className="w-full">
            Manage Settings
          </Button>
          <Button variant="danger" onClick={logout} className="w-full">
            Sign Out
          </Button>
        </div>

      </motion.div>
    </div>
  );
}
