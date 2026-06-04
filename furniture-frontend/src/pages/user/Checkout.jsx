import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { getCart, checkout } from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'cash_on_delivery' });
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getCart().then(r => { setCart(r.data); if (!r.data.items?.length) navigate('/cart'); })
      .catch(() => navigate('/cart')).finally(() => setCartLoading(false));
  }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await checkout(form);
      setSuccess(`Order ${res.data.orderNumber} placed successfully! Redirecting...`);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (cartLoading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"/></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20}/></Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          <p className="text-gray-400">Complete your order</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-900/30 border border-green-800/50 rounded-xl px-5 py-4 mb-6 text-green-300">
          <CheckCircle size={20}/> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-xl px-5 py-4 mb-6 text-red-300 text-sm">{error}</div>
      )}

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

          <button type="submit" disabled={loading || !!success} className="btn-primary w-full justify-center text-base py-3.5">
            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <><ShoppingBag size={18}/> Place Order</>}
          </button>
        </form>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate pr-2">{item.productName} ×{item.quantity}</span>
                <span className="text-white font-medium flex-shrink-0">{`TZS ${item.subTotal?.toLocaleString('en-US')}`}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-600 pt-4">
            <div className="flex justify-between font-bold text-white text-lg">
              <span>Total</span>
              <span className="text-primary-400">{`TZS ${cart.totalAmount?.toLocaleString('en-US')}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
