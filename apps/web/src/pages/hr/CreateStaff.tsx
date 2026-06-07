import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
export const CreateStaff = () => (
  <div className="space-y-6 max-w-lg">
    <h2 className="text-headline-md text-on-surface font-bold">Create Staff Member</h2>
    <Card className="p-5 space-y-4">
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">First Name</label><input className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface" placeholder="Enter first name" /></div>
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">Last Name</label><input className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface" placeholder="Enter last name" /></div>
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">Phone</label><input className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface" placeholder="+1 555 0123" /></div>
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">Role</label>
        <select className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface"><option>CHEF</option><option>WAITER</option></select>
      </div>
      <Button variant="primary" className="w-full">Create Staff Member</Button>
    </Card>
  </div>
);
