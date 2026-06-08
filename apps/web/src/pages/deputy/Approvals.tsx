import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { approvalApi } from '../../api/approval.api';

interface ApprovalItem {
  _id: string;
  type: string;
  status: string;
  requestedBy?: { firstName?: string; lastName?: string; email?: string };
  payload?: Record<string, unknown>;
  createdAt: string;
  restaurantId?: { name?: string };
}

export const DeputyApprovals = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolving, setResolving] = useState<string | null>(null);

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await approvalApi.list();
      setApprovals((res.data?.data || []) as ApprovalItem[]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleResolve = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setResolving(id);
    try {
      await approvalApi.resolve(id, { status });
      setApprovals((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to ${status.toLowerCase()}`);
    } finally {
      setResolving(null);
    }
  };

  const getTypeLabel = (type: string) => type.replace(/_/g, ' ');

  const getDetails = (item: ApprovalItem) => {
    const p = item.payload || {};
    switch (item.type) {
      case 'STAFF_TERMINATION':
        return `Terminate: ${p.firstName || ''} ${p.lastName || ''} (${p.role || 'Unknown role'})`;
      case 'BUDGET_EXPENDITURE':
        return `Budget expenditure: $${p.amount || 'N/A'}`;
      case 'MENU_CHANGE':
        return `Menu change: ${p.itemName || p.action || 'Unknown'}`;
      case 'POLICY_CHANGE':
        return `Policy change: ${p.policy || 'Unknown'}`;
      case 'BULK_ENROLLMENT':
        return `Bulk enrollment: ${p.count || '?'} staff members`;
      case 'RESTAURANT_CLOSURE':
        return `Restaurant closure request`;
      default:
        return JSON.stringify(p).slice(0, 100);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-headline-md text-on-surface font-bold">Pending Approvals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Pending Approvals</h2>
        <span className="text-label-caps text-on-surface-variant/60">{approvals.length} pending</span>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error" role="alert">
          {error}
        </div>
      )}

      {approvals.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description="All approval requests have been resolved. New requests will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvals.map((item) => (
            <Card key={item._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-label-caps text-primary-container font-semibold uppercase tracking-wider">
                  {getTypeLabel(item.type)}
                </span>
                <span className="text-[11px] text-on-surface-variant/40 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <p className="text-body-md text-on-surface font-medium leading-snug">{getDetails(item)}</p>
                {item.restaurantId?.name && (
                  <p className="text-body-sm text-on-surface-variant/60 mt-0.5">{item.restaurantId.name}</p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="primary"
                  onClick={() => handleResolve(item._id, 'APPROVED')}
                  disabled={resolving === item._id}
                  className="flex-1 text-[11px] py-1.5"
                >
                  {resolving === item._id ? 'Processing...' : 'Approve'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleResolve(item._id, 'REJECTED')}
                  disabled={resolving === item._id}
                  className="flex-1 text-[11px] py-1.5"
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
