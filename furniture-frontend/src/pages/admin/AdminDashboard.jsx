import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, TrendingUp, CheckCircle, Truck, XCircle, Plus, FileText, ClipboardList, DollarSign, Percent, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'New Orders',   value: stats.totalNewOrders,        icon: ShoppingBag,  accent: 'text-semantic-info' },
    { label: 'Confirmed',    value: stats.totalConfirmedOrders,   icon: CheckCircle,  accent: 'text-accent-yellow' },
    { label: 'Delivered',    value: stats.totalDeliveredOrders,   icon: Truck,        accent: 'text-semantic-success' },
    { label: 'Canceled',     value: stats.totalCanceledOrders,    icon: XCircle,      accent: 'text-semantic-warning' },
    { label: 'Total Orders', value: stats.totalOrders,            icon: TrendingUp,   accent: 'text-ink' },
    { label: 'Products',     value: stats.totalProducts,          icon: Package,      accent: 'text-ink' },
    { label: 'Customers',    value: stats.totalRegisteredUsers,   icon: Users,        accent: 'text-ink' },
  ] : [];

  const chartData = stats ? [
    { name: 'New', count: stats.totalNewOrders, fill: '#3b82f6' },
    { name: 'Confirmed', count: stats.totalConfirmedOrders, fill: '#eab308' },
    { name: 'Delivered', count: stats.totalDeliveredOrders, fill: '#22c55e' },
    { name: 'Canceled', count: stats.totalCanceledOrders, fill: '#ef4444' },
  ] : [];

  const formatTZS = (value) => {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0);
  };

  const conversionMetrics = [
    { label: 'Avg. Order Value', value: formatTZS(stats?.averageOrderValue || 0), icon: DollarSign, accent: 'text-semantic-success' },
    { label: 'Total Revenue', value: formatTZS(stats?.totalRevenue || 0), icon: Percent, accent: 'text-semantic-warning' }, // Using Percent icon as a placeholder, let's keep it or change it later.
    { label: 'Customer Retention', value: '68%', icon: Heart, accent: 'text-semantic-info' }, // Still mocked as per plan
  ];

  const topProducts = stats?.topProducts || [];


  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <p className="section-label mb-2">Overview</p>
        <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Dashboard</h1>
        <p className="text-body text-sm mt-2">Store performance at a glance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(7)].map((_, i) => <div key={i} className="h-32 bg-surface rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Quick Actions Panel */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Link to="/admin/products" className="btn-primary">
              <Plus className="w-4 h-4" /> Add New Product
            </Link>
            <Link to="/admin/reports" className="btn-secondary">
              <FileText className="w-4 h-4" /> Export Sales CSV
            </Link>
            <Link to="/admin/orders" className="btn-secondary">
              <ClipboardList className="w-4 h-4" /> Review Pending Orders
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="bg-surface rounded-2xl p-6 flex items-start gap-5 hover:bg-surface-elevated hover:shadow-spotify-heavy transition-all duration-200 shadow-spotify-medium">
                <div className="w-11 h-11 bg-surface-elevated rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className={`${accent} w-5 h-5`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.1em] mb-2">{label}</p>
                  <p className={`text-4xl font-bold ${accent} tracking-tight`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Conversion Metrics */}
            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {conversionMetrics.map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="bg-surface rounded-2xl p-6 flex items-start gap-5 hover:bg-surface-elevated hover:shadow-spotify-heavy transition-all duration-200 shadow-spotify-medium">
                  <div className="w-11 h-11 bg-surface-elevated rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className={`${accent} w-5 h-5`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.1em] mb-2">{label}</p>
                    <p className={`text-4xl font-bold text-ink tracking-tight`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Breakdown */}
            <div className="xl:col-span-2 bg-surface rounded-2xl p-6 shadow-spotify-medium hover:shadow-spotify-heavy transition-all duration-200">
              <h2 className="text-[10px] font-bold text-muted uppercase tracking-[0.1em] mb-6">Orders Breakdown</h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    <XAxis dataKey="name" stroke="#b3b3b3" tick={{fill: '#b3b3b3', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#b3b3b3" tick={{fill: '#b3b3b3', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#181818', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{fill: '#2a2a2a'}}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="xl:col-span-1 bg-surface rounded-2xl p-6 shadow-spotify-medium hover:shadow-spotify-heavy transition-all duration-200 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[10px] font-bold text-muted uppercase tracking-[0.1em]">Top Selling Products</h2>
                <Link to="/admin/products" className="text-muted hover:text-ink transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-col gap-4 flex-grow">
                {topProducts.map((product, idx) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-background/50 rounded-xl hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-muted">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider">{product.unitsSold} Units</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-semantic-success">{formatTZS(product.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
