import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonKPI } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const FinanceDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const restaurantId = user?.restaurantId as string || '';
  const [reports, setReports] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) { setLoading(false); return; }
    api.get(`/restaurants/${restaurantId}/reports/financial`)
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setReports(data);
          setTotalRevenue(data.reduce((sum: number, r: any) => sum + (r.data?.revenue || 0), 0));
          setTotalExpenses(data.reduce((sum: number, r: any) => sum + (r.data?.expenses || 0), 0));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="180px" height="28px" />
        <SkeletonKPI />
        <Skeleton width="140px" height="20px" />
        <Skeleton lines={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-headline-md text-on-surface font-bold">Finance Dashboard</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <Card className="p-5">
          <span className="text-label-caps text-on-surface-variant/60">Total Revenue</span>
          <p className="text-headline-lg text-success font-bold mt-1">R{totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <span className="text-label-caps text-on-surface-variant/60">Total Expenses</span>
          <p className="text-headline-lg text-error font-bold mt-1">R{totalExpenses.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <span className="text-label-caps text-on-surface-variant/60">Net Profit</span>
          <p className={`text-headline-lg font-bold mt-1 ${totalRevenue - totalExpenses >= 0 ? 'text-success' : 'text-error'}`}>
            R{(totalRevenue - totalExpenses).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-headline-sm text-on-surface font-semibold">Financial Reports</h3>
          <span className="text-label-caps text-on-surface-variant/60">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
        </div>
        {reports.length === 0 ? (
          <EmptyState
            title="No financial reports yet"
            description="Reports will appear once financial data is submitted."
            variant="default"
          />
        ) : (
          <div className="space-y-2 stagger-children">
            {reports.map((r) => (
              <Card key={r._id} interactive className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-body-md text-on-surface font-medium">{r.type}</p>
                    <p className="text-body-sm text-on-surface-variant/60">
                      {new Date(r.period?.from).toLocaleDateString()} – {new Date(r.period?.to).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusPill status={r.isCritical ? 'CRITICAL' : r.viewedByOwner ? 'APPROVED' : 'PENDING'} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
