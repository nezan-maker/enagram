import { Outlet, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Footer } from '../components/ui/Footer';
import { useAuthStore } from '../store/auth.store';

/**
 * Public layout — unauthenticated browsing.
 * Top navbar + content area + footer.
 * Uses design-system tokens, proper semantics, focus rings.
 */
export const PublicLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <header className="h-18 bg-surface border-b border-white/5 flex items-center px-6 justify-between shrink-0" role="banner">
        <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm">
          <Logo size={22} className="text-primary-container" />
          <span className="text-headline-sm text-on-surface font-bold tracking-tight">Enagram</span>
        </Link>
        <nav className="flex items-center gap-4" aria-label="Public navigation">
          {isAuthenticated ? (
            <>
              <Link
                to="/client/dashboard"
                className="text-body-md text-on-surface-variant/70 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm px-1"
              >
                Dashboard
              </Link>
              <Link
                to="/client/profile"
                className="text-label-caps bg-primary-container text-on-primary px-4 py-2 rounded-ui hover:bg-[#e58900] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {(user?.firstName as string) || 'My Account'}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-body-md text-on-surface-variant/70 hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm px-1"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="text-label-caps bg-primary-container text-on-primary px-4 py-2 rounded-ui hover:bg-[#e58900] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
