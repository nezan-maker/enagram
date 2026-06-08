import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/auth.store';
import { reportApi } from '../../api/report.api';

interface ReportItem {
  _id: string;
  type: string;
  period?: { from?: string; to?: string };
  summary?: string;
  isCritical?: boolean;
  createdAt: string;
  createdBy?: { firstName?: string; lastName?: string };
}

export const DeputyReports = () => {
  const { restaurantId } = useAuthStore();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError('');
    try {
      const res = await reportApi.list(restaurantId);
      setReports((res.data?.data || []) as ReportItem[]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Group by type
  const grouped = reports.reduce<Record<string, ReportItem[]>>((acc, r) => {
    const key = r.type || 'OTHER';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-headline-md text-on-surface font-bold">Reports</h2>
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Reports</h2>
        <span className="text-label-caps text-on-surface-variant/60">{reports.length} total</span>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error" role="alert">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Reports submitted by your team will appear here."
        />
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="space-y-3">
            <h3 className="text-headline-sm text-on-surface font-semibold">{type.replace(/_/g, ' ')}</h3>
            <div className="space-y-2">
              {items.map((report) => (
                <Card key={report._id} className={`p-4 ${report.isCritical ? 'border-l-4 border-l-error' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {report.isCritical && (
                        <span className="text-label-caps text-error font-semibold uppercase tracking-wider">⚠ Critical</span>
                      )}
                      {report.summary && (
                        <p className="text-body-md text-on-surface mt-1">{report.summary}</p>
                      )}
                      {report.period?.from && (
                        <p className="text-body-sm text-on-surface-variant/60 mt-1">
                          {report.period.from} — {report.period.to || 'Present'}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-variant/40 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
