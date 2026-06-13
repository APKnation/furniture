import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-50 w-64 bg-dark-800 h-full flex-col shadow-2xl animate-slide-right">
            <AdminSidebar onMobileClose={() => setMobileMenuOpen(false)} isMobile={true} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-dark-900">
        {/* Top bar */}
        <div className="h-14 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400 hidden sm:flex">
              <LayoutDashboard size={15} />
              <span>Administration</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <span className="hidden sm:inline">Logged in as </span><span className="text-primary-400 font-medium">{user?.name}</span>
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
