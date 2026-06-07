import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonKPI } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

export const ClientDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/client/me')
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setRecentOrders(data.slice(0, 5));
        const favCount = Array.isArray(user?.favouriteRestaurants) ? user.favouriteRestaurants.length : 0;
        setFavouriteCount(favCount);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = recentOrders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status));

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="200px" height="24px" />
        <SkeletonKPI />
        <Skeleton width="140px" height="20px" />
        <Skeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h2 className="text-headline-md text-on-surface font-bold">My Dashboard</h2>
        <p className="text-body-md text-on-surface-variant/60 mt-1">Welcome back, {String(user?.firstName || 'Guest')}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <Card className="p-5">
          <span className="text-label-caps text-on-surface-variant/60">Active Orders</span>
          <p className="text-headline-lg text-on-surface font-bold mt-1">{activeOrders.length}</p>
        </Card>
        <Card className="p-5">
          <span className="text-label-caps text-on-surface-variant/60">Favourite Restaurants</span>
          <p className="text-headline-lg text-on-surface font-bold mt-1">{favouriteCount}</p>
        </Card>
        <Card className="p-5">
          <span className="text-label-caps text-on-surface-variant/60">Total Orders</span>
          <p className="text-headline-lg text-on-surface font-bold mt-1">{recentOrders.length}</p>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-headline-sm text-on-surface font-semibold">Recent Orders</h3>
          <Link to="/client/orders" className="text-label-sm text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Browse restaurants and place your first order."
            actionLabel="Browse Restaurants"
            actionTo="/"
            variant="default"
          />
        ) : (
          <div className="space-y-2 stagger-children">
            {recentOrders.map((order) => (
              <Link key={order._id} to={`/client/orders/${order._id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-container">
                <Card interactive className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-body-md text-on-surface font-medium">#{order._id?.slice(-6).toUpperCase()}</p>
                    <p className="text-body-sm text-on-surface-variant/60">R{(order.total / 100).toFixed(2)} · {order.items?.length} items</p>
                  </div>
                  <StatusPill status={order.status} />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
