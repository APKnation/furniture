import { Link } from 'react-router-dom';
import { Sofa, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'All Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/cart', label: 'My Cart' },
  { to: '/orders', label: 'My Orders' },
];

const categories = [
  { label: 'Living Room', to: '/products' },
  { label: 'Bedroom', to: '/products' },
  { label: 'Dining Room', to: '/products' },
  { label: 'Office', to: '/products' },
  { label: 'Outdoor', to: '/products' },
  { label: 'Storage', to: '/products' },
];

const socials = [
  { icon: FacebookIcon, href: '#', label: 'Facebook', color: 'hover:text-blue-400 hover:bg-blue-900/30 hover:border-blue-700/50' },
  { icon: TwitterIcon, href: '#', label: 'Twitter', color: 'hover:text-sky-400 hover:bg-sky-900/30 hover:border-sky-700/50' },
  { icon: InstagramIcon, href: '#', label: 'Instagram', color: 'hover:text-pink-400 hover:bg-pink-900/30 hover:border-pink-700/50' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-600 mt-16">

      {/* Top strip CTA */}
      <div className="bg-gradient-to-r from-primary-900/40 via-dark-800 to-primary-900/40 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
         
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-600/40 transition-shadow">
                <Sofa size={20} className="text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-base leading-tight">APKnation</p>
                <p className="text-xs text-primary-400 font-medium">Online Furniture Shop</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Proudly Tanzanian. Crafting beautiful, high-quality furniture for every home since 2019.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a key={label} href={href} aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-dark-800 border border-dark-600 text-gray-400 flex items-center justify-center transition-all duration-200 ${color}`}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-gray-400 text-sm hover:text-primary-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Categories</h3>
            <ul className="space-y-3">
              {categories.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-gray-400 text-sm hover:text-primary-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+255757306134" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-dark-800 border border-dark-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-primary-600/50 transition-colors mt-0.5">
                    <Phone size={14} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-gray-300 text-sm group-hover:text-primary-400 transition-colors">+255 757 306 134</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:apknation@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-dark-800 border border-dark-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-primary-600/50 transition-colors mt-0.5">
                    <Mail size={14} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-gray-300 text-sm group-hover:text-primary-400 transition-colors">apknation@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-dark-800 border border-dark-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={14} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Address</p>
                    <p className="text-gray-300 text-sm">Dodoma, Tanzania</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {year} <span className="text-gray-400 font-medium">APKnation Online Furniture Shop</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="w-1 h-1 rounded-full bg-dark-600" />
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="w-1 h-1 rounded-full bg-dark-600" />
            <span className="text-gray-600">🇹🇿 Made in Tanzania</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
