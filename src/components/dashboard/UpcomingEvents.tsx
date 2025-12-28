import { Cake, Calendar, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

const events = [
  {
    id: 1,
    type: 'birthday',
    name: 'Priya Sharma',
    date: 'Dec 18',
    icon: Cake,
    color: 'bg-warning/10 text-warning',
  },
  {
    id: 2,
    type: 'anniversary',
    name: 'Rajesh Kumar',
    date: 'Dec 20',
    info: '5 years',
    icon: Gift,
    color: 'bg-success/10 text-success',
  },
  {
    id: 3,
    type: 'holiday',
    name: 'Christmas',
    date: 'Dec 25',
    icon: Calendar,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 4,
    type: 'birthday',
    name: 'Amit Patel',
    date: 'Dec 28',
    icon: Cake,
    color: 'bg-warning/10 text-warning',
  },
];

export function UpcomingEvents() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
        <p className="text-sm text-muted-foreground">Birthdays, anniversaries & holidays</p>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 rounded-lg p-3 hr-transition hover:bg-secondary/50"
          >
            <div className={cn('rounded-lg p-2', event.color)}>
              <event.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{event.name}</p>
              {event.info && (
                <p className="text-xs text-muted-foreground">{event.info}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{event.date}</p>
              <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
