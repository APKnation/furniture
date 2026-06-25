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
    <nav className="sticky top-0 z-50 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
         <Link to="/" className="flex items-center gap-3 group">
  <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
    🇹🇿
  </div>

  <span className="font-bold text-lg md:text-xl text-ink tracking-tight">
    APKnation Furniture
  </span>
</Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`text-sm transition-colors duration-150 ${
                  isActive(to) ? 'text-ink font-bold' : 'text-body font-normal hover:text-ink'
                }`}>{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 text-body hover:text-ink transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                    <div className="w-8 h-8 bg-surface-elevated rounded-full flex items-center justify-center">
                      <User size={16} className="text-ink" />
                    </div>
                    <span className="text-sm font-bold">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface shadow-spotify-heavy rounded-md animate-fade-in z-50 overflow-hidden">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-normal text-ink hover:bg-surface-elevated transition-colors"><User size={16}/> My Profile</Link>
                      {!isAdmin && <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-normal text-ink hover:bg-surface-elevated transition-colors"><ShoppingCart size={16}/> My Orders</Link>}
                      <div className="border-t border-hairline-soft" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3 text-sm font-normal text-sale hover:bg-surface-elevated transition-colors w-full"><LogOut size={16}/> Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary border-none">Login</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-body hover:text-ink transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-hairline-soft bg-canvas px-4 py-3 space-y-1 animate-slide-up shadow-spotify-heavy">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 text-sm transition-colors ${isActive(to) ? 'text-ink font-bold' : 'text-body font-normal'}`}>{label}</Link>
          ))}
          <div className="border-t border-hairline-soft pt-2 mt-2">
            {!isAdmin && (
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-body hover:text-ink">
                <ShoppingCart size={16}/> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-body hover:text-ink"><User size={16}/> Profile</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-body hover:text-ink"><LayoutDashboard size={16}/> Admin Panel</Link>}
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-sale w-full hover:bg-surface-elevated rounded-md"><LogOut size={16}/> Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4 px-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary border-none w-full text-center">Log in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-center">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
