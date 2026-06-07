import { Card } from '../../components/ui/Card';
export const RevenueReport = () => (
  <div className="space-y-6">
    <h2 className="text-headline-md text-on-surface font-bold">Revenue Report</h2>
    <Card className="p-5"><p className="text-body-md text-on-surface-variant/60">Detailed revenue analytics. Connects to GET /restaurants/:id/reports/financial.</p></Card>
  </div>
);
