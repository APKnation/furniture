import { Link } from 'react-router-dom';
import { Sofa, Mail, Phone, MapPin } from 'lucide-react';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
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
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas mt-0 pb-16 pt-8">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center shadow-spotify-medium group-hover:scale-105 transition-transform">
              🇹🇿
              </div>
              <div>
                <p className="font-bold text-base text-ink leading-tight">APKnation</p>
                <p className="text-[10px] text-body uppercase tracking-[0.08em]">Online Furniture Shop</p>
              </div>
            </Link>
            <p className="text-body text-sm leading-relaxed mb-8 max-w-xs">
              Proudly Tanzanian. Crafting beautiful, high-quality furniture for every home since 2019.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-10 h-10 bg-surface-elevated rounded-full text-ink flex items-center justify-center hover:bg-surface-card hover:text-primary transition-all duration-200 shadow-spotify-medium hover:scale-105">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-body text-sm hover:text-primary font-bold transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink mb-5">Categories</h3>
            <ul className="space-y-3">
              {categories.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-body text-sm hover:text-primary font-bold transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink mb-5">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+255757306134" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Phone size={14} className="text-ink group-hover:text-on-primary transition-colors" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] text-body uppercase tracking-[0.08em] font-bold">Phone</p>
                    <p className="text-ink text-sm group-hover:text-primary transition-colors">+255 757 306 134</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:apknation@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Mail size={14} className="text-ink group-hover:text-on-primary transition-colors" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] text-body uppercase tracking-[0.08em] font-bold">Email</p>
                    <p className="text-ink text-sm group-hover:text-primary transition-colors">apknation@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-ink" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] text-body uppercase tracking-[0.08em] font-bold">Address</p>
                    <p className="text-ink text-sm">Dodoma, Tanzania</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-hairline-soft">
        <p className="text-xs text-body">
          © {year} <span className="font-bold text-ink">APKnation</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-body font-bold">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          <span>🇹🇿 Made in Tanzania</span>
        </div>
      </div>
    </footer>
  );
}
