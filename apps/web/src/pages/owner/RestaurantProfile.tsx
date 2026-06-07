import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { restaurantApi } from '../../api/restaurant.api';

export const RestaurantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    restaurantApi.getById(id).then((res) => {
      const r = res.data?.data || res.data;
      if (r) {
        setRestaurant(r);
        setName(r.name || '');
        setDescription(r.description || '');
        setStreet(r.address?.street || '');
        setCity(r.address?.city || '');
        setPhone(r.contact?.phone || '');
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setSaved(false);
    try {
      await restaurantApi.update(id, {
        name, description,
        address: { street, city, province: restaurant?.address?.province },
        contact: { phone },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton width="200px" height="28px" />
        <Card className="p-6 space-y-4">
          <Skeleton lines={6} />
        </Card>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <EmptyState
        variant="error"
        title="Restaurant not found"
        description="This restaurant may have been removed."
        actionLabel="Back to Restaurants"
        actionTo="/owner/restaurants"
      />
    );
  }

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md text-on-surface font-bold">Restaurant Profile</h2>
          <p className="text-body-md text-on-surface-variant/60 mt-1">Manage your restaurant details and settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={restaurant.isOpen ? 'ACTIVE' : 'INACTIVE'} />
        </div>
      </div>

      <Card className="p-6 space-y-5">
        <h3 className="text-headline-sm text-on-surface font-semibold">Basic Info</h3>
        <Input label="Restaurant Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <label className="text-label-caps text-on-surface-variant/60 block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant rounded-ui px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all resize-none"
            placeholder="Describe your restaurant…"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="text-headline-sm text-on-surface font-semibold">Location</h3>
        <Input label="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="text-headline-sm text-on-surface font-semibold">Contact</h3>
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Card>

      <div className="flex items-center gap-3">
        <Button loading={saving} onClick={handleSave}>Save Changes</Button>
        {saved && <span className="text-label-sm text-success">Saved ✓</span>}
        <Button variant="ghost" onClick={() => navigate('/owner/restaurants')}>Cancel</Button>
      </div>
    </div>
  );
};
