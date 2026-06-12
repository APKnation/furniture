import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Sofa, Search, LayoutDashboard } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-md border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-600/40 transition-all">
              <Sofa size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">APKNation Online Furniture Shop</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to) ? 'bg-primary-600/20 text-primary-400' : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}>{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-dark-700 transition-all mr-2">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn-secondary btn-sm">
                    <LayoutDashboard size={15} /> Admin Panel
                  </Link>
                )}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 transition-all">
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 card py-1 animate-fade-in z-50">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-700"><User size={15}/> My Profile</Link>
                      {!isAdmin && <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-700"><ShoppingCart size={15}/> My Orders</Link>}
                      <div className="border-t border-dark-600 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 w-full"><LogOut size={15}/> Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-dark-600 bg-dark-800 px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(to) ? 'bg-primary-600/20 text-primary-400' : 'text-gray-300'}`}>{label}</Link>
          ))}
          <div className="border-t border-dark-600 pt-2 mt-2">
            {!isAdmin && (
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300">
                <ShoppingCart size={16}/> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300"><User size={16}/> Profile</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300"><LayoutDashboard size={16}/> Admin Panel</Link>}
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 w-full"><LogOut size={16}/> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm text-gray-300">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm text-primary-400 font-medium">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
