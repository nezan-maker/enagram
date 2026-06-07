import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface RestaurantCardProps {
  name: string;
  location: string;
  revenue: string;
  orders: number;
  issues: number;
  status: 'Operational' | 'Issue Reported' | 'Closed';
}

export const RestaurantCard = ({ name, location, revenue, orders, issues, status }: RestaurantCardProps) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Operational': return 'bg-[#a5d6a7]';
      case 'Issue Reported': return 'bg-[#ffb4ab]';
      default: return 'bg-[#616161]';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'Operational': return 'Operational';
      case 'Issue Reported': return 'Issue Reported';
      default: return 'Closed (Offline)';
    }
  };

  return (
    <Card className="p-4 flex flex-col gap-3">
      {/* Top row: Name + Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-headline-sm text-on-surface font-semibold">{name}</h3>
        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked={status !== 'Closed'} className="sr-only peer" />
          <div className="w-9 h-5 bg-surface-container-high rounded-full peer peer-checked:bg-primary-container after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      {/* Location + Status Dot */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
        <span className="text-body-md text-on-surface-variant/60">{location}</span>
        <span className="ml-auto text-label-caps text-on-surface-variant/60">{getStatusLabel(status)}</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
        {[
          { label: 'REVENUE', value: revenue },
          { label: 'ORDERS', value: orders },
          { label: 'ISSUES', value: issues, highlight: issues > 0 },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-label-caps text-on-surface-variant/60">{m.label}</p>
            <p className={`text-headline-sm font-bold mt-0.5 ${m.highlight ? 'text-error' : 'text-on-surface'}`}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="secondary" className="flex-1 text-label-caps">View Details</Button>
        <button className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors" title="Open external">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>
    </Card>
  );
};
