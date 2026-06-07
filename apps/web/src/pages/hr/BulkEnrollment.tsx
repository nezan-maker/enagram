import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Mock data based on the audited mockup
const initialData = [
  { id: 1, name: 'Marcus Holloway', role: 'Senior Chef', email: 'm.holloway@enagram.io', status: 'Valid' },
  { id: 2, name: 'Jeanine Smith', role: 'Floor Lead', email: 'invalid-email', status: 'Error' },
  { id: 3, name: 'Kaelen O\'Hara', role: 'Mixologist', email: 'k.ohara@enagram.io', status: 'Valid' },
  { id: 4, name: 'Robert Chen', role: 'Missing Field', email: 'r.chen@enagram.io', status: 'Error' },
];

export const BulkEnrollment = () => {
  const [data] = useState(initialData);
  const validCount = data.filter(r => r.status === 'Valid').length;
  const errorCount = data.filter(r => r.status === 'Error').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Preview Area */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Bulk Import Workflow</h2>
        
        <Card>
          <div className="border-2 border-dashed border-gray-600 p-8 text-center rounded-lg mb-6">
            <p className="text-gray-400">Drag & Drop Files here (.csv, .xlsx)</p>
          </div>

          <h3 className="font-semibold mb-4">Data Preview & Validation</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="pb-2">Name</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-700 last:border-0">
                  <td className="py-3">{row.name}</td>
                  <td className="py-3">{row.role}</td>
                  <td className="py-3">{row.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${row.status === 'Valid' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button variant="secondary" className="text-xs">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Summary Panel */}
      <Card className="h-fit">
        <h3 className="font-bold mb-4">Upload Summary</h3>
        <div className="space-y-2 mb-6">
          <p className="flex justify-between">Total Rows: <span>{data.length}</span></p>
          <p className="flex justify-between text-green-400">Ready: <span>{validCount}</span></p>
          <p className="flex justify-between text-red-400">Errors: <span>{errorCount}</span></p>
        </div>
        <Button className="w-full" disabled={validCount === 0}>Proceed with Valid</Button>
      </Card>
    </div>
  );
};
