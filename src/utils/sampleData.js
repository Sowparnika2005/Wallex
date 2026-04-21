// ============================================
// WALLEX — REALISTIC SAMPLE DATA
// ============================================
// This data is used when Firebase is not configured (demo mode).
// It provides a realistic feel so the app looks functional immediately.

import { generateId } from './helpers';

const now = new Date();
const daysAgo = (days, hours = 12) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
};

export const SAMPLE_TRANSACTIONS = [
  // Today
  { id: generateId(), amount: 450, category: 'food', recipient: 'Swiggy', note: 'Lunch order - biryani combo', type: 'expense', date: daysAgo(0, 13) },
  { id: generateId(), amount: 120, category: 'coffee', recipient: 'Third Wave Coffee', note: 'Cappuccino & croissant', type: 'expense', date: daysAgo(0, 10) },
  { id: generateId(), amount: 35, category: 'transport', recipient: 'Rapido', note: 'Auto to office', type: 'expense', date: daysAgo(0, 9) },

  // Yesterday
  { id: generateId(), amount: 2499, category: 'shopping', recipient: 'Amazon', note: 'Wireless earbuds', type: 'expense', date: daysAgo(1, 19) },
  { id: generateId(), amount: 899, category: 'bills', recipient: 'Jio Fiber', note: 'Monthly internet bill', type: 'expense', date: daysAgo(1, 11) },
  { id: generateId(), amount: 180, category: 'food', recipient: 'Zomato', note: 'Pizza dinner', type: 'expense', date: daysAgo(1, 20) },

  // 2 days ago
  { id: generateId(), amount: 549, category: 'entertainment', recipient: 'BookMyShow', note: 'Movie tickets - 2 seats', type: 'expense', date: daysAgo(2, 18) },
  { id: generateId(), amount: 200, category: 'food', recipient: 'Chai Point', note: 'Snacks with friends', type: 'expense', date: daysAgo(2, 16) },

  // 3 days ago
  { id: generateId(), amount: 1500, category: 'health', recipient: 'Practo', note: 'Doctor consultation', type: 'expense', date: daysAgo(3, 10) },
  { id: generateId(), amount: 750, category: 'food', recipient: 'BBQ Nation', note: 'Team lunch', type: 'expense', date: daysAgo(3, 13) },

  // 4 days ago
  { id: generateId(), amount: 4999, category: 'shopping', recipient: 'Myntra', note: 'Running shoes - Nike', type: 'expense', date: daysAgo(4, 22) },
  { id: generateId(), amount: 100, category: 'transport', recipient: 'Uber', note: 'Cab to mall', type: 'expense', date: daysAgo(4, 15) },

  // 5 days ago
  { id: generateId(), amount: 3200, category: 'travel', recipient: 'IRCTC', note: 'Train tickets - Bangalore to Chennai', type: 'expense', date: daysAgo(5, 8) },
  { id: generateId(), amount: 320, category: 'food', recipient: 'Dominos', note: 'Weekend pizza party', type: 'expense', date: daysAgo(5, 19) },

  // Last week
  { id: generateId(), amount: 15000, category: 'rent', recipient: 'Landlord', note: 'Monthly house rent', type: 'expense', date: daysAgo(7, 10) },
  { id: generateId(), amount: 499, category: 'entertainment', recipient: 'Netflix', note: 'Monthly subscription', type: 'expense', date: daysAgo(7, 12) },
  { id: generateId(), amount: 2100, category: 'bills', recipient: 'BESCOM', note: 'Electricity bill', type: 'expense', date: daysAgo(8, 14) },
  { id: generateId(), amount: 850, category: 'education', recipient: 'Udemy', note: 'React course', type: 'expense', date: daysAgo(9, 11) },
  { id: generateId(), amount: 1200, category: 'gifts', recipient: 'Archies', note: 'Birthday gift for Priya', type: 'expense', date: daysAgo(10, 17) },
  { id: generateId(), amount: 599, category: 'gaming', recipient: 'Steam', note: 'Indie game bundle', type: 'expense', date: daysAgo(10, 21) },

  // 2 weeks ago
  { id: generateId(), amount: 3500, category: 'health', recipient: 'Apollo Pharmacy', note: 'Monthly medicines', type: 'expense', date: daysAgo(14, 10) },
  { id: generateId(), amount: 1800, category: 'shopping', recipient: 'Decathlon', note: 'Gym accessories', type: 'expense', date: daysAgo(15, 16) },
  { id: generateId(), amount: 450, category: 'food', recipient: 'Haldirams', note: 'Snacks & sweets', type: 'expense', date: daysAgo(16, 12) },
  { id: generateId(), amount: 2700, category: 'travel', recipient: 'MakeMyTrip', note: 'Weekend hotel - Coorg', type: 'expense', date: daysAgo(17, 9) },

  // 3 weeks ago
  { id: generateId(), amount: 6999, category: 'shopping', recipient: 'Flipkart', note: 'Smartwatch', type: 'expense', date: daysAgo(21, 20) },
  { id: generateId(), amount: 380, category: 'food', recipient: 'KFC', note: 'Family bucket', type: 'expense', date: daysAgo(22, 19) },
  { id: generateId(), amount: 1100, category: 'bills', recipient: 'Airtel', note: 'Mobile recharge - 3 months', type: 'expense', date: daysAgo(23, 11) },

  // Last month
  { id: generateId(), amount: 15000, category: 'rent', recipient: 'Landlord', note: 'Monthly house rent', type: 'expense', date: daysAgo(37, 10) },
  { id: generateId(), amount: 8500, category: 'travel', recipient: 'IndiGo', note: 'Flight to Delhi', type: 'expense', date: daysAgo(35, 7) },
  { id: generateId(), amount: 1650, category: 'food', recipient: 'BigBasket', note: 'Monthly groceries', type: 'expense', date: daysAgo(33, 18) },
  { id: generateId(), amount: 999, category: 'entertainment', recipient: 'Spotify', note: 'Annual plan', type: 'expense', date: daysAgo(40, 15) },
  { id: generateId(), amount: 3200, category: 'education', recipient: 'Coursera', note: 'ML specialization', type: 'expense', date: daysAgo(42, 11) },
];

// Sample user profile
export const SAMPLE_USER = {
  uid: 'demo-user-001',
  displayName: 'Sowparnika',
  email: 'sowparnika@example.com',
  photoURL: null,
};

// Sample settings
export const SAMPLE_SETTINGS = {
  currency: 'INR',
  darkMode: false,
  notifications: true,
  limits: {
    daily: 2000,
    weekly: 10000,
    monthly: 40000,
  },
};
