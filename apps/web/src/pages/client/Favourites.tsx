import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/auth.store';
import api from '../../api/axios';

export const Favourites = () => {
  const user = useAuthStore((s) => s.user);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = (user?.favouriteRestaurants as string[]) || [];
    if (favIds.length === 0) {
      setLoading(false);
      return;
    }
    // Fetch each favourite restaurant's details
    Promise.all(
      favIds.map((id) =>
        api.get(`/restaurants/${id}`)
          .then((res) => res.data.data)
          .catch(() => null)
      )
    ).then((results) => {
      setFavourites(results.filter(Boolean));
    }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="text-center py-12 text-on-surface-variant">Loading favourites...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface font-bold">Favourite Restaurants</h2>
        <span className="text-body-sm text-on-surface-variant/60">{favourites.length} saved</span>
      </div>

      {favourites.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-body-md text-on-surface-variant/60">No favourite restaurants yet.</p>
          <p className="text-body-sm text-on-surface-variant/40 mt-1">Browse restaurants and save your favourites.</p>
        </Card>
      ) : (
        favourites.map((r) => (
          <Card key={r._id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-body-md text-on-surface font-semibold">{r.name}</p>
              <p className="text-body-sm text-on-surface-variant/60">
                {r.cuisineType?.join(', ') || 'Various'} · {r.address?.city || ''}
              </p>
            </div>
            <span className="text-label-caps text-primary-container flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {r.averageRating?.toFixed(1) || '—'}
            </span>
          </Card>
        ))
      )}
    </div>
  );
};
