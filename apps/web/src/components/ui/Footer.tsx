import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface FooterProps {
  /** Compact variant for sidebar layouts */
  compact?: boolean;
}

/**
 * Premium footer — used in PublicLayout and ClientLayout.
 * Full version for landing pages, compact for app shells.
 */
export const Footer = ({ compact = false }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="border-t border-white/5 py-4 px-6 text-center" role="contentinfo">
        <p className="text-label-xs text-on-surface-variant/30">
          © {currentYear} Enagram · All rights reserved
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 py-12 px-6 bg-surface" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Logo size={20} className="text-primary-container" />
              <span className="text-headline-sm text-on-surface font-bold tracking-tight">Enagram</span>
            </Link>
            <p className="text-body-sm text-on-surface-variant/50 leading-relaxed">
              Restaurant management platform for modern dining operations.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-label-caps text-on-surface font-semibold mb-3 tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-body-sm text-on-surface-variant/50 hover:text-on-surface transition-colors">Discover</Link></li>
              <li><Link to="/auth/register" className="text-body-sm text-on-surface-variant/50 hover:text-on-surface transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-label-caps text-on-surface font-semibold mb-3 tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/auth/staff" className="text-body-sm text-on-surface-variant/50 hover:text-on-surface transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-label-caps text-on-surface font-semibold mb-3 tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-body-sm text-on-surface-variant/30">Privacy Policy</span></li>
              <li><span className="text-body-sm text-on-surface-variant/30">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-label-xs text-on-surface-variant/30">
            © {currentYear} Enagram. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-label-xs text-on-surface-variant/20">Built for modern restaurants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
