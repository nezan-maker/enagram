import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  /** Title — e.g. "No restaurants yet" */
  title: string;
  /** Description — explains why it's empty */
  description?: string;
  /** CTA label — e.g. "Create your first restaurant" */
  actionLabel?: string;
  /** CTA href — react-router Link path */
  actionTo?: string;
  /** CTA click handler (alternative to actionTo) */
  onAction?: () => void;
  /** Icon — SVG or emoji */
  icon?: React.ReactNode;
  /** Variant affects illustration style */
  variant?: 'default' | 'search' | 'error' | 'permission';
}

const defaultIcons: Record<string, React.ReactNode> = {
  default: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant/30">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
    </svg>
  ),
  search: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant/30">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  error: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-error/50">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  permission: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant/30">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
};

/**
 * Premium empty state with illustration, explanation, and CTA.
 *
 * Every screen that can show zero items must use this instead of
 * raw text like "No restaurants yet."
 */
export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  icon,
  variant = 'default',
}: EmptyStateProps) => {
  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {displayIcon && (
        <div className="mb-5">{displayIcon}</div>
      )}
      <h3 className="text-headline-sm text-on-surface font-semibold">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-variant/60 mt-2 max-w-sm">{description}</p>
      )}
      {(actionLabel && (actionTo || onAction)) && (
        <div className="mt-6">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center px-5 py-2.5 rounded-ui bg-primary-container text-on-primary text-label-caps uppercase tracking-wider font-semibold hover:bg-[#e58900] transition-colors focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center px-5 py-2.5 rounded-ui bg-primary-container text-on-primary text-label-caps uppercase tracking-wider font-semibold hover:bg-[#e58900] transition-colors focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
