import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/auth.store';
import { restaurantApi } from '../../api/restaurant.api';

export const StaffOverview = () => {
  const { restaurantId } = useAuthStore();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    if (!restaurantId) return;
    restaurantApi.getById(restaurantId).then((res) => {
      setRestaurantName(res.data?.data?.name || '');
    }).catch(() => {});
    restaurantApi.getStaff(restaurantId).then((res) => {
      setStaff(res.data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [restaurantId]);

  const roleCount = (role: string) => staff.filter((s) => s.role === role).length;

  if (loading) return <div className="p-6 text-on-surface">Loading staff...</div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-headline-md text-on-surface font-bold">Staff Overview {restaurantName && `— ${restaurantName}`}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { role: 'KITCHEN_MANAGER', label: 'Kitchen Managers', color: 'bg-primary/20 text-primary' },
          { role: 'CHEF', label: 'Chefs', color: 'bg-warning/20 text-warning' },
          { role: 'WAITER', label: 'Waiters', color: 'bg-success/20 text-success' },
          { role: 'DEPUTY_MANAGER', label: 'Deputies', color: 'bg-secondary/20 text-secondary' },
        ].map((r) => (
          <Card key={r.role} className="p-4 text-center">
            <p className={`text-headline-lg font-bold ${r.color}`}>{roleCount(r.role)}</p>
            <p className="text-label-sm text-on-surface-variant">{r.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">All Staff ({staff.length})</h3>
        {staff.length === 0 && <p className="text-on-surface-variant">No staff enrolled yet</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-label-sm text-on-surface-variant border-b border-outline">
                <th className="pb-2">Name</th><th className="pb-2">Role</th><th className="pb-2">Staff ID</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s: any) => (
                <tr key={s._id} className="border-b border-outline/30 text-body-sm">
                  <td className="py-2 text-on-surface">{s.firstName} {s.lastName}</td>
                  <td className="py-2 text-on-surface-variant">{s.role}</td>
                  <td className="py-2 text-on-surface-variant">{s.staffId || '—'}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-label-xs ${s.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
