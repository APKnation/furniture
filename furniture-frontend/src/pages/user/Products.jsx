import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getProducts, getCategories, addToCart } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';

export default function Products() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    getProducts(params).then(r => setProducts(r.data)).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [search, categoryId]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setToast(`${product.name} added to cart!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to add');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const clearFilters = () => { setSearch(''); setCategoryId(''); };
  const hasFilters = search || categoryId;



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {toast && <div className="fixed top-20 right-4 z-50 bg-dark-700 border border-primary-700/50 text-white px-5 py-3 rounded-xl shadow-2xl animate-slide-up text-sm font-medium">{toast}</div>}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">All Products</h1>
          <p className="text-gray-400 mt-1">{products.length} items found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary btn-sm">
          <SlidersHorizontal size={15}/> Filters {hasFilters && <span className="badge bg-primary-600 text-white ml-1">•</span>}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-500"/>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-11 text-base" placeholder="Search furniture by name..."/>
        {search && <button onClick={() => setSearch('')} className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300"><X size={16}/></button>}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-5 mb-6 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-danger btn-sm mt-4"><X size={14}/> Clear Filters</button>
          )}
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-dark-700"/>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛋️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={!isAdmin ? handleAddToCart : null}/>)}
        </div>
      )}
    </div>
  );
}
