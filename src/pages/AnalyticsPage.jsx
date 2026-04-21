// ============================================
// Analytics Page — Charts, trends, and spending breakdown
// ============================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { CHART_COLORS, DEFAULT_CATEGORIES, ICON_MAP, TIME_FILTERS } from '../utils/constants';
import { formatCurrency, filterByPeriod, getCategoryTotals } from '../utils/helpers';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AnalyticsPage() {
  const { transactions, categories, settings } = useApp();
  const [timeFilter, setTimeFilter] = useState('month');
  const currency = settings.currency || 'INR';

  // Filter transactions by selected period
  const filteredTx = useMemo(
    () => filterByPeriod(transactions, timeFilter),
    [transactions, timeFilter]
  );

  // Category totals
  const categoryTotals = useMemo(() => getCategoryTotals(filteredTx), [filteredTx]);

  // Pie chart data
  const pieData = useMemo(() => {
    return Object.entries(categoryTotals)
      .map(([catId, data]) => {
        const cat = categories.find(c => c.id === catId) || DEFAULT_CATEGORIES.find(c => c.id === catId) || { name: catId };
        return { name: cat.name, value: data.amount, count: data.count, id: catId, color: cat.color };
      })
      .sort((a, b) => b.value - a.value);
  }, [categoryTotals, categories]);

  // Stats
  const totalSpent = filteredTx.reduce((sum, t) => sum + t.amount, 0);
  const avgPerDay = totalSpent / (timeFilter === 'week' ? 7 : timeFilter === 'month' ? 30 : 365);
  const highestCategory = pieData[0];
  const txCount = filteredTx.length;

  // Daily spending for bar chart (last 7 days)
  const dailyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      const dayTotal = transactions
        .filter(t => new Date(t.date).toDateString() === dayStr)
        .reduce((sum, t) => sum + t.amount, 0);
      days.push({
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        amount: dayTotal,
      });
    }
    return days;
  }, [transactions]);

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-3 border border-surface-100 dark:border-surface-700">
          <p className="font-semibold text-sm text-surface-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-primary-600">{formatCurrency(data.value, currency)}</p>
          <p className="text-xs text-surface-400">{((data.value / totalSpent) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="page-container">
        <EmptyState
          icon="📊"
          title="No analytics yet"
          description="Add some transactions to see your spending insights"
          action="Add Transaction"
          onAction={() => window.location.href = '/payments'}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Your spending insights</p>
          </div>
        </motion.div>

        {/* Time Filter */}
        <motion.div variants={item}>
          <div className="flex gap-2 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
            {TIME_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === filter.id
                    ? 'bg-white dark:bg-surface-700 text-primary-600 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={item}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Spent', value: formatCurrency(totalSpent, currency), icon: FiDollarSign, color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30' },
              { label: 'Transactions', value: txCount, icon: FiCalendar, color: 'text-accent-600 bg-accent-100 dark:bg-accent-900/30' },
              { label: 'Avg / Day', value: formatCurrency(Math.round(avgPerDay), currency), icon: FiTrendingUp, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
              { label: 'Top Category', value: highestCategory?.name || '—', icon: FiTrendingDown, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
            ].map((stat) => (
              <Card key={stat.label} className="p-4" delay={0}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <p className="text-xs text-surface-400 mb-0.5">{stat.label}</p>
                <p className="text-base font-bold text-surface-900 dark:text-white truncate">{stat.value}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <motion.div variants={item}>
            <Card className="p-6" delay={0}>
              <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
                Spending by Category
              </h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={entry.id}
                          fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-surface-400">
                  No data for this period
                </div>
              )}
            </Card>
          </motion.div>

          {/* Bar Chart — Daily Spending */}
          <motion.div variants={item}>
            <Card className="p-6" delay={0}>
              <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
                Last 7 Days
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, currency), 'Spent']}
                    contentStyle={{
                      borderRadius: '12px', border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '13px'
                    }}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Category Breakdown List */}
        <motion.div variants={item}>
          <Card className="p-6" delay={0}>
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
              Category Breakdown
            </h3>
            <div className="space-y-3">
              {pieData.map((cat, index) => {
                const catInfo = categories.find(c => c.id === cat.id) || DEFAULT_CATEGORIES.find(c => c.id === cat.id);
                const IconComponent = catInfo ? ICON_MAP[catInfo.icon] : null;
                const percentage = ((cat.value / totalSpent) * 100).toFixed(1);

                return (
                  <div key={cat.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: (cat.color || CHART_COLORS[index]) + '20' }}
                    >
                      {IconComponent && <IconComponent style={{ color: cat.color || CHART_COLORS[index] }} size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-900 dark:text-white">{cat.name}</span>
                        <span className="text-sm font-bold text-surface-900 dark:text-white">{formatCurrency(cat.value, currency)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color || CHART_COLORS[index] }}
                          />
                        </div>
                        <span className="text-xs text-surface-400 w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
