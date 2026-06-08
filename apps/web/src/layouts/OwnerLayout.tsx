import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useFeature } from '../hooks/useFeature';
import { Feature } from '../policies/feature.policy';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

// SVG icon components
const IconOverview = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const IconRestaurants = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M13 21V3l6 4v14"/><path d="M9 13h2"/><path d="M15 11h2"/></svg>;
const IconApprovals = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const IconReports = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>;
const IconIssues = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IconSupport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconMenu = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const navConfig = [
  { name: 'Overview', path: '/owner/dashboard', icon: <IconOverview /> },
  { name: 'Restaurants', path: '/owner/restaurants', icon: <IconRestaurants /> },
  { name: 'Staff', path: '/owner/staff', icon: <IconUsers /> },
  { name: 'Approvals', path: '/owner/approvals', icon: <IconApprovals />, feature: Feature.APPROVALS_SYSTEM },
  { name: 'Reports', path: '/owner/reports', icon: <IconReports />, feature: Feature.ADVANCED_REPORTING },
  { name: 'Issues', path: '/owner/issues', icon: <IconIssues />, feature: Feature.ISSUES_HUB },
];

const bottomNav = [
  { name: 'Settings', path: '/owner/settings', icon: <IconSettings /> },
  { name: 'Support', path: '/owner/support', icon: <IconSupport /> },
];

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-ui';

export const OwnerLayout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Gate features at layout level
  const showApprovals = useFeature(Feature.APPROVALS_SYSTEM);
  const showReports = useFeature(Feature.ADVANCED_REPORTING);
  const showIssues = useFeature(Feature.ISSUES_HUB);
  const featureGate: Record<string, boolean> = {
    [Feature.APPROVALS_SYSTEM]: showApprovals,
    [Feature.ADVANCED_REPORTING]: showReports,
    [Feature.ISSUES_HUB]: showIssues,
  };

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Close sidebar on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen bg-surface-dim overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-in"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — fixed on mobile, static on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Owner sidebar"
      >
        {/* Brand + close button */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <Link to="/owner/dashboard" className={`flex items-center gap-3 ${focusRing}`}>
            <Logo size={28} className="text-primary-container" />
            <div>
              <h1 className="text-headline-sm text-on-surface font-bold tracking-tight">Enagram</h1>
              <p className="text-label-caps text-on-surface-variant/60 mt-0.5">Restaurant Management</p>
            </div>
          </Link>
          <button
            onClick={closeSidebar}
            className={`lg:hidden text-on-surface-variant/60 hover:text-on-surface p-1.5 ${focusRing}`}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navConfig.map((item) => {
            if (item.feature && !featureGate[item.feature]) return null;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-ui text-body-md transition-colors ${focusRing} ${
                  active
                    ? 'bg-primary-container/8 text-primary-container'
                    : 'text-on-surface/70 hover:text-on-surface hover:bg-white/5'
                }`}
              >
                <span className="w-5 flex items-center justify-center">{item.icon}</span>
                <span>{item.name}</span>
                {active && <span className="ml-auto w-1 h-4 rounded-full bg-primary-container" />}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="px-4 pb-3">
          <Button variant="primary" className="w-full">+ New Request</Button>
        </div>

        {/* Bottom Nav */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          {bottomNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive(item.path) ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-ui text-body-md transition-colors ${focusRing} ${
                isActive(item.path)
                  ? 'text-on-surface bg-white/5'
                  : 'text-on-surface/50 hover:text-on-surface hover:bg-white/5'
              }`}
            >
              <span className="w-5 flex items-center justify-center">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header Bar */}
        <header className="h-14 bg-surface border-b border-white/5 flex items-center px-4 lg:px-6 gap-4 shrink-0" role="banner">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden text-on-surface-variant/60 hover:text-on-surface p-2.5 -ml-1 ${focusRing}`}
            aria-label="Open sidebar"
          >
            <IconMenu />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-body-md" aria-label="Breadcrumb">
            <span className="text-on-surface-variant/60 hidden sm:inline">Portfolio</span>
            <span className="text-on-surface-variant/30 hidden sm:inline">/</span>
            <span className="text-on-surface font-medium">Overview</span>
          </nav>

          <div className="flex-1" />

          {/* Search — hidden on small screens */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search...  ⌘K"
              className="w-56 bg-surface-container-low border border-white/5 rounded-ui px-3 py-1.5 text-body-md text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-colors"
            />
          </div>

          {/* Header icons */}
          <button className={`text-on-surface-variant/60 hover:text-on-surface transition-colors p-2.5 hidden sm:flex ${focusRing}`} aria-label="Clock">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
          <button className={`text-on-surface-variant/60 hover:text-on-surface transition-colors p-2.5 relative ${focusRing}`} aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>
          <button className={`w-9 h-9 rounded-full bg-surface-container-high border border-white/8 flex items-center justify-center text-label-caps text-on-surface/70 hover:bg-surface-container-highest transition-colors ${focusRing}`} aria-label="User menu">
            AV
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
