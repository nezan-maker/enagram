import React from 'react';

interface SkeletonProps {
  className?: string;
  /** Render multiple skeleton lines */
  lines?: number;
  /** Width of each line — accepts tailwind width class or CSS value */
  width?: string;
  /** Height — defaults to 14px (body-md height) */
  height?: string;
  /** Gap between lines */
  gap?: string;
  /** Custom shape variant */
  variant?: 'text' | 'circle' | 'card' | 'avatar';
}

/**
 * Premium skeleton loader with shimmer animation.
 * Mimics final content layout for seamless perceived loading.
 *
 * Usage:
 *   <Skeleton variant="card" />            → card-shaped block
 *   <Skeleton lines={3} />                 → 3 lines of text
 *   <Skeleton variant="avatar" />          → circular avatar placeholder
 *   <Skeleton variant="circle" width="48px" height="48px" /> → custom circle
 */
export const Skeleton = ({
  className = '',
  lines,
  width,
  height,
  gap = '8px',
  variant = 'text',
}: SkeletonProps) => {
  const base = 'animate-pulse rounded-ui bg-surface-container-high';

  const variantStyles: Record<string, string> = {
    text: `${base} h-4 ${width || 'w-full'}`,
    circle: `${base} rounded-full ${width || 'w-10'} ${height || 'h-10'}`,
    avatar: `${base} rounded-full w-10 h-10`,
    card: `${base} rounded-container h-32 w-full`,
  };

  if (variant === 'card' || variant === 'circle' || variant === 'avatar') {
    return <div className={`${variantStyles[variant]} ${className}`} />;
  }

  // Text variant — single or multi-line
  if (lines && lines > 1) {
    return (
      <div className={`flex flex-col ${className}`} style={{ gap }}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={variantStyles.text}
            style={{
              width: i === lines - 1 ? '60%' : '100%',          // last line shorter — natural
              height: height || undefined,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${variantStyles.text} ${className}`}
      style={{ width: width || undefined, height: height || undefined }}
    />
  );
};

/**
 * Pre-built skeleton patterns for common page sections.
 */
export const SkeletonKPI = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="bg-gradient-to-br from-[#1b1b1c] to-[#131313] border border-white/5 rounded-container p-5 space-y-3">
        <Skeleton width="60px" height="10px" />
        <Skeleton width="80px" height="28px" />
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-gradient-to-br from-[#1b1b1c] to-[#131313] border border-white/5 rounded-container p-4">
    {/* Header */}
    <div className="flex gap-4 mb-4 pb-3 border-b border-white/5">
      <Skeleton width="120px" height="12px" />
      <Skeleton width="80px" height="12px" />
      <Skeleton width="100px" height="12px" />
      <Skeleton width="60px" height="12px" />
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
        <Skeleton width="100px" height="14px" />
        <Skeleton width="70px" height="14px" />
        <Skeleton width="90px" height="14px" />
        <Skeleton width="50px" height="14px" />
      </div>
    ))}
  </div>
);

export const SkeletonCardGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-gradient-to-br from-[#1b1b1c] to-[#131313] border border-white/5 rounded-container overflow-hidden">
        <div className="h-48 bg-surface-container-high animate-pulse" />
        <div className="p-5 space-y-3">
          <Skeleton width="70%" height="18px" />
          <Skeleton width="50%" height="13px" />
          <Skeleton lines={2} />
        </div>
      </div>
    ))}
  </div>
);
