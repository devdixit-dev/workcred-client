import { formatDistanceToNow } from 'date-fns';
import {
  Palmtree,
  Calendar,
  DollarSign,
  UserPlus,
  Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { activities } from '@/data/sampleData';

const typeIcons = {
  leave: Palmtree,
  attendance: Calendar,
  payroll: DollarSign,
  employee: UserPlus,
  announcement: Megaphone,
};

const typeColors = {
  leave: 'bg-warning/10 text-warning',
  attendance: 'bg-primary/10 text-primary',
  payroll: 'bg-success/10 text-success',
  employee: 'bg-success/10 text-success',
  announcement: 'bg-primary/10 text-primary',
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest updates and actions</p>
      </div>
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => {
          const Icon = typeIcons[activity.type];
          const colorClass = typeColors[activity.type];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg p-3 hr-transition hover:bg-secondary/50"
            >
              <div className={cn('rounded-lg p-2', colorClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
