import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { getSalesReport, getProducts } from '../../services/api';

export default function AdminTrends() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const [bottomProducts, setBottomProducts] = useState([]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const [reportRes, productsRes] = await Promise.all([
        getSalesReport(dateRange.start, dateRange.end),
        getProducts() 
      ]);
      
      const orders = reportRes.data.orders || [];
      // getProducts returns either array directly or a paginated object depending on backend
      // Assuming array or .content for Spring Data Page
      const allProducts = productsRes.data.content || productsRes.data || [];

      const productStats = {};
      
      allProducts.forEach(p => {
        productStats[p.id] = {
          id: p.id,
          name: p.name,
          category: p.category?.name || p.categoryName || 'Uncategorized',
          quantitySold: 0,
          revenue: 0
        };
      });

      orders.forEach(order => {
        if (order.status !== 'CANCELED' && order.items) {
          order.items.forEach(item => {
            if (productStats[item.productId]) {
              productStats[item.productId].quantitySold += item.quantity;
              productStats[item.productId].revenue += item.subTotal;
            } else {
               productStats[item.productId] = {
                 id: item.productId,
                 name: item.productName,
                 category: 'Unknown',
                 quantitySold: item.quantity,
                 revenue: item.subTotal
               };
            }
          });
        }
      });

      const statsArray = Object.values(productStats);
      statsArray.sort((a, b) => b.quantitySold - a.quantitySold);

      const top = statsArray.filter(p => p.quantitySold > 0).slice(0, 10);
      const bottom = [...statsArray].sort((a, b) => a.quantitySold - b.quantitySold).slice(0, 10);

      setTopProducts(top);
      setBottomProducts(bottom);
      
    } catch (err) {
      console.error(err);
      setTopProducts([]);
      setBottomProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Product Trends</h1>
          <p className="text-gray-400 text-sm mt-0.5">Discover which furniture is in high vs low demand</p>
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
        <button onClick={fetchTrends} disabled={loading} className="btn-primary px-8 justify-center min-w-[120px]">
          {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : 'Apply'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Top Trending Table */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-dark-600 flex justify-between items-center bg-dark-700/30">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400"/> Top Trending Furniture
            </h3>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"/></div>
            ) : topProducts.length ? (
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 border border-dark-600">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center text-green-400 font-bold text-sm">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Package size={12}/> {product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">{product.quantitySold} <span className="text-xs font-normal text-gray-500">sold</span></p>
                      <p className="text-xs text-gray-400">TZS {product.revenue.toLocaleString('en-US')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No sales recorded in this period.</div>
            )}
          </div>
        </div>

        {/* Low Demand Table */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-dark-600 flex justify-between items-center bg-dark-700/30">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingDown size={18} className="text-red-400"/> Low Demand Furniture
            </h3>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"/></div>
            ) : bottomProducts.length ? (
              <div className="space-y-4">
                {bottomProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 border border-dark-600">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center text-red-400 font-bold text-sm">
                        !
                      </div>
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Package size={12}/> {product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold text-lg">{product.quantitySold} <span className="text-xs font-normal text-gray-500">sold</span></p>
                      {product.revenue > 0 && <p className="text-xs text-gray-400">TZS {product.revenue.toLocaleString('en-US')}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
