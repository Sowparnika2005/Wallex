// ============================================
// WALLEX — APP CONTEXT
// ============================================
// Central state management for transactions, categories,
// budgets, and settings. Uses Firestore when available,
// falls back to localStorage with sample data for demo mode.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, setDoc, getDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase.js';
import { useAuth } from './AuthContext';
import { DEFAULT_CATEGORIES, DEFAULT_LIMITS } from '../utils/constants';
import { SAMPLE_TRANSACTIONS, SAMPLE_SETTINGS } from '../utils/sampleData';
import { generateId, filterByPeriod, getCategoryTotals } from '../utils/helpers';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export function AppProvider({ children }) {
  const { currentUser, isDemo } = useAuth();

  // Core state
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState({
    currency: 'INR',
    notifications: true,
    limits: { ...DEFAULT_LIMITS },
  });
  const [loading, setLoading] = useState(true);

  // ---- DATA LOADING ----
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    if (isDemo || !isFirebaseConfigured()) {
      // Load from localStorage / sample data
      const savedTx = localStorage.getItem('wallex-transactions');
      const savedCat = localStorage.getItem('wallex-categories');
      const savedSettings = localStorage.getItem('wallex-settings');

      setTransactions(savedTx ? JSON.parse(savedTx) : SAMPLE_TRANSACTIONS);
      setCategories(savedCat ? JSON.parse(savedCat) : DEFAULT_CATEGORIES);
      setSettings(savedSettings ? JSON.parse(savedSettings) : SAMPLE_SETTINGS);
      setLoading(false);
      return;
    }

    // Firestore real-time listeners
    const userId = currentUser.uid;

    // Transactions listener
    const txQuery = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('date', 'desc')
    );
    const unsubTx = onSnapshot(txQuery, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txData);
    });

    // Load categories
    const loadCategories = async () => {
      const catDoc = await getDoc(doc(db, 'users', userId, 'settings', 'categories'));
      if (catDoc.exists()) {
        setCategories(catDoc.data().list || DEFAULT_CATEGORIES);
      }
    };

    // Load settings
    const loadSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));
      if (settingsDoc.exists()) {
        setSettings(prev => ({ ...prev, ...settingsDoc.data() }));
      }
    };

    loadCategories();
    loadSettings();
    setLoading(false);

    return () => unsubTx();
  }, [currentUser, isDemo]);

  // ---- PERSIST TO LOCALSTORAGE (demo mode) ----
  useEffect(() => {
    if (isDemo || !isFirebaseConfigured()) {
      localStorage.setItem('wallex-transactions', JSON.stringify(transactions));
    }
  }, [transactions, isDemo]);

  useEffect(() => {
    if (isDemo || !isFirebaseConfigured()) {
      localStorage.setItem('wallex-categories', JSON.stringify(categories));
    }
  }, [categories, isDemo]);

  useEffect(() => {
    if (isDemo || !isFirebaseConfigured()) {
      localStorage.setItem('wallex-settings', JSON.stringify(settings));
    }
  }, [settings, isDemo]);

  // ---- TRANSACTION OPERATIONS ----
  const addTransaction = useCallback(async (txData) => {
    const newTx = {
      ...txData,
      id: generateId(),
      date: txData.date || new Date().toISOString(),
      type: txData.type || 'expense',
    };

    if (!isDemo && isFirebaseConfigured() && currentUser) {
      try {
        await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), newTx);
      } catch (err) {
        console.error('Error adding transaction:', err);
        toast.error('Failed to save transaction');
        return;
      }
    } else {
      setTransactions(prev => [newTx, ...prev]);
    }

    // Check budget limits
    checkBudgetLimits(newTx);
    toast.success('Transaction added!');
    return newTx;
  }, [currentUser, isDemo, settings, transactions]);

  const updateTransaction = useCallback(async (id, updates) => {
    if (!isDemo && isFirebaseConfigured() && currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid, 'transactions', id), updates);
      } catch (err) {
        toast.error('Failed to update transaction');
        return;
      }
    } else {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
    toast.success('Transaction updated!');
  }, [currentUser, isDemo]);

  const deleteTransaction = useCallback(async (id) => {
    if (!isDemo && isFirebaseConfigured() && currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'transactions', id));
      } catch (err) {
        toast.error('Failed to delete transaction');
        return;
      }
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
    toast.success('Transaction deleted');
  }, [currentUser, isDemo]);

  // ---- CATEGORY OPERATIONS ----
  const addCategory = useCallback(async (category) => {
    const newCat = { ...category, id: category.id || generateId() };
    const updated = [...categories, newCat];
    setCategories(updated);

    if (!isDemo && isFirebaseConfigured() && currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'categories'), { list: updated });
    }
    toast.success('Category added!');
  }, [categories, currentUser, isDemo]);

  const updateCategory = useCallback(async (id, updates) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    setCategories(updated);

    if (!isDemo && isFirebaseConfigured() && currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'categories'), { list: updated });
    }
    toast.success('Category updated!');
  }, [categories, currentUser, isDemo]);

  const deleteCategory = useCallback(async (id) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);

    if (!isDemo && isFirebaseConfigured() && currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'categories'), { list: updated });
    }
    toast.success('Category deleted');
  }, [categories, currentUser, isDemo]);

  // ---- SETTINGS OPERATIONS ----
  const updateSettings = useCallback(async (updates) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);

    if (!isDemo && isFirebaseConfigured() && currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'preferences'), updated);
    }
    toast.success('Settings saved!');
  }, [settings, currentUser, isDemo]);

  const updateLimits = useCallback(async (limits) => {
    const updated = { ...settings, limits: { ...settings.limits, ...limits } };
    setSettings(updated);

    if (!isDemo && isFirebaseConfigured() && currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid, 'settings', 'preferences'), updated);
    }
    toast.success('Limits updated!');
  }, [settings, currentUser, isDemo]);

  // ---- BUDGET LIMIT CHECKS ----
  const checkBudgetLimits = useCallback((newTx) => {
    if (!settings.notifications) return;

    const allTx = [newTx, ...transactions];
    const todayTx = filterByPeriod(allTx, 'today');
    const weekTx = filterByPeriod(allTx, 'week');
    const monthTx = filterByPeriod(allTx, 'month');

    const dailySpent = todayTx.reduce((sum, t) => sum + t.amount, 0);
    const weeklySpent = weekTx.reduce((sum, t) => sum + t.amount, 0);
    const monthlySpent = monthTx.reduce((sum, t) => sum + t.amount, 0);

    if (dailySpent > settings.limits.daily) {
      toast.error(`⚠️ Daily limit exceeded! ₹${dailySpent} / ₹${settings.limits.daily}`, { duration: 5000 });
    } else if (dailySpent > settings.limits.daily * 0.8) {
      toast('⚡ Approaching daily limit!', { icon: '⚠️', duration: 4000 });
    }

    if (weeklySpent > settings.limits.weekly) {
      toast.error(`⚠️ Weekly limit exceeded!`, { duration: 5000 });
    }

    if (monthlySpent > settings.limits.monthly) {
      toast.error(`⚠️ Monthly limit exceeded!`, { duration: 5000 });
    }
  }, [transactions, settings]);

  // ---- COMPUTED VALUES ----
  const todaySpent = filterByPeriod(transactions, 'today').reduce((sum, t) => sum + t.amount, 0);
  const weekSpent = filterByPeriod(transactions, 'week').reduce((sum, t) => sum + t.amount, 0);
  const monthSpent = filterByPeriod(transactions, 'month').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = 50000 - monthSpent; // Simulated balance

  const value = {
    // State
    transactions,
    categories,
    settings,
    loading,

    // Operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    updateLimits,

    // Computed
    todaySpent,
    weekSpent,
    monthSpent,
    totalBalance,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
