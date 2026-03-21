import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Clock, Globe, Check, Plus, Trash2, ArrowRight, ArrowLeft, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { departments } from '@/data/sampleData';

interface EmployeeForm {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  designation: string;
}

const steps = [
  { id: 1, title: 'Add Employees', icon: Users, description: 'Add your team members' },
  { id: 2, title: 'Working Hours', icon: Clock, description: 'Set in/out timings' },
  { id: 3, title: 'Company Details', icon: Globe, description: 'Logo & website' },
];

const designations = [
  'Manager',
  'Senior Engineer',
  'Software Engineer',
  'Junior Engineer',
  'HR Executive',
  'Accountant',
  'Designer',
  'Analyst',
  'Team Lead',
  'Intern',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, company } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Step 1: Employees
  const [employees, setEmployees] = useState<EmployeeForm[]>([
    { employeeId: '', firstName: '', lastName: '', email: '', password: 'password123', department: '', designation: '' },
  ]);

  // Step 2: Working Hours
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  // Step 3: Company Details
  const [logo, setLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [website, setWebsite] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setLogo(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmployee = () => {
    setEmployees([...employees, { employeeId: '', firstName: '', lastName: '', email: '', password: 'password123', department: '', designation: '' }]);
  };

  const removeEmployee = (index: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const updateEmployee = (index: number, field: keyof EmployeeForm, value: string) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const validEmployees = employees.filter(e => e.employeeId && e.firstName && e.lastName);
      if (validEmployees.length === 0) {
        toast({
          title: 'Add at least one employee',
          description: 'Please fill in employee details before continuing.',
          variant: 'destructive',
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleComplete = async () => {
    try {
      setIsSaving(true);
      const validEmployees = employees.filter((e) => e.employeeId && e.firstName && e.lastName);

      const result = await completeOnboarding({
        employees: validEmployees,
        workingHours: { start: startTime, end: endTime },
        companyDetails: { logo, website },
      });

      if (!result.success) {
        toast({
          title: 'Setup Failed',
          description: result.error || 'Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Setup Complete!',
        description: 'Your HR Portal is ready to use.',
      });

      navigate('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding({
      workingHours: { start: startTime, end: endTime },
    });
    toast({
      title: 'Onboarding Saved',
      description: 'Working hours have been saved successfully.',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-hr-surface-subtle p-4">
      <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl hr-gradient mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {company?.name}!</h1>
          <p className="text-muted-foreground mt-1">Let's set up your HR Portal</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 hr-transition',
                  currentStep === step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep > step.id
                    ? 'border-success bg-success text-success-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-2',
                    currentStep > step.id ? 'bg-success' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step 1: Add Employees */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {employees.map((employee, index) => (
                <div key={index} className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Employee {index + 1}</span>
                    {employees.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeEmployee(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Employee ID *</Label>
                      <Input
                        placeholder="EMP001"
                        value={employee.employeeId}
                        onChange={(e) => updateEmployee(index, 'employeeId', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        placeholder="password123"
                        value={employee.password}
                        onChange={(e) => updateEmployee(index, 'password', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        placeholder="John"
                        value={employee.firstName}
                        onChange={(e) => updateEmployee(index, 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        placeholder="Doe"
                        value={employee.lastName}
                        onChange={(e) => updateEmployee(index, 'lastName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={employee.department} onValueChange={(value) => updateEmployee(index, 'department', value)}>
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
                      <Label>Designation</Label>
                      <Select value={employee.designation} onValueChange={(value) => updateEmployee(index, 'designation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          {designations.map((des) => (
                            <SelectItem key={des} value={des}>
                              {des}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        value={employee.email}
                        onChange={(e) => updateEmployee(index, 'email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addEmployee} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Employee
              </Button>
            </div>
          )}

          {/* Step 2: Working Hours */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>In Time (Start)</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Out Time (End)</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Working hours: <span className="font-medium text-foreground">{startTime}</span> to{' '}
                  <span className="font-medium text-foreground">{endTime}</span>
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Company Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Company Logo</Label>
                <div className="flex items-start gap-6">
                  {/* Logo Preview */}
                  <div 
                    className={cn(
                      "flex items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-border bg-secondary/30 overflow-hidden",
                      !logoPreview && "cursor-pointer hover:border-primary/50 hover:bg-secondary/50"
                    )}
                    onClick={() => !logoPreview && fileInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Company logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-2">Click to upload</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    {logoPreview && (
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setLogo('');
                          setLogoPreview(null);
                        }}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Company Website</Label>
                <Input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSkip}>
                Skip Setup
              </Button>
            )}

            {currentStep < 3 ? (
              <Button onClick={handleNext} className="hr-gradient">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="hr-gradient" disabled={isSaving}>
                <Check className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
