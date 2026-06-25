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
      const allProducts = productsRes.data.content || productsRes.data || [];

      const productStats = {};
      allProducts.forEach(p => {
        productStats[p.id] = {
          id: p.id, name: p.name,
          category: p.category?.name || p.categoryName || 'Uncategorized',
          quantitySold: 0, revenue: 0
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
                id: item.productId, name: item.productName,
                category: 'Unknown', quantitySold: item.quantity, revenue: item.subTotal
              };
            }
          });
        }
      });

      const statsArray = Object.values(productStats);
      statsArray.sort((a, b) => b.quantitySold - a.quantitySold);

      setTopProducts(statsArray.filter(p => p.quantitySold > 0).slice(0, 10));
      setBottomProducts([...statsArray].sort((a, b) => a.quantitySold - b.quantitySold).slice(0, 10));
    } catch (err) {
      console.error(err);
      setTopProducts([]); setBottomProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrends(); }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <p className="section-label mb-2">Analytics</p>
        <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Product Trends</h1>
        <p className="text-body text-sm mt-2">Discover which furniture is in high vs low demand</p>
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
        <button onClick={fetchTrends} disabled={loading} className="btn-primary btn-sm min-w-[100px]">
          {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/> : 'Apply'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-hairline border border-hairline">
        {/* Top Trending */}
        <div className="bg-canvas-elevated">
          <div className="px-6 py-5 border-b border-hairline flex items-center gap-3">
            <TrendingUp size={16} className="text-semantic-success"/>
            <h3 className="font-medium text-ink text-sm uppercase tracking-[0.065em]">Top Trending</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <span className="animate-spin rounded-full h-6 w-6 border-2 border-semantic-success border-t-transparent"/>
              </div>
            ) : topProducts.length ? (
              <div className="space-y-px bg-hairline border border-hairline">
                {topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between bg-canvas px-4 py-4 hover:bg-canvas-elevated transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-muted w-6 text-right">#{i + 1}</span>
                      <div>
                        <p className="font-medium text-ink text-sm">{product.name}</p>
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><Package size={10}/> {product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-semantic-success font-medium text-sm">{product.quantitySold} <span className="text-xs font-normal text-muted">sold</span></p>
                      <p className="text-xs text-muted mt-0.5">TZS {product.revenue.toLocaleString('en-US')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted text-xs uppercase tracking-[0.065em]">No sales recorded in this period.</div>
            )}
          </div>
        </div>

        {/* Low Demand */}
        <div className="bg-canvas-elevated">
          <div className="px-6 py-5 border-b border-hairline flex items-center gap-3">
            <TrendingDown size={16} className="text-semantic-warning"/>
            <h3 className="font-medium text-ink text-sm uppercase tracking-[0.065em]">Low Demand</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <span className="animate-spin rounded-full h-6 w-6 border-2 border-semantic-warning border-t-transparent"/>
              </div>
            ) : bottomProducts.length ? (
              <div className="space-y-px bg-hairline border border-hairline">
                {bottomProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-canvas px-4 py-4 hover:bg-canvas-elevated transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-semantic-warning">!</span>
                      <div>
                        <p className="font-medium text-ink text-sm">{product.name}</p>
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><Package size={10}/> {product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-semantic-warning font-medium text-sm">{product.quantitySold} <span className="text-xs font-normal text-muted">sold</span></p>
                      {product.revenue > 0 && <p className="text-xs text-muted mt-0.5">TZS {product.revenue.toLocaleString('en-US')}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted text-xs uppercase tracking-[0.065em]">No products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
