import { useState, useEffect, FormEvent } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import api from '../../api/axios';

export const ClientIssues = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ORDER_COMPLAINT');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/issues/mine')
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) setIssues(data);
      })
      .catch(() => { /* noop */ })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    try {
      await api.post('/issues', { title, description, category, channel: 'CLIENT' });
      setShowForm(false);
      setTitle('');
      setDescription('');
      const res = await api.get('/issues/mine');
      if (Array.isArray(res.data.data)) setIssues(res.data.data);
    } catch { /* noop */ } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md text-on-surface font-bold">My Issues</h2>
          <p className="text-body-sm text-on-surface-variant/60 mt-1">{issues.length} total</p>
        </div>
        <Button variant="primary" className="text-label-caps" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Report Issue'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface">
              <option value="ORDER_COMPLAINT">Order Complaint</option>
              <option value="QUALITY">Quality Issue</option>
              <option value="SERVICE">Service Issue</option>
              <option value="OTHER">Other</option>
            </select>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface"
              placeholder="Issue title" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface min-h-[80px]"
              placeholder="Describe the issue..." />
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Issue'}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : issues.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-body-md text-on-surface-variant/60">No issues reported.</p>
        </Card>
      ) : (
        issues.map((issue) => (
          <Card key={issue._id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-body-md text-on-surface font-semibold">{issue.title}</h3>
                <p className="text-body-sm text-on-surface-variant/60 mt-0.5">{issue.category}</p>
              </div>
              <StatusPill status={issue.status} />
            </div>
            <p className="text-body-sm text-on-surface-variant/80">{issue.description}</p>
            <p className="text-body-sm text-on-surface-variant/40 mt-2">
              {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </Card>
        ))
      )}
    </div>
  );
};
