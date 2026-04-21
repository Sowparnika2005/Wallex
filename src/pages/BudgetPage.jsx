// ============================================
// Budget Page — Set and track spending limits
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiTarget, FiTrendingUp, FiAlertTriangle,
  FiSun, FiCalendar, FiDollarSign, FiEdit3, FiCheck
} from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function BudgetPage() {
  const { settings, updateLimits, todaySpent, weekSpent, monthSpent } = useApp();
  const [editing, setEditing] = useState(false);
  const [limits, setLimits] = useState({ ...settings.limits });
  const currency = settings.currency || 'INR';

  const budgetCards = [
    {
      label: 'Daily Budget',
      icon: FiSun,
      spent: todaySpent,
      limit: settings.limits?.daily || 2000,
      editKey: 'daily',
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    },
    {
      label: 'Weekly Budget',
      icon: FiCalendar,
      spent: weekSpent,
      limit: settings.limits?.weekly || 10000,
      editKey: 'weekly',
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    },
    {
      label: 'Monthly Budget',
      icon: FiTarget,
      spent: monthSpent,
      limit: settings.limits?.monthly || 40000,
      editKey: 'monthly',
      color: 'from-primary-500 to-violet-500',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600',
    },
  ];

  const handleSave = () => {
    updateLimits(limits);
    setEditing(false);
  };

  return (
    <div className="page-container max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Budget</h1>
            <p className="page-subtitle">Track your spending limits</p>
          </div>
          <Button
            variant={editing ? 'primary' : 'secondary'}
            onClick={editing ? handleSave : () => { setEditing(true); setLimits({ ...settings.limits }); }}
            className="text-sm"
            icon={editing ? <FiCheck size={18} /> : <FiEdit3 size={18} />}
          >
            {editing ? 'Save' : 'Edit Limits'}
          </Button>
        </motion.div>

        {/* Overview Card */}
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-primary-600 via-violet-600 to-purple-700">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <p className="text-white/70 text-sm mb-1">Monthly Overview</p>
              <h2 className="text-3xl font-bold mb-4">{formatCurrency(monthSpent, currency)}</h2>

              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Budget Used</span>
                  <span className="font-semibold">
                    {((monthSpent / (settings.limits?.monthly || 40000)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((monthSpent / (settings.limits?.monthly || 40000)) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Spent</span>
                  <span>Limit: {formatCurrency(settings.limits?.monthly || 40000, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Cards */}
        {budgetCards.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          const isOver = remaining < 0;

          return (
            <motion.div key={budget.editKey} variants={item}>
              <Card className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${budget.iconBg}`}>
                    <budget.icon size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold text-surface-900 dark:text-white">{budget.label}</h3>
                      {isOver && (
                        <span className="badge-danger">
                          <FiAlertTriangle size={12} /> Exceeded
                        </span>
                      )}
                    </div>

                    {editing ? (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-surface-400">Limit:</span>
                        <input
                          type="number"
                          value={limits[budget.editKey]}
                          onChange={(e) => setLimits(prev => ({ ...prev, [budget.editKey]: Number(e.target.value) }))}
                          className="input-field py-2 text-sm max-w-[120px]"
                          min="0"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-xl font-bold text-surface-900 dark:text-white">
                            {formatCurrency(budget.spent, currency)}
                          </span>
                          <span className="text-sm text-surface-400">
                            / {formatCurrency(budget.limit, currency)}
                          </span>
                        </div>

                        <ProgressBar value={budget.spent} max={budget.limit} size="md" />

                        <p className={`text-xs mt-2 ${isOver ? 'text-red-500' : 'text-surface-400'}`}>
                          {isOver
                            ? `Over by ${formatCurrency(Math.abs(remaining), currency)}`
                            : `${formatCurrency(remaining, currency)} remaining`
                          }
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Tips */}
        <motion.div variants={item}>
          <Card className="p-5 bg-gradient-to-r from-primary-50 to-violet-50 dark:from-primary-900/10 dark:to-violet-900/10 border-primary-100 dark:border-primary-900/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <FiTrendingUp size={20} className="text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">Budget Tip</h4>
                <p className="text-xs text-surface-500">
                  Try the 50/30/20 rule — allocate 50% for needs, 30% for wants, and 20% for savings. 
                  Set your monthly budget accordingly for better financial health.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
