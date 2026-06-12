import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Star } from 'lucide-react';
import { getCategories, getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const features = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over Tsh 5000' },
  { icon: Shield, label: 'Quality Guarantee', desc: '2 year warranty included' },
  { icon: Star, label: 'Premium Brands', desc: 'Only top furniture brands' },
];



export default function Home() {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toast, setToast] = useState('');


  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getProducts().then(r => setAllProducts(r.data)).catch(() => {});
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      setToast(`${product.name} added to cart!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to add to cart');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const displayedProducts = selectedCategory
    ? allProducts.filter(p => p.category?.id == selectedCategory || p.categoryId == selectedCategory)
    : allProducts;
  const featured = displayedProducts.slice(0, 6);

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
                Elevate Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  Living Space
                </span>{" "}
                with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  Online Furniture Shop
                </span>
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

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 relative z-10 gap-4">
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-2">Our Products</h2>
            <p className="text-gray-400 text-lg">Handpicked pieces for your home</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-gray-400 font-medium whitespace-nowrap">Select Category:</label>
              <select
                className="input w-full sm:w-48 bg-dark-800 border-dark-600 text-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-primary-400 font-semibold hover:text-primary-300 transition-colors whitespace-nowrap">
              View All <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={!isAdmin ? handleAddToCart : null} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 relative z-10">
            <p className="text-gray-400">No products found in this category.</p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-dark-800/50 border-y border-dark-600 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="group flex items-start gap-5 p-6 rounded-2xl hover:bg-dark-700/50 transition-all duration-300 border border-transparent hover:border-dark-600">
                <div className="w-14 h-14 bg-primary-900/30 group-hover:bg-primary-900/50 border border-primary-800/50 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors shadow-lg shadow-primary-900/20">
                  <Icon size={24} className="text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">{label}</h3>
                  <p className="text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
