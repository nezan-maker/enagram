import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const StaffList = () => {
  const user = useAuthStore((s) => s.user);
  const restaurantId = user?.restaurantId as string || '';
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) { setLoading(false); return; }
    api.get(`/restaurants/${restaurantId}/staff`)
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) setStaff(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-in">
        <Skeleton width="160px" height="28px" />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Staff Directory</h2>
        <span className="text-label-caps text-on-surface-variant/60">{staff.length} members</span>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          title="No staff members yet"
          description="Add staff to manage restaurant operations."
          actionLabel="Create Staff"
          actionTo="/staff/hr/staff/new"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 px-4 text-label-caps text-on-surface-variant/60 font-medium">Name</th>
                  <th className="pb-3 px-4 text-label-caps text-on-surface-variant/60 font-medium">Role</th>
                  <th className="pb-3 px-4 text-label-caps text-on-surface-variant/60 font-medium">Staff ID</th>
                  <th className="pb-3 px-4 text-label-caps text-on-surface-variant/60 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-body-md text-on-surface font-medium">{s.firstName} {s.lastName}</td>
                    <td className="py-3 px-4 text-body-md text-on-surface-variant/80">{s.role?.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4 text-body-sm text-on-surface-variant/60 font-mono">{s.staffId || '—'}</td>
                    <td className="py-3 px-4"><StatusPill status={s.isActive !== false ? 'ACTIVE' : 'INACTIVE'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
