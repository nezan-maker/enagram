import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { LazyChart, preloadRecharts } from '../../components/ui/LazyChart';
import api from '../../api/axios';

export const OwnerReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Aggregate chart data from all restaurants
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    preloadRecharts();
    api.get('/restaurants')
      .then(async (res) => {
        const restaurants = res.data?.data || [];
        if (!Array.isArray(restaurants) || restaurants.length === 0) { setLoading(false); return; }

        // Fetch reports from first restaurant
        const rid = restaurants[0]._id;
        try {
          const [reportRes, dashRes] = await Promise.all([
            api.get(`/restaurants/${rid}/reports`).catch(() => null),
            api.get(`/restaurants/${rid}/reports/dashboard`).catch(() => null),
          ]);

          const reportData = reportRes?.data?.data || [];
          if (Array.isArray(reportData)) setReports(reportData);

          const dash = dashRes?.data?.data || {};
          if (dash) {
            setChartData([
              { name: 'Revenue', value: dash.dailyRevenue || 0 },
              { name: 'Orders', value: dash.activeOrders || 0 },
              { name: 'Issues', value: dash.openIssues || 0 },
            ]);
          }
        } catch { /* silent */ }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="140px" height="28px" />
        <Card className="p-6">
          <div className="h-48 bg-surface-container-high animate-pulse rounded-ui" />
        </Card>
        <Skeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h2 className="text-headline-md text-on-surface font-bold">Reports</h2>
        <p className="text-body-md text-on-surface-variant/60 mt-1">Aggregated operational data across all your restaurants.</p>
      </div>

      {reports.length === 0 && chartData.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Operational reports will be generated as data accumulates."
          variant="default"
        />
      ) : (
        <>
          {/* Chart */}
          {chartData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-body-lg text-on-surface font-bold mb-4">Overview</h3>
              <div className="h-48">
                <LazyChart>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }} />
                    <Bar dataKey="value" fill="#FF9800" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                </LazyChart>
              </div>
            </Card>
          )}

          {/* Report list */}
          {reports.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-headline-sm text-on-surface font-semibold">Recent Reports</h3>
              <div className="space-y-2 stagger-children">
                {reports.map((r) => (
                  <Card key={r._id} interactive className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-body-md text-on-surface font-medium">{r.type}</p>
                        <p className="text-body-sm text-on-surface-variant/60">
                          {r.period?.from ? `${new Date(r.period.from).toLocaleDateString()} – ${new Date(r.period.to).toLocaleDateString()}` : 'No date range'}
                        </p>
                      </div>
                      <StatusPill status={r.viewedByOwner ? 'APPROVED' : 'PENDING'} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
