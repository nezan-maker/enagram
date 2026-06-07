import { Outlet, Link, useLocation } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Footer } from '../components/ui/Footer';

const navItems = [
  { name: 'Dashboard', path: '/client/dashboard', icon: 'grid' },
  { name: 'Orders', path: '/client/orders', icon: 'package' },
  { name: 'Favourites', path: '/client/favourites', icon: 'heart' },
  { name: 'Profile', path: '/client/profile', icon: 'user' },
  { name: 'Issues', path: '/client/issues', icon: 'alert' },
];

const icons: Record<string, React.ReactNode> = {
  grid:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  package: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16.5 9.5l-9-5"/><path d="M21 12V7.5l-9-5-9 5V12l9 5 9-5z"/><path d="M3 7.5v9l9 5 9-5v-9"/></svg>,
  heart:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  user:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  alert:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

/**
 * Authenticated client shell with icon navigation.
 * Top header bar + content area + compact footer + mobile bottom nav.
 * 44px touch targets, focus rings, semantic nav.
 */
export const ClientLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Top header */}
      <header className="h-14 bg-surface border-b border-white/5 flex items-center px-6 justify-between shrink-0" role="banner">
        <Link to="/client/dashboard" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm">
          <Logo size={22} className="text-primary-container" />
          <span className="text-headline-sm font-bold tracking-tight">Enagram</span>
        </Link>
        <Link
          to="/client/profile"
          className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-label-caps text-on-surface/70 hover:bg-surface-container-highest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          aria-label="Profile"
        >
          U
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Compact footer */}
      <Footer compact />

      {/* Bottom nav — mobile */}
      <nav className="h-16 bg-surface border-t border-white/5 flex items-center justify-around shrink-0" aria-label="Client navigation">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] rounded-ui transition-colors ${
                active
                  ? 'text-primary-container'
                  : 'text-on-surface-variant/50 hover:text-on-surface'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container`}
            >
              {icons[item.icon]}
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
