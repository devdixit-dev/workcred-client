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
import api from '@/api/axios.api';

export default function AddEmployee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [department, setDepartment] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [basic, setBasic] = useState('');
  const [hra, setHra] = useState('');
  const [allowances, setAllowances] = useState('');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      await api.post('/admin/employees', {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        department,
        designation,
        joiningDate,
        basicSalary: Number(basic || 0),
        hra: Number(hra || 0),
        allowance: Number(allowances || 0),
        password
      }, { notifySuccess: false, notifyError: false });

      toast({
        title: 'Employee Added',
        description: 'New employee has been successfully added to the system.',
      });

      navigate('/employees');
    } catch (error: any) {
      toast({
        title: 'Failed to add employee',
        description: error?.response?.data?.message || 'Please verify fields and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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

      <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password *</Label>
              <Input id="password" type="text" placeholder="password123" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Employment Details</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input id="employeeId" placeholder="EMP001" value={employeeId} onChange={(e) => setEmployeeId(e.target.value.toUpperCase())} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment} required>
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
              <Input id="designation" placeholder="Software Engineer" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input id="joiningDate" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Salary Information</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="basic">Basic Salary (INR) *</Label>
              <Input id="basic" type="number" placeholder="50000" value={basic} onChange={(e) => setBasic(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hra">HRA (INR)</Label>
              <Input id="hra" type="number" placeholder="20000" value={hra} onChange={(e) => setHra(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances (INR)</Label>
              <Input id="allowances" type="number" placeholder="8000" value={allowances} onChange={(e) => setAllowances(e.target.value)} />
            </div>
          </div>
        </div>

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
