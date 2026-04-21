// ============================================
// Dashboard Page — Home screen with wallet, quick actions, recent transactions
// ============================================
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSend, FiList, FiBarChart2, FiTarget,
  FiArrowUpRight, FiArrowDownLeft, FiChevronRight
} from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getGreeting, DEFAULT_CATEGORIES, ICON_MAP } from '../utils/constants';
import { formatCurrency, formatRelativeDate } from '../utils/helpers';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import { TransactionSkeleton } from '../components/ui/Skeleton';

// Stagger animation for children
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { transactions, totalBalance, todaySpent, weekSpent, monthSpent, settings, loading, categories } = useApp();
  const navigate = useNavigate();
  const currency = settings.currency || 'INR';

  const recentTransactions = transactions.slice(0, 5);

  const quickActions = [
    { icon: FiSend, label: 'Send Money', color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400', path: '/payments' },
    { icon: HiOutlineQrcode, label: 'Scan QR', color: 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400', path: '/scanner' },
    { icon: FiList, label: 'Transactions', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', path: '/transactions' },
    { icon: FiBarChart2, label: 'Analytics', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', path: '/analytics' },
  ];

  // Find category details
  const getCategoryInfo = (catId) => {
    return categories.find(c => c.id === catId) || DEFAULT_CATEGORIES.find(c => c.id === catId) || { name: catId, icon: 'FaUtensils', color: '#6366f1' };
  };

  return (
    <div className="page-container">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* ---- Wallet Card ---- */}
        <motion.div variants={item}>
          <div className="wallet-card">
            <div className="relative z-10">
              <p className="text-white/70 text-sm font-medium mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold mb-6">{formatCurrency(totalBalance, currency)}</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                      <FiArrowDownLeft size={14} className="text-emerald-300" />
                    </div>
                    <span className="text-white/60 text-xs">Income</span>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(50000, currency)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center">
                      <FiArrowUpRight size={14} className="text-red-300" />
                    </div>
                    <span className="text-white/60 text-xs">Expense</span>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(monthSpent, currency)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- Quick Actions ---- */}
        <motion.div variants={item}>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="quick-action"
              >
                <div className={`quick-action-icon ${action.color}`}>
                  <action.icon size={22} />
                </div>
                <span className="text-xs font-medium text-surface-600 dark:text-surface-400">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ---- Spending Summary ---- */}
        <motion.div variants={item}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Today', value: todaySpent, limit: settings.limits?.daily || 2000 },
              { label: 'This Week', value: weekSpent, limit: settings.limits?.weekly || 10000 },
              { label: 'This Month', value: monthSpent, limit: settings.limits?.monthly || 40000 },
            ].map((s) => (
              <Card key={s.label} className="p-4" delay={0}>
                <p className="text-xs text-surface-400 font-medium mb-1">{s.label}</p>
                <p className="text-lg font-bold text-surface-900 dark:text-white mb-2">
                  {formatCurrency(s.value, currency)}
                </p>
                <ProgressBar value={s.value} max={s.limit} size="sm" showLabel={false} />
              </Card>
            ))}
          </div>
        </motion.div>

        {/* ---- Budget Alert ---- */}
        {monthSpent > (settings.limits?.monthly || 40000) * 0.8 && (
          <motion.div variants={item}>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 flex-shrink-0">
                <FiTarget size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Budget Alert</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  You've used {((monthSpent / (settings.limits?.monthly || 40000)) * 100).toFixed(0)}% of your monthly budget
                </p>
              </div>
              <button onClick={() => navigate('/budget')} className="text-amber-600 dark:text-amber-400">
                <FiChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ---- Recent Transactions ---- */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Transactions</h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
            >
              View All <FiChevronRight size={16} />
            </button>
          </div>

          <Card className="divide-y divide-surface-100 dark:divide-surface-700 overflow-hidden" delay={0}>
            {loading ? (
              <TransactionSkeleton count={5} />
            ) : recentTransactions.length === 0 ? (
              <div className="py-12 text-center text-surface-400">
                <p className="text-lg mb-1">No transactions yet</p>
                <p className="text-sm">Start by adding your first expense</p>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const cat = getCategoryInfo(tx.category);
                const IconComponent = ICON_MAP[cat.icon];
                return (
                  <div
                    key={tx.id}
                    className="transaction-item"
                    onClick={() => navigate('/transactions')}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat.color + '20' }}
                    >
                      {IconComponent && <IconComponent style={{ color: cat.color }} size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                        {tx.recipient || cat.name}
                      </p>
                      <p className="text-xs text-surface-400 truncate">{tx.note || cat.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-surface-900 dark:text-white">
                        -{formatCurrency(tx.amount, currency)}
                      </p>
                      <p className="text-xs text-surface-400">{formatRelativeDate(tx.date)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
