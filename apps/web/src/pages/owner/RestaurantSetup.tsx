import { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth.store';
import { Tier } from '../../policies/feature.policy';
import api from '../../api/axios';

export const RestaurantSetup = () => {
  const navigate = useNavigate();
  const updateTier = useAuthStore((state) => state.updateTier);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier>(Tier.TIER_1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createRestaurant = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !street || !city || !phone) {
      setError('Name, street, city, and phone are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/restaurants', {
        name, description,
        address: { street, city, province },
        contact: { phone },
        cuisineType: selectedTier === Tier.TIER_2 ? ['Fine Dining'] : ['Bistro'],
      });
      const rid = res.data?.data?._id;
      if (rid) {
        setRestaurantId(rid);
        updateTier(selectedTier);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  const uploadCover = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !restaurantId) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('cover', file);
      fd.append('field', 'coverImage');
      await api.post(`/restaurants/${restaurantId}/media`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/owner/dashboard');
    } catch {
      setError('Upload failed');
      setUploading(false);
    }
  };

  const skipPhoto = () => navigate('/owner/dashboard');

  // Photo step
  if (restaurantId) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in">
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-headline-md text-on-surface font-bold">Restaurant Created</h2>
            <p className="text-body-md text-on-surface-variant/60 mt-1">Add a cover photo so customers can see your venue.</p>
          </div>

          {coverPreview ? (
            <div className="relative">
              <img src={coverPreview} alt="Cover preview" className="w-full h-48 object-cover rounded-ui" />
              <button onClick={() => { setCoverPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/70 transition-colors">✕</button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-ui p-12 text-center cursor-pointer hover:border-primary-container/30 transition-colors">
              <svg className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-body-md text-on-surface-variant/50">Click to upload a cover photo</p>
              <p className="text-label-sm text-on-surface-variant/30 mt-1">JPEG, PNG, WebP · Max 5MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverPreview(URL.createObjectURL(f)); }} className="hidden" />

          {error && <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error">{error}</div>}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={skipPhoto} className="flex-1">Skip</Button>
            <Button onClick={uploadCover} disabled={!coverPreview || uploading} loading={uploading} className="flex-1">Upload Photo</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 1: Create form
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-headline-md text-on-surface font-bold">New Restaurant</h2>
          <p className="text-body-md text-on-surface-variant/60 mt-1">Set up your restaurant to start accepting orders.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error/30 rounded-ui px-4 py-3 text-body-sm text-error">{error}</div>
        )}

        <form className="space-y-4" onSubmit={createRestaurant}>
          <Input label="Restaurant Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Lumiere Dining" />

          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full bg-surface-container-low border border-white/5 rounded-ui px-4 py-3 text-body-md text-on-surface placeholder-on-surface-variant/30 focus:outline-none focus:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all resize-none"
              placeholder="Modern fusion cuisine in the heart of the city…" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Street Address" required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="42 Wall St" />
            <Input label="City" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kigali" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Province" value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Kigali City" />
            <Input label="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 788 000 000" />
          </div>

          <div>
            <label className="text-label-caps text-on-surface-variant/60 block mb-2">Setup Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => setSelectedTier(Tier.TIER_1)}
                className={`p-4 rounded-ui text-left transition-colors ${
                  selectedTier === Tier.TIER_1
                    ? 'bg-primary-container/10 ring-1 ring-primary-container'
                    : 'bg-surface-container-low hover:bg-surface-container-high'
                }`}>
                <div className="text-label-caps text-on-surface font-bold">Tier 1: Core</div>
                <div className="text-body-sm text-on-surface-variant/60 mt-1">Auto-approved ops. Fast to open.</div>
              </button>
              <button type="button" onClick={() => setSelectedTier(Tier.TIER_2)}
                className={`p-4 rounded-ui text-left transition-colors ${
                  selectedTier === Tier.TIER_2
                    ? 'bg-primary-container/10 ring-1 ring-primary-container'
                    : 'bg-surface-container-low hover:bg-surface-container-high'
                }`}>
                <div className="text-label-caps text-on-surface font-bold">Tier 2: Mgmt</div>
                <div className="text-body-sm text-on-surface-variant/60 mt-1">Full HR, Finance, Approvals.</div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => navigate('/owner/dashboard')} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Create Restaurant</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
