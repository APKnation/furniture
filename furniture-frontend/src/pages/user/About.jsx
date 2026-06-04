import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-800 via-dark-900 to-black border-b border-dark-600">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left side – Text */}
            <div className="md:w-1/2">
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Us</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                APKNation Online Furniture Shop is a proudly Tanzanian brand dedicated to bringing high‑quality, locally‑crafted furniture to homes across the nation. We blend traditional craftsmanship with modern design, ensuring every piece is both beautiful and built to last.
              </p>
              <Link to="/products" className="btn-primary text-base px-7 py-3.5">
                Browse Collection <ArrowRight size={18} />
              </Link>
            </div>
            {/* Right side – Image */}
            <div className="md:w-1/2 flex items-center">
              <img src="/about-hero.png" alt="About us" className="w-full h-full object-cover rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-dark-800 border-b border-dark-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-white font-bold mb-8 text-center">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10 text-center">
            To empower Tanzanian families with furniture that reflects their style, supports local artisans, and stands the test of time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-primary-400 text-xl font-semibold mb-3">Quality Craftsmanship</h3>
              <p className="text-gray-400">Every piece is meticulously handcrafted by skilled local makers.</p>
            </div>
            <div className="text-center">
              <h3 className="text-primary-400 text-xl font-semibold mb-3">Sustainable Materials</h3>
              <p className="text-gray-400">We source responsibly, using eco‑friendly woods and finishes.</p>
            </div>
            <div className="text-center">
              <h3 className="text-primary-400 text-xl font-semibold mb-3">Community Impact</h3>
              <p className="text-gray-400">Supporting local economies and creating jobs across Tanzania.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
