import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [role, setRole] = useState<'CLIENT' | 'OWNER'>('CLIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        email, password, firstName, lastName, role,
      });
      const { user, accessToken } = res.data.data as { user: Record<string, unknown>; accessToken: string };
      login({ user, accessToken });
      navigate(role === 'OWNER' ? '/owner/dashboard' : '/client/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h2 className="text-headline-lg text-on-surface font-bold tracking-tight">Create Account</h2>
        <p className="text-body-md text-on-surface-variant/60 mt-2">
          Join Enagram to manage your restaurant operations.
        </p>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error" role="alert">
          {error}
        </div>
      )}

      {/* Role Toggle */}
      <div className="flex gap-2 p-1 bg-surface-container-low rounded-ui">
        {(['CLIENT', 'OWNER'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2.5 rounded-ui text-label-caps font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
              role === r
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant/60 hover:text-on-surface'
            }`}
          >
            {r === 'CLIENT' ? 'Customer' : 'Restaurant Owner'}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-body-sm text-on-surface-variant/60 text-center">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm">
          Sign in
        </Link>
      </p>
    </div>
  );
};
