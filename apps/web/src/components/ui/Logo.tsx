import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Enagram Brand Logo — Hexagonal circuit-board design.
 *
 * A hexagon outline enclosing three branching circuit traces:
 * - Orange (top): accent — represents the primary brand color
 * - White (middle): primary — represents core operations
 * - Gray (bottom): secondary — represents supporting systems
 *
 * This replaces the previous monogram-style logo.
 * Derived from Gemini_Generated_Image_6ohecw6ohecw6ohe.png
 */
export const Logo = ({ className = '', size = 24 }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-current ${className}`}
    >
      {/* Hexagonal outline — sharp corners */}
      <path
        d="M60 6L108 33V87L60 114L12 87V33L60 6Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Main trunk — originates from left, branches into 3 */}
      <line x1="26" y1="60" x2="52" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Top branch — orange accent */}
      <path
        d="M52 60C56 55 62 42 72 38"
        stroke="#FF9800"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="76" cy="36" r="4.5" fill="#FF9800" />

      {/* Middle branch — white/primary */}
      <line x1="52" y1="60" x2="82" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="86" cy="60" r="4.5" fill="currentColor" />

      {/* Bottom branch — muted gray */}
      <path
        d="M52 60C56 65 62 78 72 82"
        stroke="#9E9E9E"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="76" cy="84" r="4.5" fill="#9E9E9E" />

      {/* Junction node at branch origin */}
      <circle cx="52" cy="60" r="3" fill="currentColor" />
    </svg>
  );
};

export default Logo;
