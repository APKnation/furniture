import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Star } from 'lucide-react';
import { getCategories, getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from '../../services/api';

const features = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $500' },
  { icon: Shield, label: 'Quality Guarantee', desc: '2 year warranty included' },
  { icon: Star, label: 'Premium Brands', desc: 'Only top furniture brands' },
];

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getProducts().then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setToast(`${product.name} added to cart!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to add to cart');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-dark-700 border border-primary-700/50 text-white px-5 py-3 rounded-xl shadow-2xl animate-slide-up text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-b border-dark-600">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-stretch gap-8">
            <div className="md:w-1/2">
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Elevate Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> Living Space</span>
              </h1>
             <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8">
  Discover handcrafted furniture that blends modern comfort with timeless design. Explore sofas, dining sets, and storage solutions that fit every home and lifestyle.
</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
                <div className="flex">
                  <img src="/image2.png" alt="Featured 1" className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-4 border-dark-800 object-cover shadow-md" />
                  <img src="/image3.png" alt="Featured 2" className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-4 border-dark-800 object-cover shadow-md" />
                </div>
                <div className="text-lg sm:text-xl">
                  <p className="text-white font-bold text-xl sm:text-2xl">Featured Collections</p>
                  <Link to="/products" className="text-primary-400 hover:text-primary-300 font-semibold text-base sm:text-lg mt-1 sm:mt-2 inline-flex items-center gap-1.5 transition-colors">
                    Explore our latest arrivals <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center min-h-[300px] md:min-h-0">
              <img src="/hero.png" alt="Hero" className="w-full h-full object-cover rounded-xl shadow-lg" />
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="bg-dark-800 border-b border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-900/50 border border-primary-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">{label}</p>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Browse by Room</h2>
              <p className="text-gray-400 mt-1">Find furniture designed for every space</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?categoryId=${cat.id}`}
                className="group card p-6 text-center hover:border-primary-600/60 hover:-translate-y-1 transition-all duration-300">

                <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Featured Products</h2>
              <p className="text-gray-400 mt-1">Our most popular pieces</p>
            </div>
            <Link to="/products" className="btn-secondary btn-sm">View All <ArrowRight size={15}/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={!isAdmin ? handleAddToCart : null} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
