// ============================================
// Settings Page — Categories, limits, theme, currency, profile
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiGrid, FiTarget, FiMoon, FiSun, FiDollarSign,
  FiBell, FiUser, FiPlus, FiTrash2, FiEdit3,
  FiChevronRight, FiLogOut, FiInfo, FiCheck
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { CURRENCIES, ICON_MAP } from '../utils/constants';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function SettingsPage() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { categories, addCategory, deleteCategory, settings, updateSettings } = useApp();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366f1', icon: 'FaUtensils' });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    addCategory({
      name: newCategory.name,
      color: newCategory.color,
      icon: newCategory.icon,
    });
    setNewCategory({ name: '', color: '#6366f1', icon: 'FaUtensils' });
    setShowCategoryModal(false);
  };

  const handleCurrencyChange = (code) => {
    updateSettings({ currency: code });
  };

  const handleNotificationToggle = () => {
    updateSettings({ notifications: !settings.notifications });
  };

  const SettingsRow = ({ icon: Icon, label, value, onClick, danger = false, toggle = false, toggleValue = false }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-4 transition-colors ${
        danger ? 'hover:bg-red-50 dark:hover:bg-red-900/10' : 'hover:bg-surface-50 dark:hover:bg-surface-800'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        danger ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
      }`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-surface-900 dark:text-white'}`}>
          {label}
        </p>
        {value && <p className="text-xs text-surface-400">{value}</p>}
      </div>
      {toggle ? (
        <div className={`w-11 h-6 rounded-full relative transition-colors ${
          toggleValue ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
        }`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            toggleValue ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`} />
        </div>
      ) : (
        <FiChevronRight size={18} className="text-surface-400" />
      )}
    </button>
  );

  const availableColors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];
  const availableIcons = ['FaUtensils', 'FaPlane', 'FaShoppingBag', 'FaFileInvoiceDollar', 'FaFilm', 'FaHeartbeat', 'FaGraduationCap', 'FaHome', 'FaCar', 'FaGift', 'FaGamepad', 'FaCoffee', 'FaTshirt', 'FaTools'];

  return (
    <div className="page-container max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        <motion.div variants={item}>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your preferences</p>
        </motion.div>

        {/* ---- Profile Section ---- */}
        <motion.div variants={item}>
          <Card className="overflow-hidden" delay={0}>
            <div className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-surface-900 dark:text-white">{currentUser?.displayName || 'User'}</p>
                <p className="text-sm text-surface-400">{currentUser?.email}</p>
              </div>
              <FiChevronRight size={20} className="text-surface-400" />
            </div>
          </Card>
        </motion.div>

        {/* ---- Appearance ---- */}
        <motion.div variants={item}>
          <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 px-1">Appearance</h3>
          <Card className="overflow-hidden divide-y divide-surface-100 dark:divide-surface-700" delay={0}>
            <SettingsRow
              icon={darkMode ? FiMoon : FiSun}
              label="Dark Mode"
              value={darkMode ? 'On' : 'Off'}
              onClick={toggleDarkMode}
              toggle
              toggleValue={darkMode}
            />
            <SettingsRow
              icon={FiDollarSign}
              label="Currency"
              value={CURRENCIES.find(c => c.code === settings.currency)?.name || 'Indian Rupee'}
              onClick={() => {
                const codes = CURRENCIES.map(c => c.code);
                const currentIdx = codes.indexOf(settings.currency || 'INR');
                const nextIdx = (currentIdx + 1) % codes.length;
                handleCurrencyChange(codes[nextIdx]);
              }}
            />
          </Card>
        </motion.div>

        {/* ---- Categories ---- */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Categories</h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="text-primary-600 text-xs font-medium flex items-center gap-1 hover:text-primary-700"
            >
              <FiPlus size={14} /> Add New
            </button>
          </div>
          <Card className="overflow-hidden" delay={0}>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const IconComponent = ICON_MAP[cat.icon];
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-700/50 group relative"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat.color + '20' }}>
                      {IconComponent && <IconComponent style={{ color: cat.color }} size={14} />}
                    </div>
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate flex-1">
                      {cat.name}
                    </span>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ---- Notifications ---- */}
        <motion.div variants={item}>
          <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 px-1">Notifications</h3>
          <Card className="overflow-hidden" delay={0}>
            <SettingsRow
              icon={FiBell}
              label="Budget Alerts"
              value="Get notified when approaching limits"
              onClick={handleNotificationToggle}
              toggle
              toggleValue={settings.notifications}
            />
          </Card>
        </motion.div>

        {/* ---- Account ---- */}
        <motion.div variants={item}>
          <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 px-1">Account</h3>
          <Card className="overflow-hidden divide-y divide-surface-100 dark:divide-surface-700" delay={0}>
            <SettingsRow icon={FiInfo} label="About Wallex" value="Version 1.0.0" onClick={() => toast('Wallex v1.0.0 — Built with ❤️')} />
            <SettingsRow icon={FiLogOut} label="Logout" onClick={logout} danger />
          </Card>
        </motion.div>

      </motion.div>

      {/* ---- Add Category Modal ---- */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Add Category"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Groceries"
              className="input-field"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Color</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    newCategory.color === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Icon</label>
            <div className="flex flex-wrap gap-2">
              {availableIcons.map(iconName => {
                const IconComp = ICON_MAP[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() => setNewCategory(prev => ({ ...prev, icon: iconName }))}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      newCategory.icon === iconName
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 ring-2 ring-primary-500'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-500'
                    }`}
                  >
                    {IconComp && <IconComp size={18} />}
                  </button>
                );
              })}
            </div>
          </div>

          <Button onClick={handleAddCategory} className="w-full">
            <FiCheck size={18} /> Add Category
          </Button>
        </div>
      </Modal>
    </div>
  );
}
