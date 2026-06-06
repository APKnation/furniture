import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/api';
import { showError, showSuccess, confirmDelete } from '../../utils/swal';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = () => getCart().then(r => setCart(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchCart(); }, []);

  const handleUpdate = async (id, qty) => {
    try { await updateCartItem(id, qty); fetchCart(); } catch (err) { showError('Update failed', err.response?.data?.message || 'Cannot update quantity'); }
  };
  const handleRemove = async (id) => { await removeCartItem(id); fetchCart(); };
  const handleClear = async () => {
    if (await confirmDelete('entire cart')) {
      await clearCart();
      showSuccess('Cleared', 'Your cart has been cleared.');
      fetchCart();
    }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"/></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/products" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20}/></Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Shopping Cart</h1>
          <p className="text-gray-400">{cart.items?.length || 0} item(s)</p>
        </div>
      </div>

      {!cart.items?.length ? (
        <div className="text-center py-24">
          <ShoppingBag size={56} className="mx-auto text-dark-500 mb-4"/>
          <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
          <p className="text-gray-400 mb-6">Add some furniture to get started</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4 items-center">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded-xl flex-shrink-0"/>
                ) : (
                  <div className="w-20 h-20 bg-dark-700 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-600">🛋️</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.productName}</h3>
                  <p className="text-primary-400 font-bold">{`TZS ${item.productPrice?.toLocaleString('en-US')}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdate(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white disabled:opacity-40 transition-all">
                    <Minus size={14}/>
                  </button>
                  <span className="w-8 text-center font-semibold text-white text-sm">{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-all">
                    <Plus size={14}/>
                  </button>
                </div>
                <p className="w-24 text-right font-bold text-white">{`TZS ${item.subTotal?.toLocaleString('en-US')}`}</p>
                <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
            <button onClick={handleClear} className="btn-danger btn-sm"><Trash2 size={14}/> Clear Cart</button>
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-white text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-400">
                  <span className="truncate pr-2">{item.productName} ×{item.quantity}</span>
                  <span className="text-white font-medium flex-shrink-0">{`TZS ${item.subTotal?.toLocaleString('en-US')}`}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dark-600 pt-4 mb-6">
              <div className="flex justify-between font-bold text-white text-lg">
                <span>Total</span>
                <span className="text-primary-400">{`TZS ${cart.totalAmount?.toLocaleString('en-US')}`}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full justify-center">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
