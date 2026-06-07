import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import api from '../../api/axios';

const statusSteps = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED'];

export const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-on-surface-variant">Loading order...</div>;
  if (error) return <div className="text-center py-12 text-error">{error}</div>;
  if (!order) return <div className="text-center py-12 text-on-surface-variant">Order not found</div>;

  const currentStep = statusSteps.indexOf(order.status);
  const items = order.items || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-headline-md text-on-surface font-bold">Order #{id?.slice(-6).toUpperCase()}</h2>
            <p className="text-body-sm text-on-surface-variant/60">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusPill status={order.status} />
        </div>
        <div className="text-body-md text-on-surface-variant/60">
          {order.type === 'DINE_IN' ? 'Dine-in' : 'Delivery'} · {order.items?.length || 0} item(s) · R{order.total?.toFixed(2)}
        </div>
      </Card>

      {/* Status Tracker */}
      <Card className="p-6">
        <h3 className="text-label-caps text-on-surface-variant/60 mb-4 uppercase tracking-wider">Order Progress</h3>
        <div className="flex items-center gap-1">
          {statusSteps.map((step, i) => {
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isActive ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface-variant/40'
                } ${isCurrent ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-surface' : ''}`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 text-center leading-tight ${
                  isActive ? 'text-on-surface' : 'text-on-surface-variant/40'
                }`}>{step}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-6">
        <h3 className="text-label-caps text-on-surface-variant/60 mb-4 uppercase tracking-wider">Items</h3>
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-on-surface-variant/60 font-medium">{item.quantity}×</span>
                <div>
                  <span className="text-body-md text-on-surface">{item.name}</span>
                  {item.notes && <p className="text-body-sm text-on-surface-variant/60">{item.notes}</p>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-body-md text-on-surface font-medium">R{(item.price * item.quantity / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
          <div className="flex justify-between text-body-sm text-on-surface-variant/60">
            <span>Subtotal</span><span>R{(order.subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-body-sm text-on-surface-variant/60">
            <span>Tax (8.5%)</span><span>R{(order.tax / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-body-md text-on-surface font-bold pt-1">
            <span>Total</span><span>R{(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Payment Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant/60 uppercase tracking-wider">Payment</span>
          <span className={`text-body-md font-semibold ${order.paymentStatus === 'PAID' ? 'text-success' : 'text-primary-container'}`}>
            {order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
          </span>
        </div>
        {order.paymentMethod && (
          <p className="text-body-sm text-on-surface-variant/60 mt-1">via {order.paymentMethod}</p>
        )}
      </Card>
    </div>
  );
};
