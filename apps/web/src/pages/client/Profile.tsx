import { useState, useEffect, FormEvent } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName((user.firstName as string) || '');
      setLastName((user.lastName as string) || '');
      setEmail((user.email as string) || '');
      setPhone((user.phone as string) || '');
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.patch('/users/me', { firstName, lastName, phone });
      setMessage('Profile updated');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-headline-md text-on-surface font-bold">My Profile</h2>
        <p className="text-body-md text-on-surface-variant/60 mt-1">Manage your personal information.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-ui text-body-sm ${
          message === 'Profile updated' ? 'bg-green-900/30 text-green-300 border border-green-500/40' : 'bg-red-900/30 text-red-300 border border-red-500/40'
        }`}>
          {message}
        </div>
      )}

      <Card className="p-5">
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">Email</label>
            <input value={email} disabled
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface/40 cursor-not-allowed"
            />
            <p className="text-body-sm text-on-surface-variant/40 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
              placeholder="+1 555 0123"
            />
          </div>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
