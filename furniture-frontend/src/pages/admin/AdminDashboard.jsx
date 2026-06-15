import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, TrendingUp, CheckCircle, Truck, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { getDashboardStats, getSalesReport, getSalesTrend } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
const [chartData, setChartData] = useState([]);
const [chartLoading, setChartLoading] = useState(true);
const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

useEffect(() => {
  const { start, end } = dateRange;
  if (!start || !end) return;
  setChartLoading(true);
  getSalesReport(start, end)
    .then(r => {
      setChartData(r.data);
    })
    .catch(() => setChartData([]))
    .finally(() => setChartLoading(false));
}, [dateRange]);

  const cards = stats ? [
    { label: 'New Orders', value: stats.totalNewOrders, icon: ShoppingBag, color: 'from-blue-700 to-blue-900', textColor: 'text-blue-300' },
    { label: 'Confirmed', value: stats.totalConfirmedOrders, icon: CheckCircle, color: 'from-amber-700 to-amber-900', textColor: 'text-amber-300' },
    { label: 'Delivered', value: stats.totalDeliveredOrders, icon: Truck, color: 'from-green-700 to-green-900', textColor: 'text-green-300' },
    { label: 'Canceled', value: stats.totalCanceledOrders, icon: XCircle, color: 'from-red-700 to-red-900', textColor: 'text-red-300' },
    { label: 'Total Orders', value: stats.totalOrders, icon: TrendingUp, color: 'from-purple-700 to-purple-900', textColor: 'text-purple-300' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'from-primary-700 to-primary-900', textColor: 'text-primary-300' },
    { label: 'Customers', value: stats.totalRegisteredUsers, icon: Users, color: 'from-pink-700 to-pink-900', textColor: 'text-pink-300' },
  ] : [];

const handleDateChange = (e) => {
  const { name, value } = e.target;
  setDateRange(prev => ({ ...prev, [name]: value }));
};

  return (
  <div className="animate-fade-in">
    <div className="mb-8">
      <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
      <p className="text-gray-400 mt-1">Overview of your store performance</p>
    </div>

    {loading ? (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-dark-700" />)}
      </div>
    ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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
    )}

    {/* Sales Trend Chart */}
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">Sales Trend</h2>
      <div className="flex items-center gap-4 mb-4">
        <input type="date" name="start" value={dateRange.start} onChange={handleDateChange} className="rounded px-2 py-1" />
        <span className="text-gray-300">to</span>
        <input type="date" name="end" value={dateRange.end} onChange={handleDateChange} className="rounded px-2 py-1" />
      </div>
      {chartLoading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
      ) : chartData.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Sales" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400">No data for selected period.</p>
      )}
    </div>
  </div>
);
}
