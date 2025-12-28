import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { loginCompany, loginEmployee } = useAuth();
  const { toast } = useToast();
  
  // Company login state
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);
  
  // Employee login state
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginCompany(companyEmail, companyPassword);

    if (result.success && result.requiresOtp) {
      toast({
        title: 'OTP Sent',
        description: 'Please enter the verification code.',
      });
      navigate('/verify-otp');
    } else if (!result.success) {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginEmployee(employeeId, employeePassword);

    if (result.success) {
      toast({
        title: 'Welcome!',
        description: 'You have successfully logged in.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const fillCompanyDemo = () => {
    setCompanyEmail('admin@techcorp.com');
    setCompanyPassword('admin123');
  };

  const fillEmployeeDemo = () => {
    setEmployeeId('EMP001');
    setEmployeePassword('emp123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hr-surface-subtle p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl hr-gradient mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">HR Portal</h1>
          <p className="text-muted-foreground mt-1">Sign in to continue</p>
        </div>

        {/* Login Tabs */}
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <Tabs defaultValue="company" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company" className="gap-2">
                <Building2 className="h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="employee" className="gap-2">
                <User className="h-4 w-4" />
                Employee
              </TabsTrigger>
            </TabsList>

            {/* Company Login */}
            <TabsContent value="company">
              <form onSubmit={handleCompanyLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="admin@company.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="company-password"
                      type={showCompanyPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCompanyPassword(!showCompanyPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCompanyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full hr-gradient" disabled={isLoading}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">New company? </span>
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register here
                  </Link>
                </div>
              </form>

              <div className="mt-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={fillCompanyDemo}
                  className="w-full flex items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-secondary/50 hr-transition"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">Demo Company</p>
                    <p className="text-xs text-muted-foreground">admin@techcorp.com</p>
                  </div>
                  <span className="text-xs text-muted-foreground">admin123</span>
                </button>
              </div>
            </TabsContent>

            {/* Employee Login */}
            <TabsContent value="employee">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-id">Employee ID</Label>
                  <Input
                    id="employee-id"
                    type="text"
                    placeholder="EMP001"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="employee-password"
                      type={showEmployeePassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={employeePassword}
                      onChange={(e) => setEmployeePassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showEmployeePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full hr-gradient" disabled={isLoading}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Contact your employer for login credentials
                </p>
              </form>

              <div className="mt-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={fillEmployeeDemo}
                  className="w-full flex items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-secondary/50 hr-transition"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">Demo Employee</p>
                    <p className="text-xs text-muted-foreground">EMP001 - Rajesh Kumar</p>
                  </div>
                  <span className="text-xs text-muted-foreground">emp123</span>
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* OTP Info */}
        <p className="text-xs text-muted-foreground text-center">
          Company login OTP: <span className="font-mono font-medium text-primary">123456</span>
        </p>
      </div>
    </div>
  );
}
