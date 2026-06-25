import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card group flex flex-col overflow-hidden transition-all duration-200 cursor-pointer relative">
      {/* Image */}
      <div className="relative bg-surface-elevated aspect-[4/3] w-full overflow-hidden">
        {product.imagePath ? (
          <img src={product.imagePath} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
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
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-sm ${product.quantity === 0 ? 'bg-sale text-on-primary' : 'bg-surface-card text-body shadow-spotify-medium'}`}>
              {product.quantity === 0 ? 'Out of Stock' : `Only ${product.quantity} left`}
            </span>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-canvas/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Link to={`/products/${product.id}`}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary text-sm font-bold uppercase tracking-button rounded-full hover:scale-105 hover:bg-primary-pressed transition-all duration-200 shadow-spotify-heavy">
            <Eye size={16} /> View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-4 bg-surface">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-base text-ink hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-sm text-body">{product.categoryName} {product.brandName && `· ${product.brandName}`}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-base font-bold text-ink">{`TZS ${product.price?.toLocaleString('en-US')}`}</p>
          {product.quantity > 0 && onAddToCart && (
            <button onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
              className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-105 hover:bg-primary-pressed transition-all shadow-spotify-medium">
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
