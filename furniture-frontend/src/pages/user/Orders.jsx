import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, X, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { getMyOrders, cancelOrder } from '../../services/api';
import { showError, showSuccess, confirmAction } from '../../utils/swal';
import { Link } from 'react-router-dom';

const statusColors = {
  NEW:       'bg-blue-900/40 text-blue-300 border-blue-700/50',
  CONFIRMED: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  DELIVERED: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  CANCELED:  'bg-red-900/40 text-red-300 border-red-700/50',
};

const statusDot = {
  NEW: 'bg-blue-400',
  CONFIRMED: 'bg-amber-400',
  DELIVERED: 'bg-emerald-400',
  CANCELED: 'bg-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = () => getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    if (!(await confirmAction('Cancel Order?', 'Are you sure you want to cancel this order?', 'Yes, cancel it', true))) return;
    try {
      await cancelOrder(id);
      showSuccess('Canceled', 'Order has been canceled.');
      fetchOrders();
    } catch (err) {
      showError('Error', err.response?.data?.message || 'Cannot cancel order');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-white">My Orders</h1>
        <p className="text-gray-400 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
      </div>

      {!orders.length ? (
        <div className="text-center py-28">
          <div className="w-24 h-24 mx-auto bg-dark-800 border border-dark-600 rounded-3xl flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-dark-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-8">Start shopping to place your first order</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden hover:border-dark-500 transition-colors">
              {/* Order Header */}
              <div
                className="p-5 flex items-center justify-between flex-wrap gap-3 cursor-pointer select-none"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-primary-900/30 border border-primary-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{order.orderNumber}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} className="text-gray-500" />
                      <p className="text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusColors[order.status] || 'bg-dark-700 text-gray-300 border-dark-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status] || 'bg-gray-400'}`} />
                    {order.status}
                  </span>
                  <p className="font-bold text-primary-400">TZS {order.totalAmount?.toLocaleString('en-US')}</p>
                  {expanded === order.id
                    ? <ChevronUp size={18} className="text-gray-400" />
                    : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === order.id && (
                <div className="border-t border-dark-600 p-5 space-y-5 animate-fade-in">
                  {/* Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CreditCard size={14} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Payment Method</p>
                        <p className="text-white text-sm font-medium mt-0.5">{order.paymentMethod?.replace('_', ' ').toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package size={14} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Payment Status</p>
                        <p className="text-white text-sm font-medium mt-0.5">{order.paymentStatus}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={14} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Shipping Address</p>
                        <p className="text-white text-sm font-medium mt-0.5 leading-snug">{order.shippingAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-dark-700 border border-dark-600 rounded-xl px-4 py-3">
                          <span className="text-sm text-gray-200">{item.productName}
                            <span className="text-gray-500 ml-1">×{item.quantity}</span>
                          </span>
                          <span className="text-sm text-primary-400 font-semibold">TZS {item.subTotal?.toLocaleString('en-US')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status === 'NEW' && (
                    <button onClick={() => handleCancel(order.id)}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-xl hover:bg-red-900/20 border border-transparent hover:border-red-900/40 transition-all">
                      <X size={14} /> Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
