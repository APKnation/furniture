import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { getAdminOrders, searchOrderByNumber, updateOrderStatus } from '../../services/api';
import { showError, showSuccess } from '../../utils/swal';

const statusStyle = {
  NEW:       'text-semantic-info border-semantic-info',
  CONFIRMED: 'text-accent-yellow border-accent-yellow',
  DELIVERED: 'text-semantic-success border-semantic-success',
  CANCELED:  'text-semantic-warning border-semantic-warning',
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
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="section-label mb-2">Manage</p>
          <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Orders</h1>
          <p className="text-body text-sm mt-1">{orders.length} orders</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-4 text-muted"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} className="input pl-10" placeholder="Search by order number..."/>
        </div>
        <button type="submit" className="btn-outline btn-sm">Search</button>
        {search && <button type="button" onClick={()=>{setSearch('');fetchOrders();}} className="btn-outline btn-sm">Clear</button>}
      </form>

      <div className="space-y-px bg-hairline border border-hairline">
        {loading ? [...Array(4)].map((_,i)=><div key={i} className="h-16 bg-canvas-elevated animate-pulse"/>)
        : orders.map(order=>(
          <div key={order.id} className="bg-canvas-elevated">
            <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3 cursor-pointer hover:bg-canvas transition-colors" onClick={()=>setExpanded(expanded===order.id?null:order.id)}>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="font-medium text-ink text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-muted mt-0.5">{order.userName} · {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <span className={`badge border ${statusStyle[order.status]||'text-body border-hairline'}`}>{order.status}</span>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-medium text-ink text-sm">{`TZS ${order.totalAmount?.toLocaleString('en-US')}`}</p>
                {expanded===order.id?<ChevronUp size={14} className="text-muted"/>:<ChevronDown size={14} className="text-muted"/>}
              </div>
            </div>

            {expanded===order.id && (
              <div className="border-t border-hairline px-6 py-5 space-y-5 animate-slide-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em] mb-1">Customer</p>
                    <p className="text-ink font-medium text-xs">{order.userName}</p>
                    <p className="text-body text-xs mt-0.5">{order.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em] mb-1">Payment</p>
                    <p className="text-ink font-medium text-xs">{order.paymentMethod?.replace(/_/g, ' ')}</p>
                    {order.bankName && <p className="text-body text-xs mt-0.5">Bank: {order.bankName}</p>}
                    {order.mobileProvider && <p className="text-body text-xs">Provider: {order.mobileProvider}</p>}
                    {order.phoneNumber && <p className="text-body text-xs">Phone: {order.phoneNumber}</p>}
                    {order.creditCardNumber && <p className="text-body text-xs mt-0.5">Card: ****{order.creditCardNumber.slice(-4)}</p>}
                    <p className="text-primary text-xs mt-1 font-semibold uppercase tracking-[0.065em]">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em] mb-1">Shipping</p>
                    <p className="text-ink font-medium text-xs leading-relaxed">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-[0.08em] mb-1">Update Status</p>
                    <select value={order.status} onChange={e=>handleStatusChange(order.id,e.target.value)} className="input text-xs py-2">
                      {statuses.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-[0.08em] mb-3">Items</p>
                  <div className="space-y-px bg-hairline border border-hairline">
                    {order.items?.map(item=>(
                      <div key={item.id} className="flex justify-between items-center bg-canvas px-4 py-3 text-xs">
                        <span className="text-ink">{item.productName} <span className="text-muted">×{item.quantity}</span></span>
                        <span className="text-ink font-medium">{`TZS ${item.subTotal?.toLocaleString('en-US')}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {!loading && !orders.length && (
          <div className="text-center py-16 bg-canvas-elevated">
            <p className="text-body text-xs uppercase tracking-[0.065em]">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
