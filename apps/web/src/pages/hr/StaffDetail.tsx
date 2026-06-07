import { Card } from '../../components/ui/Card';
export const StaffDetail = () => (
  <div className="space-y-6">
    <h2 className="text-headline-md text-on-surface font-bold">Staff Detail</h2>
    <Card className="p-5"><p className="text-body-md text-on-surface-variant/60">Individual staff member profile. Connects to GET /restaurants/:id/staff/:userId.</p></Card>
  </div>
);
