import React, { Suspense } from 'react';

interface LazyChartProps {
  children: React.ReactNode;
}

/**
 * Wraps recharts components in React.lazy + Skeleton fallback.
 * Import charts via this wrapper to enable code splitting:
 *
 *   const { BarChart, Bar, XAxis, YAxis } = await import('recharts');
 *   <LazyChart>
 *     <BarChart>…</BarChart>
 *   </LazyChart>
 */
export const LazyChart = ({ children }: LazyChartProps) => (
  <Suspense fallback={
    <div className="h-48 bg-surface-container-high rounded-ui animate-pulse flex items-center justify-center">
      <span className="text-label-caps text-on-surface-variant/30">Loading chart…</span>
    </div>
  }>
    {children}
  </Suspense>
);

/**
 * Pre-lazy-load the recharts module.
 * Call this in a useEffect on pages that use charts to start loading
 * before the chart renders.
 */
export const preloadRecharts = () => {
  import('recharts');
};
