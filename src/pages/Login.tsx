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
  const [empEmail, setEmpEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleCompanyLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const result = await loginCompany(companyEmail, companyPassword, 'Admin');

      if (result.success) {
        toast({
          title: 'Login Successfully',
          description: 'Logged in successfully. Setup your onboarding',
        });
        navigate('/onboarding');
      } else if (!result.success) {
        setIsLoading(false);
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive',
        });
      }

      setIsLoading(false);
    }
    catch (error) {
      if(error.response) {
        setIsLoading(false);
        toast({
          title: 'Login Failed',
          description: error.response.data.message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginEmployee(empEmail, employeePassword, 'User');

    if (result.success) {
      toast({
        title: 'Welcome!',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
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
            </TabsContent>

            {/* Employee Login */}
            <TabsContent value="employee">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-id">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="user@gmail.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
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


            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
