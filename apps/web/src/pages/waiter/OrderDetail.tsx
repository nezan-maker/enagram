import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { orderApi } from '../../api/order.api';

export const WaiterOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    if (!id) return;
    orderApi.getById(id).then((res) => {
      setOrder(res.data?.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const markPaid = async () => {
    if (!id) return;
    await orderApi.markPaid(id).catch(() => {});
    fetchOrder();
  };

  const updateStatus = async (status: string) => {
    if (!id) return;
    await orderApi.updateStatus(id, status).catch(() => {});
    fetchOrder();
  };

  if (loading) return <div className="p-6 text-on-surface">Loading order...</div>;
  if (!order) return <div className="p-6 text-on-surface">Order not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md text-on-surface font-bold">Order #{order._id?.slice(-6)}</h2>
          <p className="text-label-sm text-on-surface-variant">{order.type} · {new Date(order.createdAt).toLocaleString()}</p>
          {order.tableId && <p className="text-label-sm text-on-surface-variant">Table: {order.tableId}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-label-sm font-medium ${
            order.status === 'COMPLETED' ? 'bg-success/20 text-success' :
            order.status === 'CANCELLED' ? 'bg-error/20 text-error' :
            order.status === 'READY' ? 'bg-success/20 text-success' :
            'bg-warning/20 text-warning'
          }`}>{order.status}</span>
          <span className={`px-3 py-1 rounded-full text-label-sm ${
            order.paymentStatus === 'PAID' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
          }`}>{order.paymentStatus}</span>
        </div>
      </div>

      <Card className="p-5">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Items</h3>
        <div className="space-y-2">
          {(order.items || []).map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between p-3 bg-surface-container rounded-lg">
              <div>
                <p className="text-body-md text-on-surface font-medium">{item.quantity}x {item.name}</p>
                {item.notes && <p className="text-label-xs text-on-surface-variant">Note: {item.notes}</p>}
              </div>
              <div className="text-right">
                <p className="text-body-sm text-on-surface">R {(item.price * item.quantity).toFixed(2)}</p>
                <span className={`text-label-xs ${item.status === 'READY' ? 'text-success' : 'text-on-surface-variant'}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="space-y-1">
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>Subtotal</span><span>R {order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>Tax</span><span>R {order.tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-body-md font-semibold text-on-surface border-t border-outline pt-2 mt-2">
            <span>Total</span><span>R {order.total?.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3 flex-wrap">
        {order.status === 'PENDING' && (
          <Button onClick={() => updateStatus('CONFIRMED')}>Confirm Order</Button>
        )}
        {order.status === 'CONFIRMED' && (
          <Button onClick={() => updateStatus('PREPARING')}>Send to Kitchen</Button>
        )}
        {order.status === 'READY' && (
          <>
            <Button variant="secondary" onClick={() => updateStatus('DELIVERED')}>Mark Delivered</Button>
            <Button onClick={() => updateStatus('COMPLETED')}>Complete Order</Button>
          </>
        )}
        {order.paymentStatus === 'PENDING' && order.status !== 'CANCELLED' && (
          <Button variant="secondary" onClick={markPaid}>Mark as Paid</Button>
        )}
        {['PENDING', 'CONFIRMED'].includes(order.status) && (
          <Button onClick={() => updateStatus('CANCELLED')}>Cancel Order</Button>
        )}
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
};
