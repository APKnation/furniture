import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';
import { showError, showSuccess, confirmDelete } from '../../utils/swal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleUpdate = async (id, productId, qty) => {
    try { await updateQuantity(id, productId, qty); } catch { showError('Update failed', 'Cannot update quantity'); }
  };
  const handleRemove = async (id, productId) => { await removeItem(id, productId); };
  const handleClear = async () => {
    if (await confirmDelete('entire cart')) {
      await clearCart();
      showSuccess('Cleared', 'Your cart has been cleared.');
    }
  };
  const handleProceedCheckout = () => {
    if (isAuthenticated) navigate('/checkout');
    else navigate('/login?redirect=/checkout');
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link to="/products" className="w-10 h-10 flex items-center justify-center rounded-xl bg-dark-800 border border-dark-600 text-gray-400 hover:text-white hover:border-dark-500 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Shopping Cart</h1>
          <p className="text-gray-500 text-sm mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {!cartItems.length ? (
        <div className="text-center py-28">
          <div className="w-24 h-24 mx-auto bg-dark-800 border border-dark-600 rounded-3xl flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-dark-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
          <p className="text-gray-400 mb-8">Add some furniture to get started</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const sub = item.subTotal || (item.productPrice * item.quantity);
              return (
                <div key={item.id || item.productId} className="bg-dark-800 border border-dark-600 rounded-2xl p-5 flex gap-4 items-center hover:border-dark-500 transition-colors">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-dark-600" />
                  ) : (
                    <div className="w-20 h-20 bg-dark-700 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl border border-dark-600">🛋️</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate mb-1">{item.productName}</h3>
                    <p className="text-primary-400 font-bold text-sm">TZS {item.productPrice?.toLocaleString('en-US')}</p>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-dark-700 rounded-xl px-2 py-1 border border-dark-600">
                    <button onClick={() => handleUpdate(item.id, item.productId, item.quantity - 1)} disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 disabled:opacity-30 transition-all">
                      <Minus size={13} />
                    </button>
                    <span className="w-7 text-center font-semibold text-white text-sm">{item.quantity}</span>
                    <button onClick={() => handleUpdate(item.id, item.productId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-all">
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="w-28 text-right font-bold text-white text-sm hidden sm:block">TZS {sub?.toLocaleString('en-US')}</p>
                  <button onClick={() => handleRemove(item.id, item.productId)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-red-500 hover:text-red-400 hover:bg-red-900/20 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}

            <div className="pt-2">
              <button onClick={handleClear}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-xl hover:bg-red-900/20 transition-all border border-transparent hover:border-red-900/40">
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="font-bold text-white text-lg mb-6 pb-4 border-b border-dark-600">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cartItems.map(item => {
                const sub = item.subTotal || (item.productPrice * item.quantity);
                return (
                  <div key={item.id || item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate pr-2">{item.productName} <span className="text-gray-600">×{item.quantity}</span></span>
                    <span className="text-white font-medium flex-shrink-0">TZS {sub?.toLocaleString('en-US')}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-dark-600 pt-4 mb-6">
              <div className="flex justify-between font-bold text-white text-lg">
                <span>Total</span>
                <span className="text-primary-400">TZS {totalAmount?.toLocaleString('en-US')}</span>
              </div>
            </div>
            <button onClick={handleProceedCheckout} className="btn-primary w-full justify-center py-3 text-base">
              <ShoppingBag size={18} /> Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-gray-300 mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
