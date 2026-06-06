import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, FolderTree, AlertCircle, CheckCircle } from 'lucide-react';
import { getProductById, addToCart } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProductById(id).then(r => setProduct(r.data)).catch(() => navigate('/products')).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart({ productId: product.id, quantity });
      setMsg({ text: 'Added to cart successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add to cart', type: 'error' });
    } finally {
      setAdding(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-dark-700 rounded-2xl h-96"/>
        <div className="space-y-4">
          <div className="bg-dark-700 h-8 rounded-xl w-3/4"/>
          <div className="bg-dark-700 h-6 rounded-xl w-1/3"/>
          <div className="bg-dark-700 h-24 rounded-xl"/>
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={16}/> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="card overflow-hidden h-80 lg:h-auto">
          {product.imagePath ? (
            <img src={product.imagePath} alt={product.name} className="w-full h-full object-cover"/>
          ) : (
            <div className="w-full h-full min-h-80 flex items-center justify-center bg-dark-700">
              <div className="text-center text-gray-500">
                <Package size={48} className="mx-auto mb-2 text-dark-500"/>
                <p>No Image Available</p>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-dark-600 text-gray-400">{product.categoryName}</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">{product.name}</h1>
          </div>

          <p className="text-4xl font-bold text-primary-400">{`TZS ${product.price?.toLocaleString('en-US')}`}</p>

          {product.description && (
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${product.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${product.quantity > 0 ? 'bg-green-400' : 'bg-red-400'}`}/>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </div>
          </div>

          {msg.text && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${msg.type === 'success' ? 'bg-green-900/30 border border-green-800/50 text-green-300' : 'bg-red-900/30 border border-red-800/50 text-red-300'}`}>
              {msg.type === 'success' ? <CheckCircle size={15}/> : <AlertCircle size={15}/>}
              {msg.text}
            </div>
          )}

          {product.quantity > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-dark-700 rounded-xl border border-dark-500 px-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-10 text-gray-400 hover:text-white text-lg font-bold transition-colors">−</button>
                <span className="w-8 text-center font-semibold text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))} className="w-8 h-10 text-gray-400 hover:text-white text-lg font-bold transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary flex-1 justify-center">
                {adding ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <><ShoppingCart size={17}/> Add to Cart</>}
              </button>
            </div>
          )}

          <div className="card p-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400"><FolderTree size={14} className="text-primary-500"/> Category: <span className="text-white font-medium">{product.categoryName}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
