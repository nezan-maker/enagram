import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Skeleton, SkeletonKPI } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { LazyChart, preloadRecharts } from '../../components/ui/LazyChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

const mockRevenue = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 6000 },
  { name: 'Wed', revenue: 4500 },
  { name: 'Thu', revenue: 8000 },
  { name: 'Fri', revenue: 7000 },
  { name: 'Sat', revenue: 9500 },
  { name: 'Sun', revenue: 8500 },
];

export const OwnerDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ dailyRevenue: 'R 42,892', activeOrders: '184', openIssues: '04', pendingApprovals: '12' });
  const [revenueData, setRevenueData] = useState(mockRevenue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload recharts module in background
    preloadRecharts();
    Promise.all([
      api.get('/restaurants').then((res) => res.data.data),
      api.get('/restaurants').then((res) => {
        const data = res.data.data;
        if (Array.isArray(data) && data.length > 0) {
          return api.get(`/restaurants/${data[0]._id}/reports/dashboard`).then((r) => r.data.data).catch(() => null);
        }
        return null;
      }),
    ])
      .then(([restData, dashData]) => {
        if (Array.isArray(restData)) setRestaurants(restData);
        if (dashData) {
          setMetrics({
            dailyRevenue: dashData.dailyRevenue || metrics.dailyRevenue,
            activeOrders: dashData.activeOrders || metrics.activeOrders,
            openIssues: dashData.openIssues || metrics.openIssues,
            pendingApprovals: dashData.pendingApprovals || metrics.pendingApprovals,
          });
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in">
        <SkeletonKPI />
        <Card className="p-6">
          <Skeleton width="180px" height="20px" />
          <div className="h-64 mt-4 bg-surface-container-high animate-pulse rounded-ui" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load dashboard"
        description="We couldn't fetch your restaurant data. Check your connection and try again."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Metric Tiles — staggered entry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { title: 'Daily Revenue', value: metrics.dailyRevenue, delta: '+12.4%', highlight: true },
          { title: 'Active Orders', value: metrics.activeOrders, delta: '+5.2%', highlight: false },
          { title: 'Open Issues', value: metrics.openIssues, delta: '-2.1%', highlight: false },
          { title: 'Pending Approvals', value: metrics.pendingApprovals, delta: 'Needs Action', highlight: false },
        ].map((m) => (
          <Card key={m.title} className={`p-5 ${m.highlight ? 'bg-gradient-to-br from-[#1b1b1c] to-[rgba(255,152,0,0.04)]' : ''}`}>
            <span className="text-label-caps text-on-surface-variant/60 uppercase tracking-wider">{m.title}</span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-headline-lg text-on-surface font-bold">{m.value}</span>
              <span className={`text-label-sm font-semibold ${
                m.delta.startsWith('+') ? 'text-success' :
                m.delta.startsWith('-') ? 'text-error' :
                'text-primary-container'
              }`}>
                {m.delta}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-body-lg text-on-surface font-bold">Revenue Trend</h3>
            <p className="text-label-caps text-on-surface-variant/60 mt-1">
              {restaurants.length > 0 ? `${restaurants.length} restaurant${restaurants.length > 1 ? 's' : ''} active` : 'Aggregated across all locations'}
            </p>
          </div>
          <span className="text-label-caps text-on-surface-variant/40">Last 7 days</span>
        </div>
        <div className="h-64">
          <LazyChart>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9800" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="revenue" stroke="#FF9800" fill="url(#revenueGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          </LazyChart>
        </div>
      </Card>
    </div>
  );
};
