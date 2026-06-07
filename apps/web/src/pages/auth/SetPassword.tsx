import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const SetPassword = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/auth/me', { password });
      navigate(user?.restaurantId ? `/staff/${user.restaurantId}/deputy/dashboard` : '/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">Set your password</h1>
        <p className="text-body-md text-on-surface-variant/60 mt-2">
          This is your first login. Please set a new password.
        </p>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error" role="alert">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="New Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Confirm Password" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Set Password
        </Button>
      </form>
    </div>
  );
};
