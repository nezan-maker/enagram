import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonKPI } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

export const KitchenDashboard = () => {
  const { restaurantId } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ activeTickets: 0, avgWait: '—', delayed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    api.get(`/orders/restaurant/${restaurantId}`)
      .then((res) => {
        const all = res.data?.data || [];
        const active = all.filter((o: any) => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status));
        setOrders(active);
        const delayed = active.filter((o: any) => o.status === 'PENDING' && Date.now() - new Date(o.createdAt).getTime() > 15 * 60 * 1000);
        const waitTimes = active.map((o: any) => Date.now() - new Date(o.createdAt).getTime());
        const avg = waitTimes.length ? Math.round(waitTimes.reduce((a: number, b: number) => a + b, 0) / waitTimes.length / 60000 * 10) / 10 : 0;
        setMetrics({ activeTickets: active.length, avgWait: `${avg}m`, delayed: delayed.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="180px" height="28px" />
        <SkeletonKPI />
        <Skeleton lines={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-headline-md text-on-surface font-bold">Kitchen Operations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <KPICard title="Active Tickets" value={String(metrics.activeTickets)} subtitle="In progress" />
        <KPICard title="Avg Wait Time" value={metrics.avgWait} subtitle="Target: 20m" />
        <KPICard title="Items Delayed" value={String(metrics.delayed)} trend={{ value: '> 15 min', positive: false }} />
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-headline-sm text-on-surface font-semibold">Active Orders</h3>
          <span className="text-label-caps text-on-surface-variant/60">{orders.length} ticket{orders.length !== 1 ? 's' : ''}</span>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            title="No active tickets"
            description="Orders will appear here for the kitchen to prepare."
            variant="default"
          />
        ) : (
          <div className="space-y-2 stagger-children">
            {orders.slice(0, 10).map((order: any) => (
              <Card key={order._id} interactive className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-on-surface">Order #{order._id?.slice(-6)}</p>
                  <p className="text-label-sm text-on-surface-variant/60">{order.items?.length || 0} items · {order.type}</p>
                </div>
                <StatusPill status={order.status} />
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
