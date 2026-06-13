import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderTree, Package, ShoppingBag, Users, BarChart2, LogOut, Sofa, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { confirmAction, showSuccess } from '../utils/swal';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart2 },
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
    <aside className={`w-64 bg-dark-800 flex flex-col ${isMobile ? 'h-full' : 'min-h-screen border-r border-dark-600'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-dark-600 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
            <Sofa size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-tight">APKnation</p>
            <p className="text-xs text-primary-400 font-medium">Admin Panel</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onMobileClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => isMobile && onMobileClose && onMobileClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-primary-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-600">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200">
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
