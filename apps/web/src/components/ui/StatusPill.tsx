import React from 'react';

interface StatusPillProps {
  status: string;
  className?: string;
}

/**
 * StatusPill — maps domain statuses to design-system token colors.
 * No arbitrary Tailwind colors — uses surface/error/success/primary tokens.
 */
const statusStyles: Record<string, string> = {
  // Order lifecycle
  PENDING:         'bg-primary/15 text-primary border-primary/25',
  CONFIRMED:       'bg-surface-container-high text-on-surface-variant border-white/5',
  PREPARING:       'bg-primary-container/15 text-primary-container border-primary-container/25',
  READY:           'bg-success/15 text-success border-success/25',
  DELIVERED:       'bg-success/20 text-success border-success/30',
  COMPLETED:       'bg-surface-container-high text-on-surface-variant/70 border-white/8',
  CANCELLED:       'bg-error/15 text-error border-error/25',

  // Issue lifecycle
  OPEN:            'bg-error/15 text-error border-error/25',
  IN_PROGRESS:     'bg-primary-container/15 text-primary-container border-primary-container/25',
  RESOLVED:        'bg-success/15 text-success border-success/25',
  CLOSED:          'bg-surface-container-high text-on-surface-variant/70 border-white/8',

  // Approval lifecycle
  APPROVED:        'bg-success/15 text-success border-success/25',
  REJECTED:        'bg-error/15 text-error border-error/25',

  // General states
  ACTIVE:          'bg-success/15 text-success border-success/25',
  INACTIVE:        'bg-surface-container-high text-on-surface-variant/70 border-white/8',
  CRITICAL:        'bg-error/20 text-error border-error/30',
};

export const StatusPill = ({ status, className = '' }: StatusPillProps) => {
  const styles = statusStyles[status?.toUpperCase()] || 'bg-surface-container-high text-on-surface-variant/70 border-white/8';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles} ${className}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};
