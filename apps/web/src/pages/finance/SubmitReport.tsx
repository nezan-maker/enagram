import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
export const SubmitReport = () => (
  <div className="space-y-6 max-w-lg">
    <h2 className="text-headline-md text-on-surface font-bold">Submit Report</h2>
    <Card className="p-5 space-y-4">
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">Report Type</label>
        <select className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface"><option>Financial</option><option>HR</option><option>Operational</option><option>Inventory</option></select>
      </div>
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">Period</label><input className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface" placeholder="e.g. Oct 24 - Oct 31" /></div>
      <div><label className="text-label-caps text-on-surface-variant/60 block mb-1">Summary</label><textarea className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface h-24" placeholder="Report summary..." /></div>
      <Button variant="primary" className="w-full">Submit</Button>
    </Card>
  </div>
);
