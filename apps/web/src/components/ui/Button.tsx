import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** When true, shows spinner and disables interaction */
  loading?: boolean;
}

/**
 * Premium Button component matching DESIGN.md spec.
 *
 * Variants:
 * - primary:   Orange fill, dark text — primary actions
 * - secondary: Transparent, bordered — secondary actions
 * - danger:    Red fill — destructive actions
 * - ghost:     No border, no fill — tertiary/minimal actions
 *
 * Sizes:
 * - sm: Compact — used in tables, card footers
 * - md: Default — standard forms
 * - lg: Prominent — hero CTAs, onboarding
 *
 * All variants include focus-visible ring for accessibility.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) => {
  // Focus ring — applied to all variants
  const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

  // Size scale
  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3',
  };

  // Variant styles
  const variants = {
    primary: `${focus} bg-primary-container text-on-primary hover:bg-[#e58900] active:bg-[#cc7a00]`,
    secondary: `${focus} bg-transparent border border-outline-variant text-on-surface hover:bg-white/5 active:bg-white/10`,
    danger: `${focus} bg-error-container text-error hover:bg-[#b0000c] active:bg-[#d0000e]`,
    ghost: `${focus} bg-transparent text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5 active:bg-white/10`,
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-ui text-label-caps uppercase tracking-wider font-semibold
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
