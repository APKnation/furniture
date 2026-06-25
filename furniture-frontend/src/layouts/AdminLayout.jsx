import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Menu } from 'lucide-react';

export default function AdminLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative bg-canvas">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-50 w-64 bg-canvas h-full flex-col shadow-2xl animate-slide-in">
            <AdminSidebar onMobileClose={() => setMobileMenuOpen(false)} isMobile={true} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-16 bg-canvas border-b border-hairline flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-body hover:text-ink transition-colors" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-[0.065em] hidden sm:flex">
              <LayoutDashboard size={13} />
              <span>Administration</span>
            </div>
          </div>
          <div className="text-xs text-muted">
            <span className="hidden sm:inline">Logged in as </span>
            <span className="text-ink font-medium">{user?.name}</span>
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
