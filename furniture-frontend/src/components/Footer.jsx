import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp, ArrowRight, Sofa } from 'lucide-react';

/* ── Inline SVG social icons ── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.121 1.533 5.854L.057 23.215a.75.75 0 0 0 .928.928l5.354-1.479A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 0 1-4.95-1.355l-.355-.211-3.676 1.015 1.014-3.674-.212-.356A9.706 9.706 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
);

const socials = [
  { icon: FacebookIcon,  href: '#',   label: 'Facebook'  },
  { icon: TwitterIcon,   href: '#',   label: 'Twitter'   },
  { icon: InstagramIcon, href: '#',   label: 'Instagram' },
  { icon: WhatsAppIcon,  href: 'https://wa.me/255757306134', label: 'WhatsApp' },
];

const quickLinks = [
  { to: '/',         label: 'Home'        },
  { to: '/products', label: 'All Products' },
  { to: '/cart',     label: 'My Cart'      },
  { to: '/orders',   label: 'My Orders'    },
  { to: '/about',    label: 'About Us'     },
  { to: '/contact',  label: 'Contact'      },
];

const categories = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Home Office',
  'Outdoor',
  'Storage',
];

const trustBadges = [
  { emoji: '🔒', text: 'Secure Checkout' },
  { emoji: '🚚', text: 'Fast Delivery'   },
  { emoji: '↩️',  text: 'Easy Returns'   },
  { emoji: '🏆', text: '5-Star Rated'    },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail]     = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubDone(true);
    setEmail('');
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-canvas border-t border-hairline relative">

     

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-spotify-medium group-hover:scale-110 transition-transform duration-200">
                <Sofa size={18} className="text-on-primary" />
              </div>
              <div>
                <p className="font-bold text-base text-ink leading-tight">APKnation</p>
                <p className="text-[10px] text-muted uppercase tracking-[0.1em]">Furniture Shop</p>
              </div>
            </Link>

            <p className="text-body text-sm leading-relaxed mb-6 max-w-[220px]">
              Proudly Tanzanian. Crafting beautiful, high-quality furniture for every home since 2019.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-surface rounded-full border border-hairline text-muted flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-200 hover:scale-110"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.14em] mb-5">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-body hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-primary text-xs">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.14em] mb-5">Categories</p>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat}>
                  <Link
                    to="/products"
                    className="text-sm text-body hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-primary text-xs">›</span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.14em] mb-5">Get in Touch</p>
            <ul className="space-y-5">
              <li>
                <a href="tel:+255757306134" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-surface border border-hairline flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-200">
                    <Phone size={13} className="text-muted group-hover:text-on-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold">Phone</p>
                    <p className="text-sm text-ink font-medium group-hover:text-primary transition-colors">+255 757 306 134</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:apknation@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-surface border border-hairline flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-200">
                    <Mail size={13} className="text-muted group-hover:text-on-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold">Email</p>
                    <p className="text-sm text-ink font-medium group-hover:text-primary transition-colors">atanasikafuka@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface border border-hairline flex items-center justify-center flex-shrink-0">
                    <MapPin size={13} className="text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold">Address</p>
                    <p className="text-sm text-ink font-medium">Dodoma, Tanzania 🇹🇿</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Trust badges strip ── */}
      <div className="border-t border-hairline bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {trustBadges.map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-2">
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-semibold text-body uppercase tracking-[0.1em]">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {year} <span className="font-bold text-body">APKnation Furniture</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-hairline">|</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-hairline">|</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>

      {/* ── Back to top button ── */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className="absolute bottom-16 right-6 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-spotify-heavy hover:scale-110 hover:shadow-spotify-heavy transition-all duration-200"
      >
        <ArrowUp size={16} />
      </button>

    </footer>
  );
}
