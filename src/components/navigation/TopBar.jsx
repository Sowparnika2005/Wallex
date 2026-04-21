// ============================================
// Top Bar — Search, notifications, user avatar
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../ui/Avatar';
import { getGreeting } from '../../utils/constants';

export default function TopBar() {
  const { currentUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const firstName = currentUser?.displayName?.split(' ')[0] || 'there';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left — Greeting (mobile) or search (desktop) */}
        <div className="flex-1">
          <div className="md:hidden">
            <p className="text-xs text-surface-400 font-medium">{getGreeting()} 👋</p>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">
              {firstName}
            </h2>
          </div>

          {/* Desktop search */}
          <div className="hidden md:block max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                className="input-field pl-10 py-2.5 text-sm"
                onFocus={() => navigate('/transactions')}
              />
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => navigate('/transactions')}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <FiSearch size={20} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar — desktop only */}
          <button
            onClick={() => navigate('/profile')}
            className="hidden md:block ml-1"
          >
            <Avatar name={currentUser?.displayName || ''} size="sm" />
          </button>
        </div>
      </div>
    </header>
  );
}
