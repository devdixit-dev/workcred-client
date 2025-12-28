import { Users, Calendar, Palmtree, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { employees, leaves, attendance } from '@/data/sampleData';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { isAdmin, user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(
    (a) => a.date === today && a.status === 'present'
  );
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const totalPayroll = employees.reduce((sum, emp) => {
    const gross = emp.salary.basic + emp.salary.hra + emp.salary.da + emp.salary.allowances;
    return sum + gross;
  }, 0);

  // Employee Dashboard - simplified view
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name?.split(' ')[0] || 'Employee'}!</h1>
          <p className="text-muted-foreground">Here's your quick access to important actions.</p>
        </div>

        <QuickActions />

        <UpcomingEvents />
      </div>
    );
  }

  // Admin Dashboard - full view
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to HR Portal. Here's what's happening today.</p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={employees.length}
          subtitle="Active workforce"
          icon={Users}
          variant="primary"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Present Today"
          value={todayAttendance.length}
          subtitle={`Out of ${employees.length}`}
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length}
          subtitle="Awaiting approval"
          icon={Palmtree}
          variant="warning"
        />
        <StatCard
          title="Monthly Payroll"
          value={`₹${(totalPayroll / 100000).toFixed(1)}L`}
          subtitle="Gross salary"
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceChart />
        <DepartmentChart />
      </div>

      {/* Activity & Events Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </div>
  );
}