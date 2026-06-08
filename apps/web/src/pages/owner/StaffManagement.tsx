import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  staffId?: string;
  isActive: boolean;
  restaurantId?: string;
}

const ROLE_LABELS: Record<string, string> = {
  CHEF: 'Chef',
  WAITER: 'Waiter',
  KITCHEN_MANAGER: 'Kitchen Manager',
  DEPUTY_MANAGER: 'Deputy Manager',
  HR_MANAGER: 'HR Manager',
  FINANCE_MANAGER: 'Finance Manager',
};

export const OwnerStaff = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'WAITER' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/restaurants')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          setRestaurants(data);
          if (data.length > 0) setSelectedRestaurant(data[0]._id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;
    setLoading(true);
    api.get(`/restaurants/${selectedRestaurant}/staff`)
      .then((res) => setStaff(res.data?.data || []))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  }, [selectedRestaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !selectedRestaurant) {
      setError('First name, last name, and restaurant are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post(`/restaurants/${selectedRestaurant}/staff`, form);
      setForm({ firstName: '', lastName: '', email: '', role: 'WAITER' });
      setShowForm(false);
      // Refresh staff list
      const res = await api.get(`/restaurants/${selectedRestaurant}/staff`);
      setStaff(res.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add staff member');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !selectedRestaurant) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="200px" height="28px" />
        <Skeleton lines={3} />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <EmptyState
        title="No restaurants"
        description="You need to create a restaurant first before adding staff."
        actionLabel="Create Restaurant"
        actionTo="/owner/restaurants/new"
      />
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md text-on-surface font-bold">Staff Management</h2>
          <p className="text-body-md text-on-surface-variant/60 mt-1">
            {staff.length} team member{staff.length !== 1 ? 's' : ''} across {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Staff Member'}
        </Button>
      </div>

      {/* Restaurant selector */}
      {restaurants.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {restaurants.map((r) => (
            <button
              key={r._id}
              onClick={() => setSelectedRestaurant(r._id)}
              className={`px-4 py-2 rounded-ui text-body-sm font-semibold whitespace-nowrap transition-colors ${
                selectedRestaurant === r._id
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant/70 hover:bg-surface-container-high'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Add staff form */}
      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="text-headline-sm text-on-surface font-bold">New Staff Member</h3>
          {error && (
            <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="First Name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
              <Input label="Last Name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@restaurant.com" />
              <div>
                <label className="text-label-caps text-on-surface-variant/60 block mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-surface-container-low border border-white/5 rounded-ui px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
              <Button type="submit" loading={saving} className="flex-1">Add Staff Member</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Staff list */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton lines={3} />
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          title="No staff members yet"
          description="Add your first team member to start managing your restaurant."
          actionLabel="Add Staff Member"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3 stagger-children">
          {staff.map((member) => (
            <Card key={member._id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-label-caps text-primary-container font-bold">
                  {member.firstName?.[0]}{member.lastName?.[0]}
                </div>
                <div>
                  <p className="text-body-md text-on-surface font-semibold">{member.firstName} {member.lastName}</p>
                  <p className="text-body-sm text-on-surface-variant/60">
                    {ROLE_LABELS[member.role] || member.role}
                    {member.staffId && <span className="ml-2 text-label-xs text-on-surface-variant/40">#{member.staffId}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-success' : 'bg-on-surface-variant/40'}`} />
                <span className={`text-label-sm font-semibold ${member.isActive ? 'text-success' : 'text-on-surface-variant/40'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerStaff;
