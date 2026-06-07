import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const HRDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const restaurantId = user?.restaurantId as string || '';
  const [stats, setStats] = useState({ total: 0, active: 0, managers: 0, staff: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    api.get(`/restaurants/${restaurantId}/staff`)
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setStats({
            total: data.length,
            active: data.filter((s: any) => s.isActive !== false).length,
            managers: data.filter((s: any) => ['DEPUTY_MANAGER', 'HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER'].includes(s.role)).length,
            staff: data.filter((s: any) => ['CHEF', 'WAITER'].includes(s.role)).length,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="160px" height="28px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="p-5 space-y-2">
              <Skeleton width="60px" height="10px" />
              <Skeleton width="40px" height="28px" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">HR Dashboard</h2>
        <Button size="sm" onClick={() => window.location.href = '/staff/hr/staff/new'}>+ Add Staff</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'Total Staff', value: stats.total, color: 'text-on-surface' },
          { label: 'Active', value: stats.active, color: 'text-success' },
          { label: 'Managers', value: stats.managers, color: 'text-primary-container' },
          { label: 'Staff', value: stats.staff, color: 'text-secondary' },
        ].map((m) => (
          <Card key={m.label} className="p-5">
            <span className="text-label-caps text-on-surface-variant/60">{m.label}</span>
            <p className={`text-headline-lg font-bold mt-1 ${m.color}`}>{m.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card interactive className="p-5" onClick={() => window.location.href = '/staff/hr/staff'}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-headline-sm text-on-surface font-semibold">Staff Directory</h3>
              <p className="text-body-sm text-on-surface-variant/60 mt-1">View and manage all staff members</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-variant/30"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </Card>
        <Card interactive className="p-5" onClick={() => window.location.href = '/staff/hr/staff/bulk'}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-headline-sm text-on-surface font-semibold">Bulk Enrollment</h3>
              <p className="text-body-sm text-on-surface-variant/60 mt-1">Add multiple staff at once</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-on-surface-variant/30"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </Card>
      </div>
    </div>
  );
};
