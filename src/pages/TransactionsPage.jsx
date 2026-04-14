// ============================================
// Transactions Page — Full list with search, filter, sort
// ============================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiFilter, FiTrash2, FiEdit3,
  FiChevronDown, FiX, FiCalendar
} from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { DEFAULT_CATEGORIES, ICON_MAP, SORT_OPTIONS } from '../utils/constants';
import { formatCurrency, formatRelativeDate, formatFullDate, formatTime } from '../utils/helpers';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { TransactionSkeleton } from '../components/ui/Skeleton';

export default function TransactionsPage() {
  const { transactions, categories, deleteTransaction, updateTransaction, settings, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTx, setSelectedTx] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const currency = settings.currency || 'INR';

  // Filter and sort transactions
  const filteredTx = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        (t.recipient || '').toLowerCase().includes(q) ||
        (t.note || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount);
        break;
      default: // newest
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [transactions, searchQuery, selectedCategory, sortBy]);

  // Group transactions by date
  const groupedTx = useMemo(() => {
    const groups = {};
    filteredTx.forEach(tx => {
      const dateKey = new Date(tx.date).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTx]);

  const getCategoryInfo = (catId) => {
    return categories.find(c => c.id === catId) || DEFAULT_CATEGORIES.find(c => c.id === catId) || { name: catId, icon: 'FaUtensils', color: '#6366f1' };
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setSelectedTx(null);
  };

  const handleEdit = async () => {
    await updateTransaction(selectedTx.id, editData);
    setSelectedTx(null);
    setEditMode(false);
  };

  const formatDateGroup = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{filteredTx.length} transactions found</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2.5"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                <FiX size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 rounded-xl border transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'border-surface-200 dark:border-surface-700 text-surface-600'
            }`}
          >
            <FiFilter size={18} />
          </button>
        </div>

        {/* Filter Bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-2">
                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field py-2 text-sm"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transactions List */}
        {loading ? (
          <TransactionSkeleton count={8} />
        ) : filteredTx.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No transactions found"
            description={searchQuery ? 'Try a different search term' : 'Start tracking your expenses'}
            action={!searchQuery ? 'Add Transaction' : undefined}
            onAction={() => window.location.href = '/payments'}
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTx).map(([dateKey, txList]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <FiCalendar size={14} className="text-surface-400" />
                  <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                    {formatDateGroup(dateKey)}
                  </h4>
                  <hr className="flex-1 border-surface-100 dark:border-surface-800" />
                </div>

                <Card className="divide-y divide-surface-100 dark:divide-surface-700 overflow-hidden" delay={0}>
                  {txList.map((tx) => {
                    const cat = getCategoryInfo(tx.category);
                    const IconComponent = ICON_MAP[cat.icon];
                    return (
                      <motion.div
                        key={tx.id}
                        layout
                        className="transaction-item"
                        onClick={() => { setSelectedTx(tx); setEditData({ amount: tx.amount, note: tx.note, recipient: tx.recipient }); }}
                      >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: cat.color + '20' }}>
                          {IconComponent && <IconComponent style={{ color: cat.color }} size={18} />}
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
                          <p className="text-xs text-surface-400">{formatTime(tx.date)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </Card>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ---- Transaction Detail Modal ---- */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => { setSelectedTx(null); setEditMode(false); }}
        title={editMode ? 'Edit Transaction' : 'Transaction Details'}
      >
        {selectedTx && (() => {
          const cat = getCategoryInfo(selectedTx.category);
          const IconComponent = ICON_MAP[cat.icon];

          return editMode ? (
            // Edit Mode
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Amount</label>
                <input type="number" value={editData.amount} onChange={(e) => setEditData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Recipient</label>
                <input type="text" value={editData.recipient || ''} onChange={(e) => setEditData(prev => ({ ...prev, recipient: e.target.value }))}
                  className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Note</label>
                <input type="text" value={editData.note || ''} onChange={(e) => setEditData(prev => ({ ...prev, note: e.target.value }))}
                  className="input-field" />
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setEditMode(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleEdit} className="flex-1">Save Changes</Button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: cat.color + '20' }}>
                  {IconComponent && <IconComponent style={{ color: cat.color }} size={28} />}
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">{selectedTx.recipient || cat.name}</h3>
                <p className="text-3xl font-bold text-gradient mt-2">
                  -{formatCurrency(selectedTx.amount, currency)}
                </p>
              </div>

              <div className="space-y-3 bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Category</span>
                  <span className="font-medium text-surface-900 dark:text-white">{cat.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Date</span>
                  <span className="font-medium text-surface-900 dark:text-white">{formatFullDate(selectedTx.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-400">Time</span>
                  <span className="font-medium text-surface-900 dark:text-white">{formatTime(selectedTx.date)}</span>
                </div>
                {selectedTx.note && (
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Note</span>
                    <span className="font-medium text-surface-900 dark:text-white">{selectedTx.note}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setEditMode(true)} className="flex-1" icon={<FiEdit3 size={16} />}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(selectedTx.id)} className="flex-1" icon={<FiTrash2 size={16} />}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
