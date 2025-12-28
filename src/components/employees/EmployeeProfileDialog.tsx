import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, MapPin, User, Briefcase, Save, X } from 'lucide-react';
import { Employee } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments } from '@/data/sampleData';
import { toast } from 'sonner';

interface EmployeeProfileDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit';
}

export function EmployeeProfileDialog({ employee, isOpen, onClose, mode }: EmployeeProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState<Partial<Employee>>(employee || {});

  const handleInputChange = (field: keyof Employee, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success('Employee profile updated successfully');
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData(employee || {});
    if (mode === 'edit') {
      onClose();
    } else {
      setIsEditing(false);
    }
  };

  if (!employee) return null;

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Employee' : 'Employee Profile'}</span>
            {!isEditing && mode === 'view' && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="flex h-16 w-16 items-center justify-center rounded-full hr-gradient">
              <span className="text-xl font-semibold text-primary-foreground">{initials}</span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-foreground">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-muted-foreground">{employee.designation}</p>
                </>
              )}
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium',
                employee.status === 'active'
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {employee.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Employee ID */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Employee ID
              </Label>
              <p className="font-mono text-foreground">{employee.employeeId}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="text-foreground">{employee.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="text-foreground">{employee.phone}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Department
              </Label>
              {isEditing ? (
                <Select
                  value={formData.department || ''}
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-foreground">{employee.department}</p>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Designation
              </Label>
              {isEditing ? (
                <Input
                  value={formData.designation || ''}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                />
              ) : (
                <p className="text-foreground">{employee.designation}</p>
              )}
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joining Date
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.joiningDate || ''}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                />
              ) : (
                <p className="text-foreground">
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Address */}
            {(employee.address || isEditing) && (
              <div className="space-y-2 sm:col-span-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter address"
                  />
                ) : (
                  <p className="text-foreground">{employee.address || '-'}</p>
                )}
              </div>
            )}
          </div>

          {/* Salary Information */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground">Salary Information</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Basic</p>
                <p className="text-lg font-semibold text-foreground">
                  ₹{employee.salary.basic.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">HRA</p>
                <p className="text-lg font-semibold text-foreground">
                  ₹{employee.salary.hra.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Allowances</p>
                <p className="text-lg font-semibold text-foreground">
                  ₹{employee.salary.allowances.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="hr-gradient">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
