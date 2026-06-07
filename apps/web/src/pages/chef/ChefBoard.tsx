import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonKPI, SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const ChefBoard = () => {
  const { restaurantId } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('PREPARING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    api.get(`/orders/restaurant/${restaurantId}`).then((res) => {
      setOrders(res.data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [restaurantId]);

  const filtered = orders.filter((o) => !filter || o.status === filter);
  const totalQueued = orders.filter((o) => o.status === 'PENDING').reduce((s: number, o: any) => s + (o.items?.length || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="130px" height="28px" />
        <SkeletonKPI />
        <SkeletonTable rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <h2 className="text-headline-md text-on-surface font-bold">Chef Board</h2>
        <div className="flex gap-1 bg-surface-container-low rounded-ui p-1">
          {['PENDING', 'PREPARING', 'READY'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-ui text-label-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                filter === s ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-primary-container/8">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
          <span className="text-label-caps text-on-surface-variant/60">Items in Queue</span>
          <span className="text-headline-lg text-on-surface font-bold ml-auto">{totalQueued}</span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${filter.toLowerCase()} orders`}
          description="Orders will appear here as they come in."
          variant="default"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {filtered.map((order: any) => (
            <Card key={order._id} interactive className="p-5" onClick={() => window.location.href = `/staff/chef/orders/${order._id}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-on-surface">Order #{order._id?.slice(-6)}</p>
                  <p className="text-label-sm text-on-surface-variant/60">{order.type} · {order.items?.length || 0} items</p>
                  <p className="text-label-xs text-on-surface-variant/40 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <StatusPill status={order.status} />
              </div>
              <div className="mt-3 space-y-1">
                {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-label-sm">
                    <span className="text-on-surface">{item.quantity}x {item.name}</span>
                    <StatusPill status={item.status || 'PENDING'} />
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && <p className="text-label-xs text-primary-container">+{order.items.length - 3} more</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
