import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { issueApi } from '../../api/issue.api';

export const IssuesHub = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = () => {
    setLoading(true);
    issueApi.list().then((res) => {
      setIssues(res.data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleAssign = async (id: string, assigneeId: string) => {
    await issueApi.assign(id, assigneeId).catch(() => {});
    fetchIssues();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="140px" height="28px" />
        <SkeletonTable rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Issues & Tickets</h2>
        <span className="text-label-caps text-on-surface-variant/60">{issues.length} issue{issues.length !== 1 ? 's' : ''}</span>
      </div>

      {issues.length === 0 ? (
        <EmptyState
          title="No open issues"
          description="Everything is running smoothly. Issues from staff or customers will appear here."
          variant="default"
        />
      ) : (
        <div className="space-y-3 stagger-children">
          {issues.map((issue: any) => (
            <Card key={issue._id} className="p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-on-surface">{issue.title}</p>
                    <StatusPill status={issue.status} />
                    {(issue.priority === 'CRITICAL' || issue.priority === 'HIGH') && (
                      <span className="px-2 py-0.5 rounded text-label-xs bg-error/10 text-error border border-error/20">{issue.priority}</span>
                    )}
                  </div>
                  <p className="text-body-sm text-on-surface-variant/60 mt-1">{issue.description}</p>
                  <p className="text-label-xs text-on-surface-variant/40 mt-2">{issue.channel} · {issue.category}</p>
                </div>
                {issue.status === 'OPEN' && (
                  <Button size="sm" onClick={() => handleAssign(issue._id, '')}>Assign</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
