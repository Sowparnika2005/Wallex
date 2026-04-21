// ============================================
// Main App Layout — Sidebar (desktop) + Bottom Nav (mobile)
// ============================================
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import BottomNav from '../components/navigation/BottomNav';
import TopBar from '../components/navigation/TopBar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-safe md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
