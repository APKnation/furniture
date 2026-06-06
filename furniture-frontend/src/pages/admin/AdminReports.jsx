import { useState, useEffect } from 'react';
import { Calendar, DollarSign, ShoppingBag, TrendingUp, Download, Eye, FileText } from 'lucide-react';
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

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-dark-600 flex justify-between items-center">
          <h3 className="font-semibold text-white flex items-center gap-2"><FileText size={17} className="text-primary-400"/> Order Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-dark-600 bg-dark-700/50">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Order Number</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Date</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Customer</th>
                <th className="text-center px-5 py-3.5 text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Payment</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse"/></td></tr>)
              ) : data.orders?.map(o => (
                <tr key={o.id} className="border-b border-dark-600/50 table-row-hover">
                  <td className="px-5 py-4 font-semibold text-white">{o.orderNumber}</td>
                  <td className="px-5 py-4 text-gray-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-medium text-white">{o.userName}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`badge ${
                      o.status === 'DELIVERED' ? 'bg-green-950 text-green-400 border-green-800' :
                      o.status === 'CANCELED' ? 'bg-red-950 text-red-400 border-red-800' :
                      o.status === 'CONFIRMED' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-blue-950 text-blue-400 border-blue-800'
                    } border text-xs`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{o.paymentMethod}</td>
                  <td className="px-5 py-4 text-right text-primary-400 font-bold">{`TZS ${o.totalAmount?.toLocaleString('en-US')}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !data.orders?.length && (
          <div className="text-center py-16 text-gray-500">No transactions recorded in this period.</div>
        )}
      </div>
    </div>
  );
}
