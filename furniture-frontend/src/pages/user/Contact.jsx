import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to an API.
    console.log('Contact form submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <h1 className="font-display text-4xl font-bold text-white mb-8 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <p className="text-gray-300 text-lg">We’d love to hear from you! Reach out using any of the methods below.</p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <strong className="mr-1">Email:</strong> apknation@gmail.com
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <strong className="mr-1">Phone:</strong> +255-757-306-134
            </li>
            <li className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <strong className="mr-1">Address:</strong> Dodoma, Tanzania
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg">
          {submitted ? (
            <p className="text-primary-400 text-center">Thank you! Your message has been sent.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 bg-dark-700 text-white rounded" required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 bg-dark-700 text-white rounded" required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full p-2 bg-dark-700 text-white rounded" required
              />
              <button
                type="submit"
                className="btn-primary w-full text-center"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="btn-secondary inline-block">
          Return Home
        </Link>
      </div>
    </div>
  );
}
