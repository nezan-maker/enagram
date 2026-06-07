import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { approvalApi } from '../../api/approval.api';

export const Approvals = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = () => {
    setLoading(true);
    approvalApi.list().then((res) => {
      setApprovals(res.data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchApprovals(); }, []);

  const handleResolve = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await approvalApi.resolve(id, { status }).catch(() => {});
    fetchApprovals();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="160px" height="28px" />
        <SkeletonTable rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Approvals</h2>
        <span className="text-label-caps text-on-surface-variant/60">{approvals.length} pending</span>
      </div>

      {approvals.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description="All requests have been reviewed. New approvals will appear here."
          variant="default"
        />
      ) : (
        <div className="space-y-3 stagger-children">
          {approvals.map((a: any) => (
            <Card key={a._id} className="p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-on-surface">{a.type?.replace(/_/g, ' ')}</p>
                    <StatusPill status={a.status} />
                  </div>
                  <p className="text-label-sm text-on-surface-variant/60 mt-0.5">Requested by {a.requestedBy} · {new Date(a.createdAt).toLocaleDateString()}</p>
                  {a.notes && <p className="text-body-sm text-on-surface-variant/80 mt-1">{a.notes}</p>}
                </div>
                {a.status === 'PENDING' && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="secondary" onClick={() => handleResolve(a._id, 'APPROVED')}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleResolve(a._id, 'REJECTED')}>Reject</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
