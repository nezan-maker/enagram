import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SkeletonCardGrid } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import api from '../../api/axios';

interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  cuisineType?: string[];
  averageRating: number;
  isOpen: boolean;
  coverImage?: string;
  address: { city: string; street?: string };
  contact: { phone?: string };
}

const categoryFilters: Record<string, string[]> = {
  'All Cuisine': [],
  'Trending': [],
  'Japanese': ['Japanese', 'Sushi', 'Ramen'],
  'Italian': ['Italian', 'Pizza', 'Pasta'],
  'Patisserie': ['Patisserie', 'Bakery', 'Dessert', 'Pastry'],
  'Fine Dining': ['Fine Dining', 'Modern Fusion', 'Contemporary'],
  'Steakhouse': ['Steakhouse', 'Grill', 'BBQ'],
  'Nightlife': ['Nightlife', 'Bar', 'Cocktail', 'Lounge'],
};

const categoryLabels = Object.keys(categoryFilters);

export const Home = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Cuisine');

  useEffect(() => {
    api.get('/restaurants')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) setRestaurants(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoaded(true));
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'All Cuisine') return restaurants;
    const cuisineMatch = categoryFilters[activeCategory] || [];
    if (activeCategory === 'Trending') return restaurants.filter((r) => r.averageRating >= 4.5);
    return restaurants.filter((r) =>
      r.cuisineType?.some((ct) =>
        cuisineMatch.some((fc) => ct.toLowerCase().includes(fc.toLowerCase()))
      )
    );
  }, [restaurants, activeCategory]);

  const cuisineTags = restaurants.length > 0
    ? [...new Set(restaurants.flatMap((r) => r.cuisineType || []))]
    : [];

  return (
    <div className="space-y-12 animate-in">
      {/* Hero Section — full-viewport cinematic */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/50 to-surface/90 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-6 -mt-16">
          <div className="page-hero-glow opacity-80" />
          <span className="inline-block text-label-caps tracking-[0.2em] text-primary-container bg-primary-container/10 px-4 py-2 rounded-full border border-primary-container/20">
            PREMIUM DISCOVERY SYSTEM
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-on-surface leading-[1.15] tracking-tight">
            <span className="whitespace-nowrap">Discover restaurants</span><br />
            <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-primary">that define the meal.</span>
          </h1>
          <p className="text-body-lg md:text-headline-sm text-on-surface-variant/60 max-w-xl mx-auto">
            {cuisineTags.length} cuisines across {restaurants.length} venues.
          </p>

          <div className="flex gap-4 justify-center mt-10">
            <Button size="lg" className="px-10 py-4 text-headline-sm font-bold shadow-xl shadow-primary-container/25 hover:shadow-2xl hover:shadow-primary-container/30 transition-all duration-300">
              Browse Restaurants
            </Button>
            <Link to="/auth/register">
              <Button variant="ghost" size="lg" className="px-10 py-4 text-headline-sm text-on-surface-variant hover:text-on-surface border border-white/10 hover:border-white/20 transition-all duration-300">
                Sign up free
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* Cuisine Filters — segmented control */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-6 scrollbar-hide">
        {categoryLabels.map((cat) => {
          const count = cat === 'All Cuisine' ? restaurants.length :
            cat === 'Trending' ? restaurants.filter((r) => r.averageRating >= 4.5).length :
            restaurants.filter((r) =>
              r.cuisineType?.some((ct) =>
                (categoryFilters[cat] || []).some((fc) => ct.toLowerCase().includes(fc.toLowerCase()))
              )
            ).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-body-sm font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                activeCategory === cat
                  ? 'bg-primary-container text-on-primary shadow-lg shadow-primary-container/20'
                  : 'bg-surface-container-low text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {cat} <span className={`ml-1 text-label-xs ${activeCategory === cat ? 'text-on-primary/70' : 'text-on-surface-variant/40'}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Restaurant Grid */}
      <section className="px-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-headline-lg text-on-surface font-bold tracking-tight">
              {activeCategory === 'All Cuisine' ? 'All Restaurants' : activeCategory}
            </h2>
            <p className="text-body-md text-on-surface-variant/60 mt-1">
              {!loaded
                ? 'Fetching the best dining experiences near you.'
                : `${filtered.length} venue${filtered.length === 1 ? '' : 's'} · ${cuisineTags.length} cuisine types available`}
            </p>
          </div>
        </div>

        {!loaded ? (
          <SkeletonCardGrid />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Unable to connect"
            description="Check that the server is running and try again."
            actionLabel="Retry"
            onAction={() => window.location.reload()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            variant="search"
            title={`No ${activeCategory.toLowerCase()} restaurants`}
            description="Try selecting a different category or clear the filter."
            actionLabel="Clear filter"
            onAction={() => setActiveCategory('All Cuisine')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filtered.map((restaurant, i) => (
              <Link key={restaurant._id || i} to={`/restaurants/${restaurant.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-container">
                <Card interactive className="overflow-hidden">
                  <div className="h-48 bg-cover bg-center" style={{
                    backgroundImage: restaurant.coverImage
                      ? `url(${restaurant.coverImage})`
                      : `url(https://images.unsplash.com/photo-${i % 3 === 0 ? '1517248135467-4c7edcad34c4' : i % 3 === 1 ? '1559339352-11d035aa65de' : '1414235077428-338989a2e8c0'}?w=600&q=80)`,
                  }} />
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-headline-sm text-on-surface font-bold truncate">{restaurant.name}</h3>
                        <p className="text-body-sm text-on-surface-variant/60 mt-0.5 truncate">
                          {restaurant.cuisineType?.join(', ') || 'Various'} · {restaurant.address?.city || ''}
                        </p>
                      </div>
                      {restaurant.averageRating > 0 && (
                        <div className="flex items-center gap-1.5 bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-full shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <span className="text-label-sm font-bold">{restaurant.averageRating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {restaurant.description && (
                      <p className="text-body-sm text-on-surface-variant/50 line-clamp-2">{restaurant.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${restaurant.isOpen ? 'bg-success' : 'bg-error/60'}`} />
                      <span className="text-label-sm font-semibold text-on-surface-variant/60 uppercase tracking-wider">
                        {restaurant.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
