import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Logo } from '../components/ui/Logo';

interface StaffLayoutProps {
  rolePrefix: string;
  navItems: { name: string; path: string }[];
}

const IconMenu = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-ui';

/**
 * Staff layout shell — consistent sidebar for all staff roles.
 * Mobile: hamburger + slide-in sidebar. Desktop: static sidebar.
 */
export const StaffLayout = ({ rolePrefix, navItems }: StaffLayoutProps) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-surface-dim overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-in" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-56 bg-surface border-r border-white/5 flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label={`${rolePrefix} sidebar`}
      >
        {/* Brand + close */}
        <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-3 ${focusRing}`}>
            <Logo size={24} className="text-primary-container" />
            <div>
              <h1 className="text-headline-sm text-on-surface font-bold tracking-tight">Enagram</h1>
              <p className="text-label-caps text-on-surface-variant/60 mt-0.5 capitalize">{String(user?.role || '').toLowerCase().replace('_', ' ')}</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className={`lg:hidden text-on-surface-variant/60 hover:text-on-surface p-1.5 ${focusRing}`} aria-label="Close sidebar">
            <IconClose />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`block px-3 py-2.5 rounded-ui text-body-md transition-colors ${focusRing} ${
                  active
                    ? 'bg-primary-container/8 text-primary-container'
                    : 'text-on-surface/70 hover:text-on-surface hover:bg-white/5'
                }`}
              >
                {item.name}
                {active && <span className="ml-2 inline-block w-1 h-4 rounded-full bg-primary-container align-middle" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          <Link to="/" className={`block px-3 py-2.5 rounded-ui text-body-md text-on-surface/50 hover:text-on-surface transition-colors ${focusRing}`}>
            Back to Portal
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header bar */}
        <div className="lg:hidden h-14 bg-surface border-b border-white/5 flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className={`text-on-surface-variant/60 hover:text-on-surface p-2 ${focusRing}`} aria-label="Open sidebar">
            <IconMenu />
          </button>
          <span className="text-headline-sm text-on-surface font-bold truncate">
            {navItems.find((n) => location.pathname.startsWith(n.path))?.name || 'Dashboard'}
          </span>
        </div>

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
