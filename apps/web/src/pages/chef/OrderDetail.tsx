import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../api/axios';

export const ChefOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    if (!id) return;
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data?.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const updateItemStatus = async (idx: number, status: string) => {
    // Update individual item status via order update
    const updatedItems = [...(order.items || [])];
    updatedItems[idx] = { ...updatedItems[idx], status };
    await api.patch(`/orders/${id}/status`, { items: updatedItems, status: order.status }).catch(() => {});
    fetchOrder();
  };

  const updateOrderStatus = async (status: string) => {
    await api.patch(`/orders/${id}/status`, { status }).catch(() => {});
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
        </div>
        <span className={`px-3 py-1 rounded-full text-label-sm font-medium ${
          order.status === 'PREPARING' ? 'bg-warning/20 text-warning' :
          order.status === 'READY' ? 'bg-success/20 text-success' :
          'bg-surface-container-high text-on-surface'
        }`}>{order.status}</span>
      </div>

      <Card className="p-5">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Items</h3>
        <div className="space-y-3">
          {(order.items || []).map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-surface-container rounded-lg">
              <div>
                <p className="text-body-md text-on-surface font-medium">{item.name}</p>
                <p className="text-label-sm text-on-surface-variant">Qty: {item.quantity} · {item.notes ? `Note: ${item.notes}` : ''}</p>
              </div>
              <div className="flex gap-2">
                {item.status === 'PENDING' && (
                  <Button size="sm" onClick={() => updateItemStatus(idx, 'PREPARING')}>Start</Button>
                )}
                {item.status === 'PREPARING' && (
                  <Button size="sm" variant="secondary" onClick={() => updateItemStatus(idx, 'READY')}>Mark Ready</Button>
                )}
                <span className={`px-2 py-1 rounded text-label-xs ${
                  item.status === 'READY' ? 'bg-success/20 text-success' :
                  item.status === 'PREPARING' ? 'bg-warning/20 text-warning' :
                  'bg-surface-container-high text-on-surface-variant'
                }`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {order.status === 'PREPARING' && (
        <Button onClick={() => updateOrderStatus('READY')} className="w-full">
          Mark Order as Ready
        </Button>
      )}
    </div>
  );
};
