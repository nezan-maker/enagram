import React from 'react';
import { Card } from './Card';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon?: React.ReactNode;
}

/**
 * KPI Card matching the owner_dashboard mockup
 * Uppercase label, large value, optional trend indicator
 */
export const KPICard = ({ title, value, subtitle, trend, icon }: KPICardProps) => {
  return (
    <Card className="flex flex-col gap-2 p-5">
      <div className="flex justify-between items-start">
        <span className="text-label-caps text-on-surface-variant/70 uppercase tracking-wider">{title}</span>
        {icon && <span className="text-primary-container">{icon}</span>}
      </div>
      <div className="text-headline-md font-bold text-on-surface">{value}</div>
      {trend && (
        <span className={`text-sm font-medium ${trend.positive ? 'text-success' : 'text-error'}`}>
          {trend.value}
        </span>
      )}
      {subtitle && !trend && (
        <p className="text-body-md text-on-surface-variant/60">{subtitle}</p>
      )}
    </Card>
  );
};
