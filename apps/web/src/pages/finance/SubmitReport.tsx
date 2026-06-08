import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth.store';
import { reportApi } from '../../api/report.api';

export const SubmitReport = () => {
  const { restaurantId } = useAuthStore();
  const [type] = useState('FINANCIAL');
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [summary, setSummary] = useState('');
  const [isCritical, setIsCritical] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) {
      setError('No restaurant context available');
      return;
    }
    if (!periodFrom || !summary) {
      setError('Period start and summary are required');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await reportApi.create(restaurantId, {
        type,
        period: { from: periodFrom, to: periodTo || undefined },
        summary,
        isCritical,
      });
      const reportId = res.data?.data?._id;
      setSuccess(`Report submitted successfully${reportId ? ` (ID: ${reportId})` : ''}`);
      // Reset form
      setPeriodFrom('');
      setPeriodTo('');
      setSummary('');
      setIsCritical(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-headline-md text-on-surface font-bold">Submit Financial Report</h2>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-success-container/20 border border-success/30 rounded-ui px-4 py-3 text-body-sm text-success" role="status">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-5 space-y-4">
          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">Report Type</label>
            <div className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface">
              Financial
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Period From"
              type="date"
              required
              value={periodFrom}
              onChange={(e) => setPeriodFrom(e.target.value)}
            />
            <Input
              label="Period To"
              type="date"
              value={periodTo}
              onChange={(e) => setPeriodTo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">Summary</label>
            <textarea
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface h-24"
              placeholder="Report summary..."
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCritical"
              checked={isCritical}
              onChange={(e) => setIsCritical(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant"
            />
            <label htmlFor="isCritical" className="text-body-md text-on-surface">Mark as critical</label>
          </div>

          <Button type="submit" variant="primary" loading={submitting} className="w-full">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </Card>
      </form>
    </div>
  );
};
