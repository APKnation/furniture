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
      <section className="relative w-full min-h-[600px] bg-canvas overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-surface opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-5/12">
              <h1 className="text-[48px] md:text-[64px] font-bold text-ink leading-[1.1] mb-6 tracking-tight">
                Built for the perfect home
            </h1>
             <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 max-w-md font-medium">
  Discover handcrafted furniture that blends modern comfort with timeless design.
  <span className="block mt-2">
    High-quality pieces made to elevate every room in your home.
  </span>
</p>
<div className="flex items-center -space-x-2">
  {[
    "/images/image4.png",
    "/images/imagee.png",
    "/images/image2.png",
    "/images/image3.png",
  ].map((img, index) => (
    <img
      key={index}
      src={img}
      alt="Furniture"
      className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full border-4 border-[#1DB954] object-cover"
    />
  ))}
</div>


            </div>
            
            <div className="w-full md:w-7/12">
              <div className="relative rounded-2xl bg-surface p-3 shadow-spotify-heavy">
                <img src="/hero.png" alt="Featured Furniture" className="w-full h-[400px] object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 p-6 bg-surface-elevated rounded-md hover:bg-surface-card transition-colors">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-spotify-medium">
                  <Icon size={20} className="text-on-primary" />
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-bold text-ink mb-1">{label}</h3>
                  <p className="text-sm text-body">{desc}</p>
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
              <h2 className="text-[24px] md:text-[32px] font-bold text-ink tracking-tight">Latest Arrivals</h2>
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
              <Link to="/products" className="text-sm font-bold text-body hover:text-ink transition-colors group whitespace-nowrap uppercase tracking-button">
                View All
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
      {/* Tagline Section */}
      <section className="bg-surface py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">Our Promise</p>
          <h2 className="text-[32px] md:text-[52px] font-bold text-ink tracking-tight leading-[1.1]">
            We make furniture shopping{' '}
            <span className="text-primary">fast</span>,{' '}
            <span className="text-primary">safe</span>, and{' '}
            <span className="text-primary">easy</span>
          </h2>
          <p className="mt-6 text-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From handpicked collections to secure checkout and doorstep delivery — every step of your journey is designed around you.
          </p>
        </div>
      </section>
      {/* Values */}
      <section className="bg-canvas py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-bold text-ink tracking-tight">Why choose us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface rounded-md p-6 hover:bg-surface-elevated transition-colors duration-200 shadow-spotify-medium hover:shadow-spotify-heavy">
                <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center mb-6">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
