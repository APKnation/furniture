import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ArrowLeft, ShoppingBag } from 'lucide-react';
import { checkout } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { showError, showSuccess } from '../../utils/swal';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, fetchCart, loading: cartLoading } = useCart();
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'cash_on_delivery' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await checkout(form);
      await fetchCart(); // Re-sync cart context from backend (now empty)
      await showSuccess('Order Placed!', `Order ${res.data.orderNumber} placed successfully.`);
      navigate('/orders');
    } catch (err) {
      showError('Checkout Failed', err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (cartLoading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"/></div>;

  if (cartItems.length === 0) return null; // Wait for redirect

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20}/></Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          <p className="text-gray-400">Complete your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><MapPin size={17} className="text-primary-400"/>Shipping Address</h2>
            <textarea required value={form.shippingAddress} onChange={set('shippingAddress')}
              className="input resize-none h-28" placeholder="Enter your full shipping address&#10;Street, City, State, ZIP, Country"/>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><CreditCard size={17} className="text-primary-400"/>Payment Method</h2>
            <div className="space-y-3">
              {[{ value:'cash_on_delivery', label:'Cash on Delivery', desc:'Pay when your order arrives' },
                { value:'bank_transfer', label:'Bank Transfer', desc:'Transfer to our bank account' },
                { value:'credit_card', label:'Credit / Debit Card', desc:'Secure card payment' }
              ].map(opt => (
                <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.paymentMethod === opt.value ? 'border-primary-600 bg-primary-900/20' : 'border-dark-600 hover:border-dark-500'}`}>
                  <input type="radio" name="payment" value={opt.value} checked={form.paymentMethod === opt.value} onChange={set('paymentMethod')} className="mt-0.5 accent-primary-500"/>
                  <div>
                    <p className="font-medium text-white">{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5">
            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <><ShoppingBag size={18}/> Place Order</>}
          </button>
        </form>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => {
              const sub = item.subTotal || (item.productPrice * item.quantity);
              return (
              <div key={item.id || item.productId} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate pr-2">{item.productName} ×{item.quantity}</span>
                <span className="text-white font-medium flex-shrink-0">{`TZS ${sub?.toLocaleString('en-US')}`}</span>
              </div>
            )})}
          </div>
          <div className="border-t border-dark-600 pt-4">
            <div className="flex justify-between font-bold text-white text-lg">
              <span>Total</span>
              <span className="text-primary-400">{`TZS ${totalAmount?.toLocaleString('en-US')}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
