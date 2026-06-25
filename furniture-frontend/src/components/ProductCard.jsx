import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-canvas-elevated border border-hairline group overflow-hidden hover:border-muted-soft transition-colors duration-200">
      {/* Image */}
      <div className="relative overflow-hidden bg-canvas h-52">
        {product.imagePath ? (
          <img src={product.imagePath} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 bg-hairline flex items-center justify-center">
              <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              </svg>
            </div>
            <span className="text-xs text-muted uppercase tracking-[0.08em]">No Image</span>
          </div>
        )}
        {/* Stock badge */}
        {product.quantity <= 5 && (
          <div className="absolute top-0 left-0">
            <span className={`badge ${product.quantity === 0 ? 'bg-semantic-warning text-white' : 'bg-canvas-elevated text-body'}`}>
              {product.quantity === 0 ? 'Out of Stock' : `Only ${product.quantity} left`}
            </span>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-canvas/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Link to={`/products/${product.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-canvas-elevated border border-hairline text-ink text-xs font-semibold uppercase tracking-[0.08em] hover:bg-hairline transition-colors">
            <Eye size={12} /> View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-t border-hairline">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{product.categoryName}</p>
          {product.brandName && <p className="text-[10px] text-muted">{product.brandName}</p>}
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-sm text-ink hover:text-body transition-colors line-clamp-1 mb-3">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-ink">{`TZS ${product.price?.toLocaleString('en-US')}`}</p>
          {product.quantity > 0 && onAddToCart && (
            <button onClick={() => onAddToCart(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-active text-on-primary text-[10px] font-bold uppercase tracking-[0.1em] rounded-md transition-colors active:scale-[0.97]">
              <ShoppingCart size={11} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
