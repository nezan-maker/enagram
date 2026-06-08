import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusPill } from '../../components/ui/StatusPill';
import { Skeleton, SkeletonCardGrid } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { restaurantApi } from '../../api/restaurant.api';

export const RestaurantList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantApi.listByOwner().then((res) => {
      setRestaurants(res.data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex justify-between items-center">
          <Skeleton width="180px" height="28px" />
          <Skeleton width="140px" height="40px" />
        </div>
        <SkeletonCardGrid count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md text-on-surface font-bold">My Restaurants</h2>
          <p className="text-body-md text-on-surface-variant/60 mt-1">{restaurants.length} venue{restaurants.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => navigate('/owner/restaurants/new')}>New Restaurant</Button>
      </div>

      {restaurants.length === 0 ? (
        <EmptyState
          title="No restaurants yet"
          description="Create your first restaurant to start managing orders, staff, and operations."
          actionLabel="Create Restaurant"
          actionTo="/owner/restaurants/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {restaurants.map((r: any) => (
            <Card key={r._id} interactive className="p-5" onClick={() => navigate(`/owner/restaurants/${r._id}`)}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-on-surface text-body-lg">{r.name}</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">{r.cuisineType?.join(', ') || 'Various'}</p>
                  <p className="text-label-xs text-on-surface-variant/60 mt-1">{r.address?.city}, {r.address?.province}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${r.isOpen ? 'bg-success' : 'bg-on-surface-variant/40'}`} />
                  <StatusPill status={r.isOpen ? 'ACTIVE' : 'INACTIVE'} />
                  <span className="px-2 py-0.5 rounded text-label-xs bg-primary/10 text-primary">{r.averageRating?.toFixed(1) || '—'}★</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
