import { Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { departments } from '@/data/sampleData';
import api from '@/api/axios.api';

export default function LeaveBalance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/admin/leave-balances');
      setRows(res.data.data || []);
    };

    load();
  }, []);

  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      const emp = row.employee;
      const matchesSearch =
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
      return matchesSearch && matchesDepartment && emp.status === 'active';
    });
  }, [rows, searchQuery, departmentFilter]);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Leave Balance</h1>
        <p className="text-muted-foreground">View leave balances for all employees</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row animate-slide-up">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card hr-shadow-card overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">Employee</TableHead>
              <TableHead>Casual Leave</TableHead>
              <TableHead>Sick Leave</TableHead>
              <TableHead>Earned Leave</TableHead>
              <TableHead>Total Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => {
              const employee = row.employee;
              const balance = row.balance;
              const initials = `${employee.firstName[0] || ''}${employee.lastName[0] || ''}`;
              const totalAvailable = (balance?.casual.balance || 0) + (balance?.sick.balance || 0) + (balance?.earned.balance || 0);

              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full hr-gradient"><span className="text-sm font-semibold text-primary-foreground">{initials}</span></div>
                      <div><p className="font-medium text-foreground">{employee.firstName} {employee.lastName}</p><p className="text-sm text-muted-foreground">{employee.department}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="space-y-1"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{balance?.casual.balance || 0} / {balance?.casual.total || 12}</span></div><Progress value={((balance?.casual.balance || 0) / (balance?.casual.total || 12)) * 100} className="h-2" /></div></TableCell>
                  <TableCell><div className="space-y-1"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{balance?.sick.balance || 0} / {balance?.sick.total || 10}</span></div><Progress value={((balance?.sick.balance || 0) / (balance?.sick.total || 10)) * 100} className="h-2" /></div></TableCell>
                  <TableCell><div className="space-y-1"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{balance?.earned.balance || 0} / {balance?.earned.total || 15}</span></div><Progress value={((balance?.earned.balance || 0) / (balance?.earned.total || 15)) * 100} className="h-2" /></div></TableCell>
                  <TableCell><span className="text-lg font-semibold text-primary">{totalAvailable} days</span></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
