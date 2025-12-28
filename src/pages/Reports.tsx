import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileText, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { departments, employees, payrolls } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';

const attendanceData = [
  { month: 'Jul', present: 92, absent: 8 },
  { month: 'Aug', present: 95, absent: 5 },
  { month: 'Sep', present: 88, absent: 12 },
  { month: 'Oct', present: 94, absent: 6 },
  { month: 'Nov', present: 91, absent: 9 },
  { month: 'Dec', present: 93, absent: 7 },
];

const departmentData = departments.map((dept) => ({
  name: dept.name,
  employees: dept.employeeCount,
}));

const turnoverData = [
  { month: 'Jul', joined: 2, left: 1 },
  { month: 'Aug', joined: 3, left: 0 },
  { month: 'Sep', joined: 1, left: 2 },
  { month: 'Oct', joined: 4, left: 1 },
  { month: 'Nov', joined: 2, left: 0 },
  { month: 'Dec', joined: 1, left: 0 },
];

const payrollTrend = [
  { month: 'Jul', amount: 28 },
  { month: 'Aug', amount: 29 },
  { month: 'Sep', amount: 30 },
  { month: 'Oct', amount: 31 },
  { month: 'Nov', amount: 32 },
  { month: 'Dec', amount: 33 },
];

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(160, 84%, 39%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 67%, 55%)',
  'hsl(180, 70%, 45%)',
];

const reportTypes = [
  { name: 'Headcount Report', icon: Users, description: 'Employee count by department' },
  { name: 'Attendance Summary', icon: Calendar, description: 'Monthly attendance statistics' },
  { name: 'Payroll Report', icon: DollarSign, description: 'Salary and deductions breakdown' },
  { name: 'Turnover Analysis', icon: TrendingUp, description: 'Hiring and attrition trends' },
];

export default function Reports() {
  const { toast } = useToast();

  const handleDownload = (reportName: string) => {
    toast({
      title: 'Generating Report',
      description: `${reportName} is being generated...`,
    });
  };

  const totalPayroll = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Insights and data visualization for HR metrics</p>
      </div>

      {/* Quick Report Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        {reportTypes.map((report) => (
          <Card key={report.name} className="hr-shadow-card hr-card-hover cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <report.icon className="h-5 w-5 text-primary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(report.name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 animate-slide-up">
        {/* Attendance Trend */}
        <Card className="hr-shadow-card">
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Monthly attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 13%, 91%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="present" fill="hsl(160, 84%, 39%)" name="Present %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="hr-shadow-card">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees per department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="employees"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 13%, 91%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Turnover Analysis */}
        <Card className="hr-shadow-card">
          <CardHeader>
            <CardTitle>Employee Turnover</CardTitle>
            <CardDescription>Hiring vs Attrition trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 13%, 91%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="joined"
                    stroke="hsl(160, 84%, 39%)"
                    strokeWidth={2}
                    name="Joined"
                    dot={{ fill: 'hsl(160, 84%, 39%)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="left"
                    stroke="hsl(0, 84%, 60%)"
                    strokeWidth={2}
                    name="Left"
                    dot={{ fill: 'hsl(0, 84%, 60%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Trend */}
        <Card className="hr-shadow-card">
          <CardHeader>
            <CardTitle>Payroll Trend</CardTitle>
            <CardDescription>Monthly payroll expenditure (in Lakhs)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                    tickFormatter={(value) => `₹${value}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 13%, 91%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`₹${value}L`, 'Payroll']}
                  />
                  <Bar dataKey="amount" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
        <Card className="hr-shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Workforce</p>
              <p className="text-4xl font-bold text-foreground mt-2">{employees.length}</p>
              <p className="text-sm text-success mt-1">+5% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hr-shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Avg. Attendance</p>
              <p className="text-4xl font-bold text-foreground mt-2">92%</p>
              <p className="text-sm text-success mt-1">+2% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hr-shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Monthly Payroll</p>
              <p className="text-4xl font-bold text-foreground mt-2">
                ₹{(totalPayroll / 100000).toFixed(1)}L
              </p>
              <p className="text-sm text-muted-foreground mt-1">November 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
