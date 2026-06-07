import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

export const DeputyDashboard = () => {
  const { restaurantId } = useAuthStore();
  const [data, setData] = useState({ staffCount: 0, pendingApprovals: 0, openIssues: 0, ordersToday: 0 });

  useEffect(() => {
    if (!restaurantId) return;
    api.get(`/restaurants/${restaurantId}/reports/dashboard`).then((res) => {
      const d = res.data?.data || {};
      setData({
        staffCount: d.staffCount || 0,
        pendingApprovals: d.pendingApprovals || 0,
        openIssues: d.openIssues || 0,
        ordersToday: d.ordersToday || 0,
      });
    }).catch(() => {});
  }, [restaurantId]);

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-headline-md text-on-surface font-bold">Deputy Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
        <KPICard title="Staff" value={String(data.staffCount)} subtitle="Active employees" />
        <KPICard title="Approvals" value={String(data.pendingApprovals)} subtitle="Awaiting decision" />
        <KPICard title="Issues" value={String(data.openIssues)} subtitle="Open" />
        <KPICard title="Orders Today" value={String(data.ordersToday)} subtitle="Restaurant" />
      </div>
      <Card className="p-5">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <Link to="/staff/deputy/staff" className="px-4 py-2 bg-primary-container text-on-primary rounded-ui text-label-caps hover:bg-[#e58900] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container">View Staff</Link>
          <Link to="/staff/deputy/approvals" className="px-4 py-2 bg-primary-container text-on-primary rounded-ui text-label-caps hover:bg-[#e58900] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container">Approvals</Link>
          <Link to="/staff/deputy/issues" className="px-4 py-2 bg-primary-container text-on-primary rounded-ui text-label-caps hover:bg-[#e58900] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container">Issues</Link>
        </div>
      </Card>
    </div>
  );
};
