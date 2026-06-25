import { useState, useEffect } from 'react';
import { Calendar, DollarSign, ShoppingBag, TrendingUp, Download } from 'lucide-react';
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
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, []);

  const handleExportCSV = () => {
    if (!data.orders.length) return;
    const headers = ['Order Number', 'Date', 'Customer', 'Status', 'Payment Method', 'Total'];
    const rows = data.orders.map(o => [o.orderNumber, new Date(o.orderDate).toLocaleDateString(), o.userName, o.status, o.paymentMethod, o.totalAmount]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `sales_report_${dateRange.start}_to_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusData = () => {
    if (!data.orders?.length) return [];
    const counts = data.orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
  };

  // Ferrari-aligned chart colors
  const statusColors = {
    NEW: '#4c98b9',
    CONFIRMED: '#f6e500',
    DELIVERED: '#03904a',
    CANCELED: '#da291c',
  };

  const summaryCards = [
    { label: 'Total Revenue',    value: `TZS ${data.totalSales?.toLocaleString('en-US')}`,        icon: DollarSign,  accent: 'text-semantic-success' },
    { label: 'Total Orders',     value: data.totalOrders,                                          icon: ShoppingBag, accent: 'text-semantic-info'    },
    { label: 'Avg. Order Value', value: `TZS ${data.averageOrderValue?.toLocaleString('en-US')}`,  icon: TrendingUp,  accent: 'text-ink'              },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="section-label mb-2">Analytics</p>
          <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Sales & Reports</h1>
          <p className="text-body text-sm mt-2">Track revenue and order activity</p>
        </div>
        {!!data.orders.length && (
          <button onClick={handleExportCSV} className="btn-outline btn-sm">
            <Download size={14}/> Export CSV
          </button>
        )}
      </div>

      {/* Date Filter */}
      <div className="bg-canvas-elevated border border-hairline p-6 mb-8 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Start Date</label>
          <div className="relative">
            <Calendar size={13} className="absolute left-4 top-4 text-muted"/>
            <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="input pl-10"/>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label">End Date</label>
          <div className="relative">
            <Calendar size={13} className="absolute left-4 top-4 text-muted"/>
            <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="input pl-10"/>
          </div>
        </div>
        <button onClick={fetchReport} disabled={loading} className="btn-primary btn-sm min-w-[100px]">
          {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/> : 'Apply'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline mb-8">
        {summaryCards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="bg-canvas-elevated p-8 flex items-start gap-5 hover:bg-canvas transition-colors">
            <Icon className={`${accent} w-5 h-5 flex-shrink-0 mt-1`} />
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">{label}</p>
              <p className={`text-2xl font-medium ${accent} tracking-tight`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders by Status Chart */}
      <div className="bg-canvas-elevated border border-hairline p-6">
        <h2 className="text-sm font-medium text-ink uppercase tracking-[0.065em] mb-6">Orders by Status</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted text-xs uppercase tracking-[0.065em]">Loading...</div>
        ) : data.orders?.length ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={getStatusData()} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="value">
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#303030'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#303030', border: '1px solid #303030', borderRadius: 0, color: '#fff', fontSize: 12 }} itemStyle={{ color: '#969696' }}/>
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#969696', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{value}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted text-xs uppercase tracking-[0.065em]">No data for selected period.</div>
        )}
      </div>
    </div>
  );
}
