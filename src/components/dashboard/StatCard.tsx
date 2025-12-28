import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: {
    iconBg: 'bg-secondary',
    iconColor: 'text-foreground',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card hr-card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('rounded-lg p-3', styles.iconBg)}>
          <Icon className={cn('h-6 w-6', styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
