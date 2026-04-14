// ============================================
// FINTRACKER — CONSTANTS & DEFAULTS
// ============================================

import {
  FaUtensils, FaPlane, FaShoppingBag, FaFileInvoiceDollar,
  FaFilm, FaHeartbeat, FaGraduationCap, FaHome, FaCar,
  FaGift, FaGamepad, FaCoffee, FaTshirt, FaTools
} from 'react-icons/fa';

// Default spending categories with icons and colors
export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'FaUtensils', color: '#f59e0b' },
  { id: 'travel', name: 'Travel', icon: 'FaPlane', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', icon: 'FaShoppingBag', color: '#ec4899' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'FaFileInvoiceDollar', color: '#ef4444' },
  { id: 'entertainment', name: 'Entertainment', icon: 'FaFilm', color: '#8b5cf6' },
  { id: 'health', name: 'Health', icon: 'FaHeartbeat', color: '#10b981' },
  { id: 'education', name: 'Education', icon: 'FaGraduationCap', color: '#06b6d4' },
  { id: 'rent', name: 'Rent & Housing', icon: 'FaHome', color: '#6366f1' },
  { id: 'transport', name: 'Transport', icon: 'FaCar', color: '#14b8a6' },
  { id: 'gifts', name: 'Gifts', icon: 'FaGift', color: '#f43f5e' },
  { id: 'gaming', name: 'Gaming', icon: 'FaGamepad', color: '#a855f7' },
  { id: 'coffee', name: 'Coffee & Snacks', icon: 'FaCoffee', color: '#78716c' },
];

// Map icon string to component
export const ICON_MAP = {
  FaUtensils, FaPlane, FaShoppingBag, FaFileInvoiceDollar,
  FaFilm, FaHeartbeat, FaGraduationCap, FaHome, FaCar,
  FaGift, FaGamepad, FaCoffee, FaTshirt, FaTools
};

// Available currencies
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Chart colors palette
export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
  '#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#2563eb',
];

// Default budget limits
export const DEFAULT_LIMITS = {
  daily: 2000,
  weekly: 10000,
  monthly: 40000,
};

// Transaction types
export const TRANSACTION_TYPES = {
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
};

// Time filter options
export const TIME_FILTERS = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
];

// Sort options
export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'highest', label: 'Highest Amount' },
  { id: 'lowest', label: 'Lowest Amount' },
];

// Greeting messages
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};
