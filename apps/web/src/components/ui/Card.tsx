import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** Subtle gradient background variant */
  variant?: 'default' | 'elevated';
  /** Adds hover effect, cursor pointer, and focus ring for clickable cards */
  interactive?: boolean;
}

/**
 * Premium Card component
 * - Subtle gradient background (from DESIGN.md)
 * - Ultra-thin, low-opacity border
 * - Optional interactive mode: hover elevate + focus ring
 * - Passes through div attributes (onClick, role, etc.)
 */
export const Card = ({ children, className = '', interactive = false, ...rest }: CardProps) => {
  // No visible border by default — the dark gradient is enough
  const baseClasses = 'bg-gradient-to-br from-[#1b1b1c] to-[#131313] rounded-container';
  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
    : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`} {...rest}>
      {children}
    </div>
  );
};
