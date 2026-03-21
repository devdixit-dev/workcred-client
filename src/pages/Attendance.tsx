import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { departments } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Attendance as AttendanceType } from '@/types';
import { Navigate } from 'react-router-dom';
import api from '@/api/axios.api';

export default function Attendance() {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceType['status']>>({});
  const [timeData, setTimeData] = useState<Record<string, { checkIn: string; checkOut: string }>>({});

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/admin/attendance', { params: { date: selectedDate } });
      const rows = res.data.data || [];
      setEmployees(rows);

      const statuses: Record<string, AttendanceType['status']> = {};
      const times: Record<string, { checkIn: string; checkOut: string }> = {};
      rows.forEach((row: any) => {
        statuses[row.id] = row.attendance.status;
        times[row.id] = {
          checkIn: row.attendance.checkIn || '09:00',
          checkOut: row.attendance.checkOut || '18:00',
        };
      });
      setAttendanceData(statuses);
      setTimeData(times);
    };

    if (isAdmin) load();
  }, [isAdmin, selectedDate]);

  if (!isAdmin) {
    return <Navigate to="/my-attendance" replace />;
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;

      return matchesSearch && matchesDepartment && emp.status === 'active';
    });
  }, [employees, searchQuery, departmentFilter]);

  const handleStatusChange = (employeeId: string, status: AttendanceType['status']) => {
    setAttendanceData((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleMarkAllPresent = () => {
    const newData: Record<string, AttendanceType['status']> = {};
    filteredEmployees.forEach((emp) => {
      newData[emp.id] = 'present';
    });
    setAttendanceData((prev) => ({ ...prev, ...newData }));
    toast({
      title: 'Attendance Marked',
      description: `All ${filteredEmployees.length} employees marked as present.`,
    });
  };

  const handleSaveAttendance = async () => {
    const records = filteredEmployees.map((employee) => ({
      employeeId: employee.id,
      status: attendanceData[employee.id] || 'present',
      checkIn: timeData[employee.id]?.checkIn || '09:00',
      checkOut: timeData[employee.id]?.checkOut || '18:00',
    }));

    await api.post('/admin/attendance', { date: selectedDate, records }, { notifySuccess: false });

    toast({
      title: 'Attendance Saved',
      description: `Attendance for ${selectedDate} has been saved successfully.`,
    });
  };

  const statusOptions: { value: AttendanceType['status']; label: string; color: string }[] = [
    { value: 'present', label: 'Present', color: 'bg-success/10 text-success' },
    { value: 'absent', label: 'Absent', color: 'bg-destructive/10 text-destructive' },
    { value: 'half-day', label: 'Half Day', color: 'bg-warning/10 text-warning' },
    { value: 'leave', label: 'On Leave', color: 'bg-primary/10 text-primary' },
  ];

  const attendanceStats = useMemo(() => {
    const stats = { present: 0, absent: 0, halfDay: 0, leave: 0 };
    Object.values(attendanceData).forEach((status) => {
      if (status === 'present') stats.present++;
      else if (status === 'absent') stats.absent++;
      else if (status === 'half-day') stats.halfDay++;
      else if (status === 'leave') stats.leave++;
    });
    return stats;
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground">Record daily attendance for employees</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleMarkAllPresent}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark All Present
          </Button>
          <Button onClick={handleSaveAttendance} className="hr-gradient">
            Save Attendance
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><CheckCircle2 className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold text-foreground">{attendanceStats.present}</p><p className="text-sm text-muted-foreground">Present</p></div></div></div>
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center gap-3"><div className="rounded-lg bg-destructive/10 p-2"><XCircle className="h-5 w-5 text-destructive" /></div><div><p className="text-2xl font-bold text-foreground">{attendanceStats.absent}</p><p className="text-sm text-muted-foreground">Absent</p></div></div></div>
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-2xl font-bold text-foreground">{attendanceStats.halfDay}</p><p className="text-sm text-muted-foreground">Half Day</p></div></div></div>
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Calendar className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold text-foreground">{attendanceStats.leave}</p><p className="text-sm text-muted-foreground">On Leave</p></div></div></div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row animate-slide-up">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full sm:w-44" />
      </div>

      <div className="rounded-xl border border-border bg-card hr-shadow-card overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => {
              const initials = `${employee.firstName[0] || ''}${employee.lastName[0] || ''}`;
              const status = attendanceData[employee.id] || 'present';
              const statusOption = statusOptions.find((s) => s.value === status);

              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full hr-gradient"><span className="text-sm font-semibold text-primary-foreground">{initials}</span></div>
                      <div>
                        <p className="font-medium text-foreground">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <Select value={status} onValueChange={(value) => handleStatusChange(employee.id, value as AttendanceType['status'])}>
                      <SelectTrigger className={cn('w-32', statusOption?.color)}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={timeData[employee.id]?.checkIn || '09:00'}
                      onChange={(e) => setTimeData((prev) => ({ ...prev, [employee.id]: { ...(prev[employee.id] || { checkIn: '09:00', checkOut: '18:00' }), checkIn: e.target.value } }))}
                      className="w-28"
                      disabled={status !== 'present' && status !== 'half-day'}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={timeData[employee.id]?.checkOut || '18:00'}
                      onChange={(e) => setTimeData((prev) => ({ ...prev, [employee.id]: { ...(prev[employee.id] || { checkIn: '09:00', checkOut: '18:00' }), checkOut: e.target.value } }))}
                      className="w-28"
                      disabled={status !== 'present' && status !== 'half-day'}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
