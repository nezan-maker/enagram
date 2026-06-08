import { Link } from 'react-router-dom';

/**
 * 404 — Premium not-found screen.
 * Clear hierarchy, inline illustration, single CTA.
 */
export const NotFound = () => (
  <div className="min-h-screen bg-surface-dim text-on-surface flex items-center justify-center p-6">
    <div className="text-center max-w-sm animate-in">
      {/* Illustration — hex outline with break */}
      <div className="mx-auto mb-8 w-24 h-24 text-on-surface-variant/20">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M60 6L108 33V87L60 114L12 87V33L60 6Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeDasharray="12 8" />
          <line x1="40" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="40" y1="70" x2="80" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-display font-bold">404</h1>
      <p className="text-body-lg text-on-surface-variant/60 mt-3">This page doesn't exist — or it was moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-ui bg-primary-container text-on-primary text-label-caps uppercase tracking-wider font-semibold hover:bg-[#e58900] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Home
      </Link>
    </div>
  </div>
);
