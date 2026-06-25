import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Star, Award, Leaf, Users, Heart } from 'lucide-react';
import { getCategories, getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const features = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over Tsh 5,000' },
  { icon: Shield, label: 'Quality Guarantee', desc: '2 year warranty included' },
  { icon: Star, label: 'Premium Brands', desc: 'Only top furniture brands' },
];

const values = [
  { icon: Award, title: 'Quality Craftsmanship', desc: 'Every piece meticulously handcrafted by skilled local artisans using time-honored techniques.' },
  { icon: Leaf, title: 'Sustainable Materials', desc: 'Responsibly sourced eco-friendly woods and finishes, reducing our environmental footprint.' },
  { icon: Users, title: 'Community Impact', desc: 'We invest in local economies, create jobs across Tanzania, and support artisan communities.' },
  { icon: Heart, title: 'Customer First', desc: 'From browsing to delivery, we are committed to a smooth, personal, enjoyable experience.' },
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
    getCategories().then(r => {
      const data = r.data;
      setCategories(Array.isArray(data) ? data : data?.content || []);
    }).catch(() => {});
    getProducts().then(r => {
      const data = r.data;
      setAllProducts(Array.isArray(data) ? data : data?.content || []);
    }).catch(() => {});
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
        <div className="fixed top-20 right-4 z-50 bg-canvas-elevated border border-hairline text-ink px-5 py-3 shadow-2xl animate-slide-up text-sm">
          {toast}
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              {/* Section label */}
              <p className="section-label mb-6">Premium Furniture · Tanzania</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium text-ink leading-[1.05] tracking-[-0.04em] mb-6">
                Elevate Your<br />Living Space
              </h1>
              <p className="text-body text-base leading-relaxed mb-10 max-w-md">
                Discover handcrafted furniture that blends modern comfort with timeless design. Sofas, dining sets, and storage solutions for every home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary">
                  Shop Collection <ArrowRight size={16} />
                </Link>
                <Link to="/about" className="btn-outline">
                  Our Story
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm">
                <img src="/hero.png" alt="Featured Furniture" className="w-full h-[400px] object-cover" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-canvas-elevated border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 px-6 py-8">
                <div className="w-10 h-10 bg-primary flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-on-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-1">{label}</h3>
                  <p className="text-xs text-body">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-canvas py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="section-label mb-3">Our Collection</p>
              <h2 className="text-4xl font-medium text-ink tracking-[-0.03em]">Our Products</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted uppercase tracking-[0.065em]">Category:</label>
                <select
                  className="input py-2 px-3 text-xs w-44"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Link to="/products" className="flex items-center gap-1.5 text-xs font-semibold text-body hover:text-ink uppercase tracking-[0.065em] transition-colors group whitespace-nowrap">
                View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={!isAdmin ? handleAddToCart : null} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-hairline">
              <p className="text-body text-sm uppercase tracking-[0.065em]">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="bg-canvas-elevated border-t border-hairline py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Why Choose Us</p>
            <h2 className="text-4xl font-medium text-ink tracking-[-0.03em]">What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-canvas-elevated p-8 hover:bg-canvas transition-colors duration-200">
                <div className="w-10 h-10 bg-primary flex items-center justify-center mb-6">
                  <Icon size={18} className="text-on-primary" />
                </div>
                <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
                <p className="text-xs text-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
