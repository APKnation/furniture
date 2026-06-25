import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Sofa, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { confirmAction, showSuccess } from '../utils/swal';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    if (await confirmAction('Logout', 'Are you sure you want to log out?', 'Yes, logout', true)) {
      navigate('/');
      setTimeout(() => {
        logout();
        showSuccess('Logged Out', 'You have been successfully logged out.');
      }, 0);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 bg-canvas border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <Sofa size={16} className="text-on-primary" />
            </div>
            <span className="font-medium text-base text-ink tracking-tight">APKnation Furniture</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`text-xs font-semibold uppercase tracking-[0.065em] transition-colors duration-150 ${
                  isActive(to) ? 'text-ink' : 'text-body hover:text-ink'
                }`}>{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 text-body hover:text-ink transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn-outline btn-sm">
                    <LayoutDashboard size={14} /> Admin
                  </Link>
                )}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-body hover:text-ink transition-colors">
                    <div className="w-7 h-7 bg-canvas-elevated border border-hairline flex items-center justify-center">
                      <User size={13} className="text-ink" />
                    </div>
                    <span className="text-xs font-medium">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-canvas-elevated border border-hairline animate-fade-in z-50">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-xs text-body hover:text-ink hover:bg-canvas transition-colors"><User size={13}/> My Profile</Link>
                      {!isAdmin && <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-xs text-body hover:text-ink hover:bg-canvas transition-colors"><ShoppingCart size={13}/> My Orders</Link>}
                      <div className="border-t border-hairline" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-xs text-semantic-warning hover:bg-canvas transition-colors w-full"><LogOut size={13}/> Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-body hover:text-ink transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas-elevated px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.065em] transition-colors ${isActive(to) ? 'text-ink' : 'text-body'}`}>{label}</Link>
          ))}
          <div className="border-t border-hairline pt-2 mt-2">
            {!isAdmin && (
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-body">
                <ShoppingCart size={14}/> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-body"><User size={14}/> Profile</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-body"><LayoutDashboard size={14}/> Admin Panel</Link>}
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-xs text-semantic-warning w-full"><LogOut size={14}/> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-xs text-body">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-xs text-primary font-semibold uppercase tracking-[0.065em]">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
