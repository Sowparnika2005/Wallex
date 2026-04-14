// ============================================
// Auth Layout — Premium gradient background
// ============================================
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLayout() {
  const { currentUser } = useAuth();

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl translate-y-1/3" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-white">FinTracker</h1>
          <p className="text-surface-400 mt-1">Smart Finance Manager</p>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
