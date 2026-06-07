import { Card } from '../../components/ui/Card';
export const OperationsReport = () => (
  <div className="space-y-6">
    <h2 className="text-headline-md text-on-surface font-bold">Operations Report</h2>
    <Card className="p-5"><p className="text-body-md text-on-surface-variant/60">Kitchen operations report form. Connects to POST /restaurants/:id/reports.</p></Card>
  </div>
);
