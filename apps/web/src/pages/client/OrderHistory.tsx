import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import api from '../../api/axios';

export const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/client/me')
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => { /* noop */ })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-on-surface-variant">Loading orders...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Order History</h2>
        {orders.length > 0 && (
          <span className="text-body-sm text-on-surface-variant/60">{orders.length} order{orders.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-body-md text-on-surface-variant/60">No orders yet.</p>
          <p className="text-body-sm text-on-surface-variant/40 mt-1">Place your first order to see it here.</p>
        </Card>
      ) : (
        orders.map((order) => (
          <Link key={order._id} to={`/client/orders/${order._id}`}>
            <Card className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
              <div>
                <p className="text-body-md text-on-surface font-semibold">Order #{order._id?.slice(-6).toUpperCase()}</p>
                <p className="text-body-sm text-on-surface-variant/60">
                  {new Date(order.createdAt).toLocaleDateString()} · R{(order.total / 100).toFixed(2)} · {order.items?.length || 0} item(s)
                </p>
              </div>
              <StatusPill status={order.status} />
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};
