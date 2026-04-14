// ============================================
// Login Page — Premium auth form
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    login('demo@fintracker.app', 'demo123');
    toast.success('Welcome to FinTracker!');
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
      <p className="text-surface-400 mb-6">Sign in to manage your finances</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-300">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-300">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign In <FiArrowRight />
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <hr className="flex-1 border-white/10" />
        <span className="text-surface-500 text-sm">or</span>
        <hr className="flex-1 border-white/10" />
      </div>

      <button
        onClick={handleDemoLogin}
        className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
      >
        🚀 Try Demo Mode
      </button>

      <p className="text-center text-surface-400 text-sm mt-6">
        Don't have an account?{' '}
        <Link to="/auth/signup" className="text-primary-400 hover:text-primary-300 font-medium">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
