import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { employees, payrolls } from '@/data/sampleData';
import { IndianRupee, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const MySalary = () => {
  const { user } = useAuth();
  
  // Get employee data (using first employee for demo)
  const employee = employees.find(emp => emp.email === user?.email) || employees[0];
  const salary = employee?.salary;
  const payroll = payrolls.find(p => p.employeeId === employee?.id);

  const grossSalary = salary ? salary.basic + salary.hra + salary.da + salary.allowances : 0;
  const pf = salary ? Math.round(salary.basic * 0.12) : 0;
  const tax = Math.round(grossSalary * 0.1);
  const totalDeductions = pf + tax + (salary?.deductions || 0);
  const netSalary = grossSalary - totalDeductions;

  const earningsData = [
    { component: 'Basic Salary', monthly: salary?.basic || 0, annual: (salary?.basic || 0) * 12 },
    { component: 'House Rent Allowance (HRA)', monthly: salary?.hra || 0, annual: (salary?.hra || 0) * 12 },
    { component: 'Dearness Allowance (DA)', monthly: salary?.da || 0, annual: (salary?.da || 0) * 12 },
    { component: 'Other Allowances', monthly: salary?.allowances || 0, annual: (salary?.allowances || 0) * 12 },
  ];

  const deductionsData = [
    { component: 'Provident Fund (PF)', monthly: pf, annual: pf * 12 },
    { component: 'Income Tax (TDS)', monthly: tax, annual: tax * 12 },
    { component: 'Other Deductions', monthly: salary?.deductions || 0, annual: (salary?.deductions || 0) * 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Salary Structure</h1>
        <p className="text-muted-foreground">View your complete salary breakdown and components</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gross Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(grossSalary)}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalDeductions)}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Salary</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(netSalary)}</div>
            <p className="text-xs text-muted-foreground">Take home</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual CTC</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(grossSalary * 12)}</div>
            <p className="text-xs text-muted-foreground">Per year</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="text-right">Annual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsData.map((item) => (
                <TableRow key={item.component}>
                  <TableCell className="font-medium">{item.component}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.monthly)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.annual)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Total Earnings</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(grossSalary)}</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(grossSalary * 12)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Deductions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Deductions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="text-right">Annual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deductionsData.map((item) => (
                <TableRow key={item.component}>
                  <TableCell className="font-medium">{item.component}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.monthly)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.annual)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Total Deductions</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(totalDeductions)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(totalDeductions * 12)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Net Salary Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <Table>
            <TableBody>
              <TableRow className="border-0">
                <TableCell className="font-bold text-lg">Net Salary (Take Home)</TableCell>
                <TableCell className="text-right font-bold text-lg text-primary">{formatCurrency(netSalary)}</TableCell>
                <TableCell className="text-right font-bold text-lg text-primary">{formatCurrency(netSalary * 12)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Last Payroll Info */}
      {payroll && (
        <Card>
          <CardHeader>
            <CardTitle>Last Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Month</p>
                <p className="font-medium">{payroll.month} {payroll.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={payroll.status === 'paid' ? 'default' : 'secondary'}>
                  {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processed On</p>
                <p className="font-medium">{payroll.processedOn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Amount</p>
                <p className="font-bold text-primary">{formatCurrency(payroll.netSalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MySalary;
