import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card group overflow-hidden hover:border-primary-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-900/20">
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-700 h-52">
        {product.imagePath ? (
          <img src={product.imagePath} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-dark-500">
            <div className="w-16 h-16 bg-dark-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )}
        {/* Stock badge */}
        {product.quantity <= 5 && (
          <div className="absolute top-2 left-2">
            <span className={`badge ${product.quantity === 0 ? 'bg-red-900/80 text-red-300' : 'bg-amber-900/80 text-amber-300'}`}>
              {product.quantity === 0 ? 'Out of Stock' : `Only ${product.quantity} left`}
            </span>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Link to={`/products/${product.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all">
            <Eye size={13} /> View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs text-primary-400 font-medium">{product.brandName}</p>
          <p className="text-xs text-gray-500">{product.categoryName}</p>
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-100 hover:text-primary-400 transition-colors line-clamp-1 mb-3">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary-400">{`TZS ${product.price?.toLocaleString('en-US')}`}</p>
          {product.quantity > 0 && onAddToCart && (
            <button onClick={() => onAddToCart(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-primary-600/30 active:scale-95">
              <ShoppingCart size={13} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
