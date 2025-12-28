import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';

export default function AddEmployee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Employee Added',
      description: 'New employee has been successfully added to the system.',
    });

    setIsSubmitting(false);
    navigate('/employees');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 animate-fade-in">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/employees">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Employee</h1>
          <p className="text-muted-foreground">Fill in the details to onboard a new employee</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
        {/* Personal Information */}
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="Enter first name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" placeholder="Enter last name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="email@company.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter address" />
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Employment Details</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input id="employeeId" placeholder="EMP001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select required>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input id="designation" placeholder="Software Engineer" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input id="joiningDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportingTo">Reporting Manager</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emp001">Rajesh Kumar</SelectItem>
                  <SelectItem value="emp006">Anita Desai</SelectItem>
                  <SelectItem value="emp008">Meera Iyer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Salary Information</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="basic">Basic Salary (₹) *</Label>
              <Input id="basic" type="number" placeholder="50000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hra">HRA (₹)</Label>
              <Input id="hra" type="number" placeholder="20000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="da">DA (₹)</Label>
              <Input id="da" type="number" placeholder="5000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances (₹)</Label>
              <Input id="allowances" type="number" placeholder="8000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions (₹)</Label>
              <Input id="deductions" type="number" placeholder="5000" />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" asChild>
            <Link to="/employees">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="hr-gradient">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
}
