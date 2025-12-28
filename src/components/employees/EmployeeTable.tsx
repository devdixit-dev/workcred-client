import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { Employee } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmployeeProfileDialog } from './EmployeeProfileDialog';

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card hr-shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">Employee</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
              return (
                <TableRow key={employee.id} className="group">
                  <TableCell>
                    <Link
                      to={`/employees/${employee.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full hr-gradient">
                        <span className="text-sm font-semibold text-primary-foreground">
                          {initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary hr-transition">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        employee.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(employee)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProfile(employee)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EmployeeProfileDialog
        employee={selectedEmployee}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
      />
    </>
  );
}
