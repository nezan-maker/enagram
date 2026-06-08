import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonKPI } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';
import { tableApi } from '../../api/table.api';

export const WaiterBoard = () => {
  const { restaurantId } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    Promise.all([
      api.get(`/orders/restaurant/${restaurantId}`).then((res) => res.data?.data || []).catch(() => []),
      tableApi.list(restaurantId).then((res) => res.data?.data || []).catch(() => []),
    ]).then(([orderData, tableData]) => {
      if (Array.isArray(orderData)) setOrders(orderData);
      if (Array.isArray(tableData)) setTables(tableData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [restaurantId]);

  const activeOrders = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status));

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex justify-between items-center">
          <Skeleton width="160px" height="28px" />
          <Skeleton width="120px" height="40px" />
        </div>
        <SkeletonKPI />
        <Skeleton lines={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <h2 className="text-headline-md text-on-surface font-bold">Waiter Board</h2>
        <Button onClick={() => navigate('/staff/waiter/order/new')}>New Order</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Orders */}
        <Card className="p-5 col-span-full lg:col-span-2">
          <h3 className="text-headline-sm text-on-surface font-semibold mb-1">Active Orders</h3>
          <p className="text-label-caps text-on-surface-variant/60 mb-3">{activeOrders.length} in progress</p>
          {activeOrders.length === 0 ? (
            <p className="text-body-md text-on-surface-variant/50 py-4 text-center">No active orders</p>
          ) : (
            <div className="space-y-2 stagger-children">
              {activeOrders.slice(0, 10).map((order: any) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center p-3 bg-surface-container rounded-ui cursor-pointer hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                  onClick={() => navigate(`/staff/waiter/orders/${order._id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <p className="font-semibold text-on-surface">Table {order.tableId?.slice(-4) || '—'} · #{order._id?.slice(-6)}</p>
                    <p className="text-label-sm text-on-surface-variant/60">R {order.total?.toFixed(2)} · {order.items?.length || 0} items</p>
                  </div>
                  <StatusPill status={order.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tables */}
        <Card className="p-5">
          <h3 className="text-headline-sm text-on-surface font-semibold mb-1">Tables</h3>
          <p className="text-label-caps text-on-surface-variant/60 mb-3">{tables.length} configured</p>
          {tables.length === 0 ? (
            <p className="text-body-md text-on-surface-variant/50 py-4 text-center">No tables</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {tables.map((t: any) => (
                <div
                  key={t._id}
                  className={`p-3 rounded-ui text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                    t.status === 'OCCUPIED' ? 'bg-primary-container/10 text-primary-container' :
                    t.status === 'RESERVED' ? 'bg-primary/10 text-primary' :
                    'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                  onClick={() => navigate(`/staff/waiter/order/new?table=${t._id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <p className="font-semibold">{t.tableNumber}</p>
                  <p className="text-label-xs">{t.capacity} seats</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
