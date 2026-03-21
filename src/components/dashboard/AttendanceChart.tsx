import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import api from '@/api/axios.api';

export function AttendanceChart() {
  const [data, setData] = useState<{ day: string; present: number; absent: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/admin/dashboard');
      const rows = (res.data.data.weeklyAttendance || []).map((w: any) => ({
        day: String(w.day).slice(5),
        present: Number(w.present || 0),
        absent: Number(w.absent || 0),
      }));
      setData(rows);
    };

    load();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Weekly Attendance</h3>
        <p className="text-sm text-muted-foreground">This week's attendance overview</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(220, 13%, 91%)' }} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(220, 13%, 91%)' }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: 'hsl(220, 13%, 9%)', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="present" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#presentGradient)" name="Present" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive/30" />
          <span className="text-sm text-muted-foreground">Absent</span>
        </div>
      </div>
    </div>
  );
}
