// ============================================
// WALLEX — HELPER UTILITIES
// ============================================

import { CURRENCIES } from './constants';

/**
 * Format a number as currency
 */
export const formatCurrency = (amount, currencyCode = 'INR') => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  
  if (currencyCode === 'INR') {
    // Indian numbering system (lakhs, crores)
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a short currency string (e.g., for chart labels)
 */
export const formatShortCurrency = (amount, currencyCode = 'INR') => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  
  if (amount >= 10000000) return `${currency.symbol}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${currency.symbol}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${currency.symbol}${(amount / 1000).toFixed(1)}K`;
  return `${currency.symbol}${amount}`;
};

/**
 * Format date relative to now
 */
export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format full date
 */
export const formatFullDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format time
 */
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get start/end of period
 */
export const getPeriodRange = (period) => {
  const now = new Date();
  let start;

  switch (period) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end: now };
};

/**
 * Filter transactions by period
 */
export const filterByPeriod = (transactions, period) => {
  const { start, end } = getPeriodRange(period);
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= start && date <= end;
  });
};

/**
 * Calculate category totals from transactions
 */
export const getCategoryTotals = (transactions) => {
  const totals = {};
  transactions.forEach(t => {
    if (!totals[t.category]) {
      totals[t.category] = { amount: 0, count: 0 };
    }
    totals[t.category].amount += t.amount;
    totals[t.category].count += 1;
  });
  return totals;
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Get color for budget progress
 */
export const getBudgetColor = (percentage) => {
  if (percentage >= 100) return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
  if (percentage >= 80) return { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-100' };
  if (percentage >= 60) return { bg: 'bg-yellow-400', text: 'text-yellow-600', light: 'bg-yellow-100' };
  return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100' };
};

/**
 * Truncate text
 */
export const truncate = (str, length = 20) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
