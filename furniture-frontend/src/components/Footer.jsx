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
    <footer className="bg-canvas border-t border-hairline mt-0">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Sofa size={16} className="text-on-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-ink leading-tight">APKnation</p>
                <p className="text-[10px] text-muted uppercase tracking-[0.08em]">Online Furniture Shop</p>
              </div>
            </Link>
            <p className="text-body text-sm leading-relaxed mb-6 max-w-xs">
              Proudly Tanzanian. Crafting beautiful, high-quality furniture for every home since 2019.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 bg-canvas-elevated border border-hairline text-muted flex items-center justify-center hover:text-ink hover:border-muted-soft transition-colors duration-150">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em] mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-body text-sm hover:text-ink transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em] mb-5">Categories</h3>
            <ul className="space-y-3">
              {categories.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-body text-sm hover:text-ink transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em] mb-5">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+255757306134" className="flex items-start gap-3 group">
                  <Phone size={13} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em]">Phone</p>
                    <p className="text-body text-sm group-hover:text-ink transition-colors">+255 757 306 134</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:apknation@gmail.com" className="flex items-start gap-3 group">
                  <Mail size={13} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em]">Email</p>
                    <p className="text-body text-sm group-hover:text-ink transition-colors">apknation@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MapPin size={13} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em]">Address</p>
                    <p className="text-body text-sm">Dodoma, Tanzania</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs">
            © {year} <span className="text-body">APKnation Online Furniture Shop</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-muted uppercase tracking-[0.08em]">
            <span className="hover:text-body cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-body cursor-pointer transition-colors">Terms of Service</span>
            <span>🇹🇿 Made in Tanzania</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
