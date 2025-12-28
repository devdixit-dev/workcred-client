import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Building2, MoreVertical } from 'lucide-react';
import { Employee } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmployeeProfileDialog } from './EmployeeProfileDialog';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  const handleViewProfile = () => {
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditProfile = () => {
    setDialogMode('edit');
    setDialogOpen(true);
  };

  return (
    <>
      <div className="group rounded-xl border border-border bg-card p-5 hr-shadow-card hr-card-hover animate-fade-in">
        <div className="flex items-start justify-between">
          <Link to={`/employees/${employee.id}`} className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full hr-gradient">
              <span className="text-lg font-semibold text-primary-foreground">{initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary hr-transition">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.designation}</p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewProfile}>View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditProfile}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{employee.department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{employee.phone}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            ID: {employee.employeeId}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              employee.status === 'active'
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {employee.status}
          </span>
        </div>
      </div>

      <EmployeeProfileDialog
        employee={employee}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
      />
    </>
  );
}
