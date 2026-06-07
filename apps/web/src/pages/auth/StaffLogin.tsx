import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const StaffLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!staffId || !password) {
      setError('Staff ID and password are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/staff/login', { staffId, password });
      const { user, accessToken, refreshToken, firstLogin } = res.data.data;
      login({ user, accessToken, refreshToken, restaurantId: user.restaurantId as string | undefined });
      if (firstLogin) {
        navigate('/auth/set-password');
      } else {
        const routeMap: Record<string, string> = {
          DEPUTY_MANAGER: `deputy/dashboard`,
          HR_MANAGER: `hr/dashboard`,
          FINANCE_MANAGER: `finance/dashboard`,
          KITCHEN_MANAGER: `kitchen/dashboard`,
          CHEF: `chef/board`,
          WAITER: `waiter/board`,
        };
        const prefix = routeMap[user.role];
        if (prefix) navigate(`/staff/${prefix}`);
        else navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Staff login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">Staff portal</h1>
        <p className="text-body-md text-on-surface-variant/60 mt-2">Sign in with your Staff ID and password.</p>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error" role="alert">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Staff ID"
          type="text"
          required
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4l-10 8L2 4" />
            </svg>
          }
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-label-sm text-on-surface-variant/40 hover:text-on-surface-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm px-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <p className="text-body-sm text-on-surface-variant/60 text-center">
        Not staff?{' '}
        <Link to="/auth/login" className="text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm">
          Sign in as customer
        </Link>
      </p>
    </div>
  );
};
