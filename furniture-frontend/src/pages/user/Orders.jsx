import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, X, Package } from 'lucide-react';
import { getMyOrders, cancelOrder } from '../../services/api';

const statusColors = {
  NEW: 'bg-blue-900/50 text-blue-300 border-blue-800/50',
  CONFIRMED: 'bg-amber-900/50 text-amber-300 border-amber-800/50',
  DELIVERED: 'bg-green-900/50 text-green-300 border-green-800/50',
  CANCELED: 'bg-red-900/50 text-red-300 border-red-800/50',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = () => getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try { await cancelOrder(id); fetchOrders(); } catch (err) { alert(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"/></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">My Orders</h1>
        <p className="text-gray-400 mt-1">{orders.length} order(s)</p>
      </div>

      {!orders.length ? (
        <div className="text-center py-24">
          <ShoppingBag size={56} className="mx-auto text-dark-500 mb-4"/>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-gray-400">Start shopping to place your first order</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card overflow-hidden">
              <div className="p-5 flex items-center justify-between flex-wrap gap-3 cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-900/40 rounded-xl flex items-center justify-center">
                    <Package size={18} className="text-primary-400"/>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge border ${statusColors[order.status] || 'bg-dark-600 text-gray-300'}`}>{order.status}</span>
                  <p className="font-bold text-primary-400">{`TZS ${order.totalAmount?.toLocaleString('en-US')}`}</p>
                  {expanded === order.id ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-dark-600 p-5 space-y-4 animate-slide-up">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div><p className="text-gray-500">Payment</p><p className="text-white font-medium">{order.paymentMethod}</p></div>
                    <div><p className="text-gray-500">Payment Status</p><p className="text-white font-medium">{order.paymentStatus}</p></div>
                    <div><p className="text-gray-500">Shipping Address</p><p className="text-white font-medium text-xs leading-relaxed">{order.shippingAddress}</p></div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-3">Items ordered:</p>
                    <div className="space-y-2">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-dark-700 rounded-xl px-4 py-2.5">
                          <span className="text-sm text-gray-300">{item.productName} <span className="text-gray-500">×{item.quantity}</span></span>
                          <span className="text-sm text-primary-400 font-medium">${item.subTotal?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status === 'NEW' && (
                    <button onClick={() => handleCancel(order.id)} className="btn-danger btn-sm">
                      <X size={14}/> Cancel Order
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
