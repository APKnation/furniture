import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Truck, Shield } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Products Available' },
  { value: '2,000+', label: 'Happy Customers' },
  { value: '5+', label: 'Years in Business' },
  { value: '100%', label: 'Local Craftsmanship' },
];



const guarantees = [
  { icon: Star, label: '2-Year Warranty', desc: 'On all furniture items' },
  { icon: Truck, label: 'Free Delivery', desc: 'On orders over Tsh 5,000' },
  { icon: Shield, label: '14-Day Returns', desc: 'Hassle-free, no questions' },
  { icon: CheckCircle, label: 'Verified Quality', desc: 'Every piece inspected' },
];

const milestones = [
  { year: '2019', event: 'APKnation founded in Dodoma with a small showroom and 3 artisans.' },
  { year: '2020', event: 'Launched our online store, reaching customers across Tanzania.' },
  { year: '2021', event: 'Expanded our catalog to 200+ products and partnered with 15 local craftsmen.' },
  { year: '2022', event: 'Introduced free delivery across major Tanzanian cities.' },
  { year: '2023', event: 'Surpassed 1,000 happy customers and won the Tanzania Business Award.' },
  { year: '2024', event: 'Launched custom furniture orders and assembly services.' },
];

export default function About() {
  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-b border-dark-600 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/40 border border-primary-700/50 text-primary-400 text-sm font-medium mb-6">
                🇹🇿 Proudly Tanzanian
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Crafting Homes,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  Building Dreams
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                APKnation Online Furniture Shop is a proudly Tanzanian brand dedicated to bringing high-quality, locally-crafted furniture to homes across the nation. We blend traditional craftsmanship with modern design — ensuring every piece is both beautiful and built to last.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary flex items-center gap-2 px-6 py-3">
                  Browse Collection <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-secondary flex items-center gap-2 px-6 py-3">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img src="/hero.png" alt="About APKnation" className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
                <div className="absolute -bottom-5 -left-5 bg-dark-800 border border-dark-600 rounded-2xl px-5 py-4 shadow-xl">
                  <p className="text-3xl font-bold text-primary-400">5+</p>
                  <p className="text-gray-400 text-sm">Years of Excellence</p>
                </div>
                <div className="absolute -top-5 -right-5 bg-dark-800 border border-dark-600 rounded-2xl px-5 py-4 shadow-xl">
                  <p className="text-3xl font-bold text-emerald-400">2k+</p>
                  <p className="text-gray-400 text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-dark-800/60 border-b border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center group">
                <p className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {value}
                </p>
                <p className="text-gray-400 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                APKnation was born from a simple belief — that every Tanzanian family deserves beautiful, affordable furniture they can be proud of. Founded in 2019 in the heart of Dodoma, we started with a small workshop, three passionate craftsmen, and a vision to transform how people furnish their homes.
              </p>
              <p>
                Over the years, we have grown into a trusted online furniture destination, serving thousands of customers across Tanzania. But our roots remain the same: handcrafted quality, local pride, and a commitment to the communities we serve.
              </p>
              <p>
                Today, we offer over 500 furniture pieces — from sleek modern sofas and dining sets to sturdy storage solutions — all designed to bring both style and function to your living spaces.
              </p>
            </div>
          </div>
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-700/30 to-transparent" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-6 group">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-dark-800 border-2 border-primary-600/60 group-hover:border-primary-400 flex items-center justify-center transition-colors z-10 relative">
                      <div className="w-3 h-3 rounded-full bg-primary-500 group-hover:bg-primary-400 transition-colors" />
                    </div>
                  </div>
                  <div className="pb-2">
                    <span className="text-primary-400 font-bold text-sm">{year}</span>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Guarantees */}
      <section className="bg-dark-800/60 border-y border-dark-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-primary-900/30 border border-primary-800/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-900/50 transition-colors">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{label}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
