import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton, SkeletonKPI } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { LazyChart, preloadRecharts } from '../../components/ui/LazyChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

export const OwnerDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    preloadRecharts();
    api.get('/restaurants/owner/mine')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (!Array.isArray(data)) { setLoading(false); return; }
        setRestaurants(data);
        if (data.length === 0) { setLoading(false); return; }
        // Fetch dashboard data from first restaurant
        return api.get(`/restaurants/${data[0]._id}/reports/dashboard`)
          .then((dash) => {
            const d = dash.data?.data || {};
            setMetrics({
              dailyRevenue: d.dailyRevenue || '—',
              activeOrders: d.activeOrders ?? '—',
              openIssues: d.openIssues ?? '—',
              pendingApprovals: d.pendingApprovals ?? '—',
            });
            if (d.revenueTrend) setRevenueData(d.revenueTrend);
          })
          .catch(() => {
            // Dashboard endpoint may not exist yet — show metrics from restaurant count
            setMetrics({
              dailyRevenue: '—',
              activeOrders: String(data.reduce((s: number, r: any) => s + (r.activeOrders || 0), 0)),
              openIssues: '—',
              pendingApprovals: '—',
            });
          });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in">
        <Skeleton width="200px" height="24px" />
        <SkeletonKPI />
        <Card className="p-6"><Skeleton width="180px" height="20px" /><div className="h-64 mt-4 bg-surface-container-high animate-pulse rounded-ui" /></Card>
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

  // Onboarding — no restaurants yet
  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-container/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffc081" strokeWidth="1.5">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M13 21V3l6 4v14"/><path d="M9 13h2"/><path d="M15 11h2"/>
            </svg>
          </div>
          <h2 className="text-headline-md text-on-surface font-bold">Welcome to Enagram, {String(user?.firstName || 'Owner')}</h2>
          <p className="text-body-md text-on-surface-variant/60">
            You haven't set up any restaurants yet. Create your first restaurant to start managing orders, staff, and operations.
          </p>
          <Button size="lg" className="px-8" onClick={() => navigate('/owner/restaurants/new')}>
            Set Up Your Restaurant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { title: 'Daily Revenue', value: metrics.dailyRevenue || '—', highlight: true },
          { title: 'Active Orders', value: metrics.activeOrders || '0', highlight: false },
          { title: 'Open Issues', value: metrics.openIssues || '0', highlight: false },
          { title: 'Pending Approvals', value: metrics.pendingApprovals || '0', highlight: false },
        ].map((m) => (
          <Card key={m.title} className={`p-5 ${m.highlight ? 'bg-gradient-to-br from-surface to-primary-container/5' : ''}`}>
            <span className="text-label-caps text-on-surface-variant/60 uppercase tracking-wider">{m.title}</span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-headline-lg text-on-surface font-bold">{m.value}</span>
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
              {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''} active
            </p>
          </div>
        </div>
        <div className="h-64">
          {revenueData.length > 0 ? (
            <LazyChart>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9800" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#FF9800" fill="url(#rg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </LazyChart>
          ) : (
            <div className="h-full flex items-center justify-center text-body-md text-on-surface-variant/30">
              Revenue data will appear once you start receiving orders.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
