import { Link } from 'react-router-dom';
import { UserPlus, Clock, FileText, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const adminActions = [
  {
    name: 'Add Employee',
    href: '/employees/add',
    icon: UserPlus,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    name: 'Mark Attendance',
    href: '/attendance',
    icon: Clock,
    color: 'bg-success/10 text-success hover:bg-success/20',
  },
  {
    name: 'Apply Leave',
    href: '/leave/apply',
    icon: FileText,
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
  {
    name: 'Run Payroll',
    href: '/payroll',
    icon: DollarSign,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
];

const employeeActions = [
  {
    name: 'Check In/Out',
    href: '/my-attendance',
    icon: Clock,
    color: 'bg-success/10 text-success hover:bg-success/20',
  },
  {
    name: 'Apply Leave',
    href: '/leave/apply',
    icon: FileText,
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
];

export function QuickActions() {
  const { isAdmin } = useAuth();
  const actions = isAdmin ? adminActions : employeeActions;

  return (
    <div className={cn(
      'grid gap-3',
      isAdmin ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
    )}>
      {actions.map((action) => (
        <Link
          key={action.name}
          to={action.href}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hr-transition hr-card-hover',
          )}
        >
          <div className={cn('rounded-lg p-3', action.color)}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-foreground">{action.name}</span>
        </Link>
      ))}
    </div>
  );
}