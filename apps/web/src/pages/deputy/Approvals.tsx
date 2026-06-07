import { Card } from '../../components/ui/Card';
import { ApprovalCard } from '../../components/approvals/ApprovalCard';

export const DeputyApprovals = () => {
  const items = [
    { id: '1', type: 'STAFF TERMINATION', details: 'Terminate: Ben Knight', restaurant: 'Downtown Bistro • Performance', timestamp: '1h ago' },
    { id: '2', type: 'BUDGET EXPENDITURE', details: 'Kitchen Equipment Purchase', restaurant: 'Soho Grill • $4,200.00', timestamp: '3h ago' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-headline-md text-on-surface font-bold">Pending Approvals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((a) => (
          <ApprovalCard key={a.id} type={a.type} details={a.details} restaurant={a.restaurant} timestamp={a.timestamp} onApprove={() => {}} onReview={() => {}} />
        ))}
      </div>
    </div>
  );
};
