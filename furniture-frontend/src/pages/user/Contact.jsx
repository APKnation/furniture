import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
import { showSuccess, showError } from '../../utils/swal';

const contactInfo = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+255 757 306 134',
    sub: 'Mon–Sat, 8am – 6pm EAT',
    href: 'tel:+255757306134',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'apknation@gmail.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:apknation@gmail.com',
    color: 'from-primary-500/20 to-primary-600/10 border-primary-500/30 text-primary-400',
  },
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'Dodoma, Tanzania',
    sub: 'Our showroom & office',
    href: 'https://maps.google.com/?q=Dodoma,Tanzania',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon – Sat: 8am – 6pm',
    sub: 'Sunday: Closed',
    href: null,
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
  },
];



export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showError('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    await showSuccess('Message Sent! 🎉', 'Thank you for reaching out. We will get back to you shortly.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="animate-fade-in">

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-b border-dark-600 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/40 border border-primary-700/50 text-primary-400 text-sm font-medium mb-6">
            <MessageSquare size={14} />
            We're here to help
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Get In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Touch
            </span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question about our furniture, delivery, or a custom order? Our friendly team is ready to help you find the perfect piece for your home.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map(({ icon: Icon, label, value, sub, href, color }) => {
            const Wrapper = href ? 'a' : 'div';
            const props = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <Wrapper key={label} {...props}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${href ? 'cursor-pointer' : ''}`}>
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-dark-800/60 flex items-center justify-center mb-4 shadow-inner">
                  <Icon size={22} className={color.split(' ').find(c => c.startsWith('text-'))} />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-bold text-white text-sm mb-0.5 leading-snug">{value}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* Main Content: Form + Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-dark-800 border border-dark-600 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-white mb-1">Send Us a Message</h2>
                <p className="text-gray-400">Fill out the form below and we'll respond within 24 hours.</p>
              </div>

              {sent && !loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-emerald-900/30 border border-emerald-700/50 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle size={36} className="text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-2">Message Received!</h3>
                  <p className="text-gray-400 mb-6 max-w-xs">We've received your message and will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary btn-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text" name="name" value={form.name} onChange={handleChange}
                        className="input" required autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="label mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        className="input" required autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label mb-1.5">Phone Number</label>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        className="input" autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label className="label mb-1.5">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className="input">
                        <option value="">Select a topic...</option>
                        <option value="order">Order Inquiry</option>
                        <option value="delivery">Delivery & Shipping</option>
                        <option value="return">Returns & Exchanges</option>
                        <option value="custom">Custom Order</option>
                        <option value="product">Product Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      rows={5} className="input resize-none" required
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-2 space-y-6">

            {/* Map Embed */}
            <div className="rounded-3xl overflow-hidden border border-dark-600 shadow-xl h-64">
              <iframe
                title="APKnation Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126923.31827024507!2d35.69124!3d-6.17221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184a1e3f0f8a5fa7%3A0x7d3e5f6c7a8b9c0d!2sDodoma%2C%20Tanzania!5e0!3m2!1sen!2stz!4v1699000000000"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social Media */}
            <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: FacebookIcon, href: '#', label: 'Facebook', color: 'hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400' },
                  { icon: TwitterIcon, href: '#', label: 'Twitter', color: 'hover:bg-sky-600/20 hover:border-sky-500/40 hover:text-sky-400' },
                  { icon: InstagramIcon, href: '#', label: 'Instagram', color: 'hover:bg-pink-600/20 hover:border-pink-500/40 hover:text-pink-400' },
                ].map(({ icon: Icon, href, label, color }) => (
                  <a key={label} href={href} aria-label={label}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 text-sm font-medium transition-all duration-200 ${color}`}>
                    <Icon size={16} />{label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-primary-900/30 to-dark-800 border border-primary-700/30 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-3">Quick Response Guarantee</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We take every inquiry seriously. Our support team is committed to responding to all messages within <span className="text-primary-400 font-semibold">24 business hours</span>. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
