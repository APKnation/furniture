import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderTree, Package, ShoppingBag, Users, BarChart2, TrendingUp, LogOut, Sofa, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { confirmAction, showSuccess } from '../utils/swal';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Sales & Charts', icon: BarChart2 },
  { to: '/admin/trends', label: 'Trends', icon: TrendingUp },
];

export default function AdminSidebar({ onMobileClose, isMobile }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (await confirmAction('Logout', 'Are you sure you want to log out?', 'Yes, logout', true)) {
      navigate('/');
      setTimeout(() => {
        logout();
        showSuccess('Logged Out', 'You have been successfully logged out.');
      }, 0);
    }
  };

  return (
    <aside className={`w-64 bg-canvas flex flex-col ${isMobile ? 'h-full' : 'min-h-screen border-r border-hairline'}`}>
      {/* Logo */}
      <div className="h-16 px-6 border-b border-hairline flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <Sofa size={14} className="text-on-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-ink leading-tight">APKnation</p>
            <p className="text-[10px] text-muted uppercase tracking-[0.08em]">Admin Panel</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onMobileClose} className="text-muted hover:text-ink transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => isMobile && onMobileClose && onMobileClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-xs font-semibold uppercase tracking-[0.065em] transition-colors duration-150 border-l-2 ${
                isActive
                  ? 'text-ink bg-canvas-elevated border-l-primary'
                  : 'text-body hover:text-ink hover:bg-canvas-elevated border-l-transparent'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? 'text-primary' : 'text-muted'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-hairline">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.065em] text-body hover:text-semantic-warning hover:bg-canvas-elevated transition-colors duration-150">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
