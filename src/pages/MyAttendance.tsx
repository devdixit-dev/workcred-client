import { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { Clock, CheckCircle2, XCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api/axios.api';

export default function MyAttendance() {
  const { user, company } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [myAttendance, setMyAttendance] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/user/attendance');
      setMyAttendance(res.data.data || []);
    };

    load();
  }, [user?.id]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const stats = useMemo(() => {
    const monthAttendance = myAttendance.filter((a) => {
      const date = parseISO(a.date);
      return isSameMonth(date, currentDate);
    });

    return {
      present: monthAttendance.filter((a) => a.status === 'present').length,
      absent: monthAttendance.filter((a) => a.status === 'absent').length,
      halfDay: monthAttendance.filter((a) => a.status === 'half-day').length,
      leave: monthAttendance.filter((a) => a.status === 'leave').length,
    };
  }, [myAttendance, currentDate]);

  const todayAttendance = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return myAttendance.find((a) => a.date === todayStr);
  }, [myAttendance]);

  const getAttendanceForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return myAttendance.find((a) => a.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'absent': return 'bg-destructive text-destructive-foreground';
      case 'half-day': return 'bg-warning text-warning-foreground';
      case 'leave': return 'bg-primary text-primary-foreground';
      case 'weekend': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return { text: 'Not Marked', color: 'bg-secondary text-secondary-foreground' };
    switch (status) {
      case 'present': return { text: 'Present', color: 'bg-success/10 text-success' };
      case 'absent': return { text: 'Absent', color: 'bg-destructive/10 text-destructive' };
      case 'half-day': return { text: 'Half Day', color: 'bg-warning/10 text-warning' };
      case 'leave': return { text: 'On Leave', color: 'bg-primary/10 text-primary' };
      default: return { text: 'Not Marked', color: 'bg-secondary text-secondary-foreground' };
    }
  };

  const statusBadge = getStatusBadge(todayAttendance?.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Attendance</h1>
          <p className="text-muted-foreground">Track your daily attendance and working hours</p>
        </div>
      </div>

      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Today's Attendance</CardTitle>
          <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-center"><p className="text-sm text-muted-foreground mb-1">Status</p><span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusBadge.color)}>{statusBadge.text}</span></div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center"><p className="text-sm text-muted-foreground mb-1">Check In</p><p className="text-2xl font-bold text-foreground">{todayAttendance?.checkIn || '--:--'}</p></div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center"><p className="text-sm text-muted-foreground mb-1">Check Out</p><p className="text-2xl font-bold text-foreground">{todayAttendance?.checkOut || '--:--'}</p></div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center"><p className="text-sm text-muted-foreground mb-1">Working Hours</p><p className="text-2xl font-bold text-foreground">{company?.workingHours ? `${company.workingHours.start} - ${company.workingHours.end}` : '09:00 - 18:00'}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><CheckCircle2 className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold text-foreground">{stats.present}</p><p className="text-sm text-muted-foreground">Present</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-destructive/10 p-2"><XCircle className="h-5 w-5 text-destructive" /></div><div><p className="text-2xl font-bold text-foreground">{stats.absent}</p><p className="text-sm text-muted-foreground">Absent</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-2xl font-bold text-foreground">{stats.halfDay}</p><p className="text-sm text-muted-foreground">Half Day</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Calendar className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold text-foreground">{stats.leave}</p><p className="text-sm text-muted-foreground">On Leave</p></div></div></CardContent></Card>
      </div>

      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="min-w-[140px] text-center font-medium">{format(currentDate, 'MMMM yyyy')}</span>
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (<div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">{day}</div>))}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (<div key={`empty-${i}`} className="p-2" />))}
            {daysInMonth.map((day) => {
              const attendance = getAttendanceForDay(day);
              const dayOfWeek = day.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

              return (
                <div key={day.toISOString()} className={cn('relative p-2 rounded-lg text-center min-h-[60px] flex flex-col items-center justify-center', isToday(day) && 'ring-2 ring-primary', attendance ? getStatusColor(attendance.status) : isWeekend ? 'bg-secondary/50' : 'bg-secondary/20')}>
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  {attendance && attendance.checkIn && <span className="text-xs opacity-80">{attendance.checkIn}</span>}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-success" /><span className="text-sm text-muted-foreground">Present</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-destructive" /><span className="text-sm text-muted-foreground">Absent</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-warning" /><span className="text-sm text-muted-foreground">Half Day</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary" /><span className="text-sm text-muted-foreground">Leave</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-secondary" /><span className="text-sm text-muted-foreground">Weekend</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
