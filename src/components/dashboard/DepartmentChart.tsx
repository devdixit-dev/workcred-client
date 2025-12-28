import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { departments } from '@/data/sampleData';

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(160, 84%, 39%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 67%, 55%)',
  'hsl(180, 70%, 45%)',
];

const data = departments.map((dept) => ({
  name: dept.name,
  value: dept.employeeCount,
}));

export function DepartmentChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Department Distribution</h3>
        <p className="text-sm text-muted-foreground">Employees by department</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value} employees`, 'Count']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
