import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ApprovalCardProps {
  type: string;
  details: string;
  restaurant: string;
  timestamp: string;
  onApprove: () => void;
  onReview: () => void;
}

export const ApprovalCard = ({ type, details, restaurant, timestamp, onApprove, onReview }: ApprovalCardProps) => {
  return (
    <Card className="p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-label-caps text-primary-container font-semibold uppercase tracking-wider">{type}</span>
        <span className="text-[11px] text-on-surface-variant/40 whitespace-nowrap">{timestamp}</span>
      </div>
      <div>
        <p className="text-body-md text-on-surface font-medium leading-snug">{details}</p>
        <p className="text-body-md text-on-surface-variant/60 mt-0.5">{restaurant}</p>
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="primary" onClick={onApprove} className="flex-1 text-[11px] py-1.5">Approve</Button>
        <Button variant="secondary" onClick={onReview} className="flex-1 text-[11px] py-1.5">Review</Button>
      </div>
    </Card>
  );
};
