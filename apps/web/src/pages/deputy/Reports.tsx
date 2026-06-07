import { Card } from '../../components/ui/Card';

export const DeputyReports = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-headline-md text-on-surface font-bold">Reports</h2>
      <Card className="p-5">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Operational Summary</h3>
        <p className="text-body-md text-on-surface-variant/60">Reports list will be rendered here. Connects to GET /restaurants/:id/reports.</p>
      </Card>
    </div>
  );
};
