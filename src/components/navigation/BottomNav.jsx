// ============================================
// Mobile Bottom Navigation — Google Pay style
// ============================================
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiSend, FiBarChart2, FiSettings } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: FiHome, label: 'Home' },
  { path: '/payments', icon: FiSend, label: 'Pay' },
  { path: '/scanner', icon: HiOutlineQrcode, label: 'Scan', isFab: true },
  { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav md:hidden">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          item.isFab ? (
            // Center FAB — Scan button (elevated like Google Pay)
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="fab"
              >
                <item.icon size={24} />
              </motion.div>
              <span className="text-[10px] mt-1 font-medium text-surface-500">
                {item.label}
              </span>
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                  isActive ? 'text-primary-600' : 'text-surface-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <item.icon size={22} />
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary-600"
                      />
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary-600' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        ))}
      </nav>
    </div>
  );
}
