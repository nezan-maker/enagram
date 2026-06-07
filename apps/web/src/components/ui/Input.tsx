import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Floating label text */
  label: string;
  /** Error message — shows red ring + error text below */
  error?: string;
  /** Icon slot (left) */
  icon?: React.ReactNode;
  /** Full-width */
  fullWidth?: boolean;
}

/**
 * Premium Input with floating label, error state, and focus ring.
 *
 * Uses design-system tokens exclusively:
 * - bg: surface-container-low
 * - border: outline-variant → primary-container on focus
 * - text: on-surface
 * - label: on-surface-variant → primary-container on focus
 * - error: error color
 *
 * Implements the floating-label pattern used in auth forms,
 * now standardized as a reusable component.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            peer w-full
            bg-surface-container-low
            border ${error ? 'border-error' : 'border-outline-variant'}
            rounded-ui
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            text-body-md text-on-surface
            placeholder-transparent
            focus:outline-none
            focus:border-primary-container
            focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface
            transition-all
          `}
          placeholder={label}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={`
            absolute left-4 top-3.5
            text-body-md text-on-surface-variant/60
            transition-all pointer-events-none
            peer-placeholder-shown:top-3.5
            peer-placeholder-shown:text-body-md
            peer-placeholder-shown:text-on-surface-variant/60
            peer-focus:top-1
            peer-focus:text-[11px]
            peer-focus:text-primary-container
            peer-[:not(:placeholder-shown)]:top-1
            peer-[:not(:placeholder-shown)]:text-[11px]
            peer-[:not(:placeholder-shown)]:text-primary-container
            ${icon ? 'left-10' : 'left-4'}
          `}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-[12px] text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
