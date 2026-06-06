import { useState, useEffect } from 'react';
import { Search, Eye, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { getAdminOrders, searchOrderByNumber, updateOrderStatus } from '../../services/api';
import { showError, showSuccess } from '../../utils/swal';

const statusColors = {
  NEW: 'bg-blue-900/50 text-blue-300 border-blue-800/50',
  CONFIRMED: 'bg-amber-900/50 text-amber-300 border-amber-800/50',
  DELIVERED: 'bg-green-900/50 text-green-300 border-green-800/50',
  CANCELED: 'bg-red-900/50 text-red-300 border-red-800/50',
};

const statuses = ['NEW','CONFIRMED','DELIVERED','CANCELED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const fetchOrders = () => getAdminOrders().then(r=>setOrders(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(()=>{ fetchOrders(); },[]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { fetchOrders(); return; }
    setLoading(true);
    try {
      const res = await searchOrderByNumber(search.trim());
      setOrders(res.data ? [res.data] : []);
    } catch { setOrders([]); } finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      showSuccess('Updated', `Order status changed to ${status}`);
      fetchOrders();
    } catch(err){ showError('Update failed', err.response?.data?.message||'Failed to update status'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div><h1 className="font-display text-2xl font-bold text-white">Orders</h1><p className="text-gray-400 text-sm mt-0.5">{orders.length} orders</p></div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} className="input pl-10" placeholder="Search by order number..."/>
        </div>
        <button type="submit" className="btn-secondary">Search</button>
        {search && <button type="button" onClick={()=>{setSearch('');fetchOrders();}} className="btn-secondary">Clear</button>}
      </form>

      <div className="space-y-3">
        {loading ? [...Array(4)].map((_,i)=><div key={i} className="card h-16 animate-pulse bg-dark-700"/>)
        : orders.map(order=>(
          <div key={order.id} className="card overflow-hidden">
            <div className="p-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer" onClick={()=>setExpanded(expanded===order.id?null:order.id)}>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-white">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.userName} · {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <span className={`badge border ${statusColors[order.status]||'bg-dark-600 text-gray-300'}`}>{order.status}</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-primary-400">{`TZS ${order.totalAmount?.toLocaleString('en-US')}`}</p>
                {expanded===order.id?<ChevronUp size={16} className="text-gray-400"/>:<ChevronDown size={16} className="text-gray-400"/>}
              </div>
            </div>

            {expanded===order.id && (
              <div className="border-t border-dark-600 p-4 space-y-4 animate-slide-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-gray-500 text-xs">Customer</p><p className="text-white font-medium">{order.userName}</p><p className="text-gray-400 text-xs">{order.userEmail}</p></div>
                  <div><p className="text-gray-500 text-xs">Payment</p><p className="text-white font-medium">{order.paymentMethod}</p><p className="text-gray-400 text-xs">{order.paymentStatus}</p></div>
                  <div><p className="text-gray-500 text-xs">Shipping</p><p className="text-white font-medium text-xs leading-relaxed">{order.shippingAddress}</p></div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1.5">Update Status</p>
                    <select value={order.status} onChange={e=>handleStatusChange(order.id,e.target.value)} className="input text-xs py-1.5">
                      {statuses.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Items:</p>
                  <div className="space-y-1.5">
                    {order.items?.map(item=>(
                      <div key={item.id} className="flex justify-between items-center bg-dark-700 rounded-lg px-3 py-2 text-sm">
                        <span className="text-gray-300">{item.productName} <span className="text-gray-500">×{item.quantity}</span></span>
                        <span className="text-primary-400 font-medium">{`TZS ${item.subTotal?.toLocaleString('en-US')}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && !orders.length && (
          <div className="text-center py-16 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
}
