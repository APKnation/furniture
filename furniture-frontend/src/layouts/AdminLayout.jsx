import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col bg-dark-900">
        {/* Top bar */}
        <div className="h-14 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <LayoutDashboard size={15} />
            <span>Administration</span>
          </div>
          <div className="text-sm text-gray-400">
            Logged in as <span className="text-primary-400 font-medium">{user?.name}</span>
          </div>
        </div>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
