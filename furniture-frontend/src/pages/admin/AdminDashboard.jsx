import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, TrendingUp, CheckCircle, Truck, XCircle, Clock, AlertCircle, PlusCircle, BarChart2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAdminOrders } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats().catch(() => ({ data: null })),
      getAdminOrders().catch(() => ({ data: [] }))
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      
      const orders = ordersRes.data || [];
      const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setRecentOrders(sortedOrders.slice(0, 5));
      
      const newOrders = orders.filter(o => o.status === 'NEW').length;
      setPendingCount(newOrders);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const cards = stats ? [
    { label: 'New Orders', value: stats.totalNewOrders, icon: ShoppingBag, color: 'from-blue-700 to-blue-900', textColor: 'text-blue-300' },
    { label: 'Confirmed', value: stats.totalConfirmedOrders, icon: CheckCircle, color: 'from-amber-700 to-amber-900', textColor: 'text-amber-300' },
    { label: 'Delivered', value: stats.totalDeliveredOrders, icon: Truck, color: 'from-green-700 to-green-900', textColor: 'text-green-300' },
    { label: 'Canceled', value: stats.totalCanceledOrders, icon: XCircle, color: 'from-red-700 to-red-900', textColor: 'text-red-300' },
    { label: 'Total Orders', value: stats.totalOrders, icon: TrendingUp, color: 'from-purple-700 to-purple-900', textColor: 'text-purple-300' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'from-primary-700 to-primary-900', textColor: 'text-primary-300' },
    { label: 'Customers', value: stats.totalRegisteredUsers, icon: Users, color: 'from-pink-700 to-pink-900', textColor: 'text-pink-300' },
  ] : [];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your store performance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(8)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-dark-700" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.map(({ label, value, icon: Icon, color, textColor }) => (
              <div key={label} className="stat-card">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon size={16} className="text-white sm:hidden" />
                  <Icon size={22} className="text-white hidden sm:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm leading-tight">{label}</p>
                  <p className={`text-lg sm:text-3xl font-bold ${textColor}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Recent Orders */}
            <div className="xl:col-span-2 card overflow-hidden flex flex-col">
              <div className="p-5 border-b border-dark-600 flex justify-between items-center bg-dark-700/30">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Clock size={18} className="text-primary-400" /> Recent Orders
                </h2>
                <Link to="/admin/orders" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
                  View All
                </Link>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-dark-600 bg-dark-700/50">
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Order #</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Customer</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                      <th className="text-right px-5 py-3 text-gray-400 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-dark-600/50 table-row-hover">
                          <td className="px-5 py-3 font-semibold text-white">{order.orderNumber}</td>
                          <td className="px-5 py-3 font-medium text-white">{order.userName}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              order.status === 'DELIVERED' ? 'bg-green-950 text-green-400 border-green-800' :
                              order.status === 'CANCELED' ? 'bg-red-950 text-red-400 border-red-800' :
                              order.status === 'CONFIRMED' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                              'bg-blue-950 text-blue-400 border-blue-800'
                            }`}>{order.status}</span>
                          </td>
                          <td className="px-5 py-3 text-right text-primary-400 font-bold">
                            TZS {order.totalAmount?.toLocaleString('en-US')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">No recent orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Actions & Links */}
            <div className="space-y-6">
              {/* Pending Actions */}
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-dark-600 bg-dark-700/30">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <AlertCircle size={18} className="text-amber-400" /> Pending Actions
                  </h2>
                </div>
                <div className="p-5">
                  {pendingCount > 0 ? (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-900/20 border border-amber-900/50">
                      <div className="w-10 h-10 rounded-full bg-amber-900/40 flex items-center justify-center flex-shrink-0 text-amber-400">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm">New Orders Waiting</h3>
                        <p className="text-gray-400 text-xs mt-1">You have {pendingCount} new order{pendingCount > 1 ? 's' : ''} that need confirmation.</p>
                        <Link to="/admin/orders" className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-amber-400 hover:text-amber-300">
                          Review Orders <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-400 mb-3">
                        <CheckCircle size={24} />
                      </div>
                      <h3 className="text-white font-medium text-sm">All Caught Up!</h3>
                      <p className="text-gray-400 text-xs mt-1">There are no pending actions required right now.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-dark-600 bg-dark-700/30">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-400" /> Quick Links
                  </h2>
                </div>
                <div className="p-3 space-y-2">
                  <Link to="/admin/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <PlusCircle size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Manage Products</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </Link>
                  <Link to="/admin/reports" className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <BarChart2 size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">View Sales & Charts</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </Link>
                  <Link to="/admin/users" className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-900/30 flex items-center justify-center text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        <Users size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Manage Users</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
