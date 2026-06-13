import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ArrowLeft, ShoppingBag, Truck, Building, ShieldCheck, Phone } from 'lucide-react';
import { checkout } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { showError, showSuccess } from '../../utils/swal';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, fetchCart, loading: cartLoading } = useCart();
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'cash_on_delivery', bankName: '', mobileProvider: '', phoneNumber: '', creditCardNumber: '' });
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

  if (cartLoading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
    </div>
  );

  if (cartItems.length === 0) return null; // Wait for redirect

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-xl bg-dark-800 border border-dark-600 text-gray-400 hover:text-white hover:border-dark-500 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          <p className="text-gray-500 text-sm mt-0.5">Secure payment & shipping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-7">
            <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-2 pb-4 border-b border-dark-600">
              <MapPin size={18} className="text-primary-400" /> Shipping Address
            </h2>
            <textarea required value={form.shippingAddress} onChange={set('shippingAddress')}
              className="input resize-none h-32 text-sm leading-relaxed" placeholder="Enter your full shipping address&#10;&#10;e.g., House Number, Street Name,&#10;City, Region, Country" />
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-7">
            <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-2 pb-4 border-b border-dark-600">
              <CreditCard size={18} className="text-primary-400" /> Payment Method
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { value: 'cash_on_delivery', label: 'Cash on Delivery', desc: 'Pay when order arrives', icon: Truck },
                { value: 'bank_transfer', label: 'Bank Transfer', desc: 'Direct bank transfer', icon: Building },
                { value: 'mobile_money', label: 'Mobile Money', desc: 'Pay via mobile money', icon: Phone },
                { value: 'credit_card', label: 'Credit Card', desc: 'Secure online payment', icon: ShieldCheck }
              ].map(opt => (
                <label key={opt.value}
                  className={`flex flex-col gap-3 p-5 rounded-xl border cursor-pointer transition-all ${form.paymentMethod === opt.value ? 'border-primary-600 bg-primary-900/20 shadow-lg shadow-primary-900/20' : 'border-dark-600 bg-dark-700 hover:border-dark-500 hover:bg-dark-600/50'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.paymentMethod === opt.value ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400'}`}>
                      <opt.icon size={18} />
                    </div>
                    <input type="radio" name="payment" value={opt.value} checked={form.paymentMethod === opt.value} onChange={set('paymentMethod')} className="w-4 h-4 accent-primary-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 hidden lg:block">
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base shadow-xl shadow-primary-900/30">
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><ShoppingBag size={18} /> Place Order - TZS {totalAmount?.toLocaleString('en-US')}</>}
            </button>
          </div>
        </form>

        {/* Order Summary sidebar */}
        <div className="space-y-6">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="font-bold text-white text-lg mb-6 pb-4 border-b border-dark-600">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map(item => {
                const sub = item.subTotal || (item.productPrice * item.quantity);
                return (
                  <div key={item.id || item.productId} className="flex gap-4 items-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-dark-600" />
                    ) : (
                      <div className="w-16 h-16 bg-dark-700 rounded-lg flex-shrink-0 flex items-center justify-center text-xl border border-dark-600">🛋️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-white">TZS {sub?.toLocaleString('en-US')}</p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-dark-600 pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">TZS {totalAmount?.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Taxes</span>
                <span className="text-white font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t border-dark-600 mt-4 pt-4 flex justify-between font-bold text-white text-xl">
                <span>Total</span>
                <span className="text-primary-400">TZS {totalAmount?.toLocaleString('en-US')}</span>
              </div>
            </div>
            
            {/* Mobile submit button */}
            <div className="mt-6 lg:hidden">
              <button type="submit" disabled={loading} onClick={handleSubmit} className="btn-primary w-full justify-center py-3.5 text-base shadow-xl shadow-primary-900/30">
                {loading ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><ShoppingBag size={18} /> Place Order</>}
              </button>
            </div>
          </div>
          
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 flex items-start gap-3">
             <ShieldCheck size={20} className="text-primary-400 flex-shrink-0 mt-0.5" />
             <div>
               <p className="text-white text-sm font-semibold mb-1">Secure Checkout</p>
               <p className="text-xs text-gray-500 leading-relaxed">Your personal and payment information is securely encrypted and processed.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
