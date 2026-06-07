import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';
import { menuApi } from '../../api/menu.api';
import { orderApi } from '../../api/order.api';

export const PlaceOrder = () => {
  const { restaurantId } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table');

  const [menus, setMenus] = useState<any[]>([]);
  const [items, setItems] = useState<Array<{ menuItemId: string; name: string; price: number; quantity: number; notes?: string }>>([]);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'DELIVERY'>('DINE_IN');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    menuApi.list(restaurantId).then((res) => {
      setMenus(res.data?.data || []);
    }).catch(() => {});
  }, [restaurantId]);

  const addItem = (menuItem: any) => {
    setItems([...items, { menuItemId: menuItem._id || menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateQty = (idx: number, delta: number) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], quantity: Math.max(1, updated[idx].quantity + delta) };
    setItems(updated);
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.085 * 100) / 100;
  const total = subtotal + tax;

  const submitOrder = async () => {
    if (!restaurantId || items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await orderApi.create({
        restaurantId,
        tableId: tableId || undefined,
        type: orderType,
        items: items.map((i) => ({ menuItemId: i.menuItemId, name: i.name, price: i.price, quantity: i.quantity, notes: i.notes })),
        subtotal, tax, total,
      });
      const orderId = res.data?.data?._id;
      if (orderId) navigate(`/staff/waiter/orders/${orderId}`);
    } catch (e) {
      console.error('Order failed:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-headline-md text-on-surface font-bold">New Order {tableId ? `— Table Selected` : ''}</h2>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-on-surface">
          <input type="radio" checked={orderType === 'DINE_IN'} onChange={() => setOrderType('DINE_IN')} />
          Dine In
        </label>
        <label className="flex items-center gap-2 text-on-surface">
          <input type="radio" checked={orderType === 'DELIVERY'} onChange={() => setOrderType('DELIVERY')} />
          Delivery
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Items */}
        <Card className="p-5">
          <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Menu</h3>
          {menus.length === 0 && <p className="text-on-surface-variant">No menus available</p>}
          {menus.map((menu: any) => (
            <div key={menu._id} className="mb-4">
              <h4 className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide mb-2">{menu.name}</h4>
              <div className="space-y-2">
                {(menu.items || []).map((item: any) => (
                  <div key={item._id} className="flex justify-between items-center p-2 rounded hover:bg-surface-container">
                    <div>
                      <p className="text-body-md text-on-surface">{item.name}</p>
                      <p className="text-label-xs text-on-surface-variant">{item.category} · R {item.price?.toFixed(2)}</p>
                    </div>
                    <Button size="sm" onClick={() => addItem(item)}>+ Add</Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>

        {/* Cart */}
        <Card className="p-5">
          <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Order Items ({items.length})</h3>
          {items.length === 0 && <p className="text-on-surface-variant">No items added yet</p>}
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-surface-container rounded">
                <div className="flex-1">
                  <p className="text-body-sm text-on-surface">{item.name}</p>
                  <p className="text-label-xs text-on-surface-variant">R {item.price?.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 rounded bg-surface-container-high text-on-surface" onClick={() => updateQty(idx, -1)}>−</button>
                  <span className="text-body-sm text-on-surface w-6 text-center">{item.quantity}</span>
                  <button className="w-6 h-6 rounded bg-surface-container-high text-on-surface" onClick={() => updateQty(idx, 1)}>+</button>
                  <button className="ml-2 text-on-surface-variant hover:text-error text-label-sm" onClick={() => removeItem(idx)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-label-sm text-on-surface-variant">
              <span>Subtotal</span><span>R {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-label-sm text-on-surface-variant">
              <span>Tax (8.5%)</span><span>R {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-body-md font-semibold text-on-surface">
              <span>Total</span><span>R {total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={submitOrder} disabled={items.length === 0 || submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Card>
      </div>
    </div>
  );
};
