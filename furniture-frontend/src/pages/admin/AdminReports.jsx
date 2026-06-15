import { useState, useEffect } from 'react';
import { Calendar, DollarSign, ShoppingBag, TrendingUp, Download, Eye, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getSalesReport } from '../../services/api';

export default function AdminReports() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
  const [data, setData] = useState({ orders: [], totalOrders: 0, totalSales: 0, averageOrderValue: 0 });
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await getSalesReport(dateRange.start, dateRange.end);
      setData(res.data);
    } catch {
      setData({ orders: [], totalOrders: 0, totalSales: 0, averageOrderValue: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExportCSV = () => {
    if (!data.orders.length) return;
    const headers = ['Order Number', 'Date', 'Customer', 'Status', 'Payment Method', 'Total'];
    const rows = data.orders.map(o => [
      o.orderNumber,
      new Date(o.orderDate).toLocaleDateString(),
      o.userName,
      o.status,
      o.paymentMethod,
      o.totalAmount
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${dateRange.start}_to_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusData = () => {
    if (!data.orders || !data.orders.length) return [];
    const statusCounts = data.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  };

  const statusColors = {
    NEW: '#3B82F6',       // Blue
    CONFIRMED: '#F59E0B', // Amber
    DELIVERED: '#10B981', // Green
    CANCELED: '#EF4444',  // Red
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Sales & Analytical Reports</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track revenue and order logs</p>
        </div>
        {!!data.orders.length && (
          <button onClick={handleExportCSV} className="btn-secondary btn-sm gap-2">
            <Download size={14}/> Export CSV
          </button>
        )}
      </div>

      {/* Date Filter Bar */}
      <div className="card p-5 mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Start Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
            <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="input pl-10"/>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label">End Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
            <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="input pl-10"/>
          </div>
        </div>
        <button onClick={fetchReport} disabled={loading} className="btn-primary px-8 justify-center min-w-[120px]">
          {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : 'Apply'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="stat-card">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center text-white shadow-lg">
            <DollarSign size={20}/>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">{`TZS ${data.totalSales?.toLocaleString('en-US')}`}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white shadow-lg">
            <ShoppingBag size={20}/>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-blue-400">{data.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white shadow-lg">
            <TrendingUp size={20}/>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Avg. Order Value</p>
            <p className="text-2xl font-bold text-purple-400">{`TZS ${data.averageOrderValue?.toLocaleString('en-US')}`}</p>
          </div>
        </div>
      </div>


      {/* Orders by Status Chart */}
      <div className="card p-5 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Orders by Status</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
        ) : data.orders?.length ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}
                    itemStyle={{ color: '#111827' }}
                  />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">No data for selected period.</div>
        )}
      </div>
    </div>
  );
}
