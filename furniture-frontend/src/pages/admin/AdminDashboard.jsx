import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, TrendingUp, CheckCircle, Truck, XCircle } from 'lucide-react';
import { getDashboardStats } from '../../services/api';

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      )}
    </div>
  );
}
