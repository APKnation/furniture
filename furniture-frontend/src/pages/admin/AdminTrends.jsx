import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { getSalesTrend } from '../../services/api';

export default function AdminTrends() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchTrend = async () => {
    setChartLoading(true);
    try {
      const res = await getSalesTrend(dateRange.start, dateRange.end);
      setChartData(res.data);
    } catch {
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchTrend();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Sales Trends</h1>
          <p className="text-gray-400 text-sm mt-0.5">Visualize your revenue growth over time</p>
        </div>
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
        <button onClick={fetchTrend} disabled={chartLoading} className="btn-primary px-8 justify-center min-w-[120px]">
          {chartLoading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : 'Apply'}
        </button>
      </div>

      {/* Sales Trend Chart */}
      <div className="card p-5 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Sales Trend</h2>
        {chartLoading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
        ) : chartData.length ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}
                  itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">No data for selected period.</div>
        )}
      </div>
    </div>
  );
}
