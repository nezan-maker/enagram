import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { restaurantApi } from '../../api/restaurant.api';
import { menuApi } from '../../api/menu.api';
import { reviewApi } from '../../api/review.api';
import { orderApi } from '../../api/order.api';
import { useAuthStore } from '../../store/auth.store';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  isAvailable?: boolean;
}

interface Menu {
  _id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string };
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export const RestaurantDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    restaurantApi.getBySlug(slug)
      .then((r) => {
        if (!r) { setError(true); setLoading(false); return; }
        setRestaurant(r);
        const rid = r._id;
        Promise.all([
          menuApi.list(rid).then((res) => res.data?.data || []).catch(() => []),
          reviewApi.list(rid).then((res) => res.data?.data || []).catch(() => []),
        ]).then(([menuData, reviewData]) => {
          if (Array.isArray(menuData)) setMenus(menuData);
          if (Array.isArray(reviewData)) setReviews(reviewData);
          setLoading(false);
        });
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item._id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItemId === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItemId: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
    setShowCart(true);
  }, []);

  const updateQty = useCallback((menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => (ci.menuItemId === menuItemId ? { ...ci, quantity: ci.quantity + delta } : ci))
        .filter((ci) => ci.quantity > 0)
    );
  }, []);

  const placeOrder = useCallback(async () => {
    if (!isAuthenticated) { navigate('/auth/login'); return; }
    if (!restaurant || cart.length === 0) return;
    setPlacing(true);
    try {
      await orderApi.create({
        restaurantId: restaurant._id,
        type: 'DINE_IN',
        items: cart.map((ci) => ({
          menuItemId: ci.menuItemId,
          name: ci.name,
          price: ci.price,
          quantity: ci.quantity,
        })),
      });
      setPlaced(true);
      setCart([]);
      setShowCart(false);
    } catch {
      // Error handled by api interceptor
    } finally {
      setPlacing(false);
    }
  }, [isAuthenticated, navigate, restaurant, cart]);

  const cartTotal = cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  if (loading) {
    return (
      <div className="animate-in space-y-12">
        <div className="w-full h-[360px] bg-surface-container-high animate-pulse rounded-container" />
        <div className="px-8 space-y-6">
          <Skeleton width="280px" height="36px" />
          <Skeleton width="400px" height="16px" />
          <Skeleton lines={4} />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <EmptyState
        variant="error"
        title="Restaurant not found"
        description="This restaurant doesn't exist or may have been removed."
        actionLabel="Browse Restaurants"
        actionTo="/"
      />
    );
  }

  const allItems = menus.flatMap((m) => m.items || []);
  const categories = [...new Set(allItems.map((i) => i.category || 'Main'))];

  const coverImage = restaurant.coverImage
    ? `${restaurant.coverImage}`
    : 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80';

  return (
    <div className="animate-in pb-32">
      {/* Hero */}
      <div className="relative w-full h-[360px]">
        <img src={coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute -bottom-9 left-8 w-20 h-20 rounded-full bg-surface border-4 border-surface flex items-center justify-center shadow-lg">
          <Logo size={40} className="text-primary-container" />
        </div>
      </div>

      <div className="px-8 pt-12 space-y-12">
        {/* Header Info */}
        <div className="space-y-2">
          <h1 className="text-headline-lg text-on-surface font-bold tracking-tight">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-body-md text-on-surface-variant/60 flex-wrap">
            {restaurant.averageRating > 0 && (
              <span className="text-primary-container font-semibold flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {restaurant.averageRating?.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            )}
            {restaurant.cuisineType?.length > 0 && (
              <><span className="text-on-surface-variant/30">·</span><span>{restaurant.cuisineType.join(', ')}</span></>
            )}
            <span className="text-on-surface-variant/30">·</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${restaurant.isOpen ? 'bg-success' : 'bg-error'}`} />
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          {restaurant.description && (
            <p className="text-body-md text-on-surface-variant/70 mt-2 max-w-2xl">{restaurant.description}</p>
          )}
          {restaurant.address && (
            <p className="text-body-sm text-on-surface-variant/50 mt-1">
              {restaurant.address.street && `${restaurant.address.street}, `}
              {restaurant.address.city}
              {restaurant.address.province && `, ${restaurant.address.province}`}
            </p>
          )}
        </div>

        {/* Menu Sections */}
        {placed ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a5d6a7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-headline-md text-on-surface font-bold">Order Placed!</h2>
            <p className="text-body-md text-on-surface-variant/60">Your order has been sent to the restaurant.</p>
            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={() => setPlaced(false)} variant="ghost">Order More</Button>
              <Link to="/client/orders"><Button>View Orders</Button></Link>
            </div>
          </div>
        ) : menus.length === 0 ? (
          <EmptyState
            title="Menu coming soon"
            description="This restaurant hasn't published their menu yet."
            variant="default"
          />
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const items = allItems.filter((i) => (i.category || 'Main') === category);
              return (
                <section key={category} className="space-y-5">
                  <h2 className="text-headline-sm text-on-surface font-bold uppercase tracking-wider border-b border-white/8 pb-3">
                    {category}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const inCart = cart.find((ci) => ci.menuItemId === item._id);
                      return (
                        <div
                          key={item._id}
                          className="group p-4 rounded-container hover:bg-white/5 transition-all duration-200 flex items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-ui bg-surface-container-high overflow-hidden shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <h3 className="font-semibold text-on-surface">{item.name}</h3>
                            {item.description && (
                              <p className="text-body-sm text-on-surface-variant/60 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-bold text-on-surface">R {item.price?.toFixed(2)}</span>
                            {inCart ? (
                              <div className="flex items-center gap-2 bg-primary-container/10 rounded-ui px-2 py-1">
                                <button
                                  onClick={() => updateQty(item._id, -1)}
                                  className="w-7 h-7 rounded-full bg-primary-container/20 text-primary-container font-bold hover:bg-primary-container/30 transition-colors"
                                >−</button>
                                <span className="w-6 text-center font-semibold text-on-surface">{inCart.quantity}</span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-7 h-7 rounded-full bg-primary-container/20 text-primary-container font-bold hover:bg-primary-container/30 transition-colors"
                                >+</button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addToCart(item)}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-headline-sm text-on-surface font-bold uppercase tracking-wider border-b border-white/8 pb-3">
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-3 stagger-children">
              {reviews.slice(0, 10).map((review) => (
                <Card key={review._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-md text-on-surface font-medium">
                          {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-0.5 text-primary-container">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-body-sm text-on-surface-variant/70 mt-1">{review.comment}</p>
                      )}
                    </div>
                    <span className="text-label-xs text-on-surface-variant/40 whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && !placed && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-white/10 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <button onClick={() => setShowCart(!showCart)} className="flex items-center gap-2 text-on-surface">
              <span className="bg-primary-container text-on-primary w-6 h-6 rounded-full flex items-center justify-center text-label-sm font-bold">{cartCount}</span>
              <span className="text-body-md font-semibold">Cart · R {cartTotal.toFixed(2)}</span>
              <svg className={`transition-transform ${showCart ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <Button onClick={placeOrder} disabled={placing} size="lg" className="px-10">
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
          {/* Cart Detail Dropdown */}
          {showCart && (
            <div className="max-w-5xl mx-auto mt-3 pt-3 border-t border-white/5 space-y-2">
              {cart.map((ci) => (
                <div key={ci.menuItemId} className="flex items-center justify-between text-body-sm text-on-surface-variant/80">
                  <span className="truncate">{ci.name} × {ci.quantity}</span>
                  <span className="font-medium text-on-surface">R {(ci.price * ci.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-body-md font-bold text-on-surface pt-2 border-t border-white/5">
                <span>Total</span>
                <span>R {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
