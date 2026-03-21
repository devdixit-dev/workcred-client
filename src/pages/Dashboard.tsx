import { useEffect, useMemo, useState } from 'react';
import { Users, Calendar, Palmtree, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api/axios.api';

export default function Dashboard() {
  const { isAdmin, user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const endpoint = isAdmin ? '/admin/dashboard' : '/user/dashboard';
      const res = await api.get(endpoint);
      setData(res.data.data);
    };

    fetchDashboard();
  }, [isAdmin]);

  const monthlyPayrollLakhs = useMemo(
    () => Number((Number(data?.monthlyPayroll || 0) / 100000).toFixed(1)),
    [data?.monthlyPayroll]
  );

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

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to HR Portal. Here's what's happening today.</p>
      </div>

      <QuickActions />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={data?.totalEmployees || 0}
          subtitle="Active workforce"
          icon={Users}
          variant="primary"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Present Today"
          value={data?.presentToday || 0}
          subtitle={`Out of ${data?.totalEmployees || 0}`}
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Pending Leaves"
          value={data?.pendingLeaves || 0}
          subtitle="Awaiting approval"
          icon={Palmtree}
          variant="warning"
        />
        <StatCard
          title="Monthly Payroll"
          value={`INR ${monthlyPayrollLakhs}L`}
          subtitle="Gross salary"
          icon={DollarSign}
          variant="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceChart />
        <DepartmentChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </div>
  );
}
