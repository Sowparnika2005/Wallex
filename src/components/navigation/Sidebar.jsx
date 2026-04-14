// ============================================
// Desktop Sidebar Navigation — Google Pay inspired
// ============================================
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome, FiSend, FiBarChart2, FiList,
  FiTarget, FiSettings, FiLogOut, FiUser
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';

const navItems = [
  { path: '/', icon: FiHome, label: 'Home' },
  { path: '/payments', icon: FiSend, label: 'Payments' },
  { path: '/transactions', icon: FiList, label: 'Transactions' },
  { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/budget', icon: FiTarget, label: 'Budget' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 p-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8 mt-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-surface-900 dark:text-white">FinTracker</h1>
          <p className="text-xs text-surface-400">Smart Finance</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-surface-100 dark:border-surface-800 pt-4 mt-4">
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item mb-1 ${isActive ? 'active' : ''}`}
        >
          <Avatar name={currentUser?.displayName || ''} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-surface-900 dark:text-white">
              {currentUser?.displayName || 'User'}
            </p>
            <p className="text-xs text-surface-400 truncate">
              {currentUser?.email}
            </p>
          </div>
        </NavLink>
        <button onClick={logout} className="nav-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
