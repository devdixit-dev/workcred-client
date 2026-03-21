import { useEffect, useMemo, useState } from 'react';
import { DollarSign, Download, FileText, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { departments } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios.api';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Payroll() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState(new Date().toLocaleString('en-IN', { month: 'long' }));
  const [payrolls, setPayrolls] = useState<any[]>([]);

  const loadPayroll = async () => {
    const res = await api.get('/admin/payroll', { params: { month: monthFilter, year: new Date().getFullYear() } });
    setPayrolls(res.data.data || []);
  };

  useEffect(() => {
    loadPayroll();
  }, [monthFilter]);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) => {
      const matchesSearch =
        (payroll.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payroll.employeeCode || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === 'all' || payroll.employeeDepartment === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [payrolls, searchQuery, departmentFilter]);

  const totalGross = filteredPayrolls.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalDeductions = filteredPayrolls.reduce((sum, p) => sum + p.totalDeductions, 0);
  const totalNet = filteredPayrolls.reduce((sum, p) => sum + p.netSalary, 0);

  const handleProcessPayroll = async () => {
    await api.post('/admin/payroll/run', { month: monthFilter, year: new Date().getFullYear() }, { notifySuccess: false });
    toast({ title: 'Payroll Processing', description: `${monthFilter} payroll has been processed.` });
    await loadPayroll();
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Payroll report is being generated.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">Process and manage employee payroll</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button onClick={handleProcessPayroll} className="hr-gradient"><DollarSign className="mr-2 h-4 w-4" />Run Payroll</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-5 hr-shadow-card"><p className="text-sm text-muted-foreground">Total Employees</p><p className="text-2xl font-bold text-foreground mt-1">{filteredPayrolls.length}</p></div>
        <div className="rounded-xl border border-border bg-card p-5 hr-shadow-card"><p className="text-sm text-muted-foreground">Gross Salary</p><p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalGross)}</p></div>
        <div className="rounded-xl border border-border bg-card p-5 hr-shadow-card"><p className="text-sm text-muted-foreground">Total Deductions</p><p className="text-2xl font-bold text-destructive mt-1">{formatCurrency(totalDeductions)}</p></div>
        <div className="rounded-xl border border-border bg-card p-5 hr-shadow-card"><p className="text-sm text-muted-foreground">Net Payable</p><p className="text-2xl font-bold text-success mt-1">{formatCurrency(totalNet)}</p></div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row animate-slide-up">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}><SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map((dept) => (<SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>))}</SelectContent></Select>
        <Select value={monthFilter} onValueChange={setMonthFilter}><SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Month" /></SelectTrigger><SelectContent><SelectItem value="January">January</SelectItem><SelectItem value="February">February</SelectItem><SelectItem value="March">March</SelectItem><SelectItem value="April">April</SelectItem><SelectItem value="May">May</SelectItem><SelectItem value="June">June</SelectItem><SelectItem value="July">July</SelectItem><SelectItem value="August">August</SelectItem><SelectItem value="September">September</SelectItem><SelectItem value="October">October</SelectItem><SelectItem value="November">November</SelectItem><SelectItem value="December">December</SelectItem></SelectContent></Select>
      </div>

      <div className="rounded-xl border border-border bg-card hr-shadow-card overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[220px]">Employee</TableHead>
              <TableHead className="text-right">Basic</TableHead>
              <TableHead className="text-right">HRA</TableHead>
              <TableHead className="text-right">Allowances</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayrolls.map((payroll) => {
              const initials = `${(payroll.employeeName || 'U')[0] || 'U'}${(payroll.employeeName || 'U').split(' ')[1]?.[0] || ''}`;

              return (
                <TableRow key={payroll.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full hr-gradient"><span className="text-xs font-semibold text-primary-foreground">{initials}</span></div>
                      <div>
                        <p className="font-medium text-foreground">{payroll.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{payroll.employeeCode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(payroll.basicSalary)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(payroll.hra)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(payroll.allowances + payroll.da)}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">{formatCurrency(payroll.grossSalary)}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-destructive">-{formatCurrency(payroll.totalDeductions)}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold text-success">{formatCurrency(payroll.netSalary)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(payroll.status === 'paid' ? 'bg-success/10 text-success border-success/20' : payroll.status === 'processed' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground')}>
                      {payroll.status === 'paid' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {payroll.status}
                    </Badge>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><FileText className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
