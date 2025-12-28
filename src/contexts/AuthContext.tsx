import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  companyId?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  avatar?: string;
  phone?: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  logo?: string;
  website?: string;
  workingHours: {
    start: string;
    end: string;
  };
  isOnboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  pendingEmail: string | null;
  registerCompany: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginCompany: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresOtp?: boolean }>;
  loginEmployee: (employeeId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (data: OnboardingData) => void;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
}

interface OnboardingData {
  employees?: any[];
  workingHours?: { start: string; end: string };
  companyDetails?: { logo: string; website: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_COMPANIES = [
  { 
    id: 'company-1', 
    email: 'admin@techcorp.com', 
    password: 'admin123', 
    name: 'TechCorp Solutions',
    logo: '',
    website: 'https://techcorp.com',
    workingHours: { start: '09:00', end: '18:00' },
    isOnboarded: true
  },
];

const DEMO_EMPLOYEES = [
  { id: 'emp001', employeeId: 'EMP001', password: 'emp123', name: 'Rajesh Kumar', companyId: 'company-1', department: 'Engineering', designation: 'Engineering Manager', email: 'rajesh.kumar@company.com', phone: '+91 98765 43210' },
  { id: 'emp002', employeeId: 'EMP002', password: 'emp123', name: 'Priya Sharma', companyId: 'company-1', department: 'Engineering', designation: 'Senior Software Engineer', email: 'priya.sharma@company.com', phone: '+91 98765 43211' },
  { id: 'emp003', employeeId: 'EMP003', password: 'emp123', name: 'Amit Patel', companyId: 'company-1', department: 'Engineering', designation: 'Software Engineer', email: 'amit.patel@company.com', phone: '+91 98765 43212' },
];

const VALID_OTP = '123456';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [pendingCompany, setPendingCompany] = useState<Company | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hr-portal-user');
    const storedCompany = localStorage.getItem('hr-portal-company');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
    setIsLoading(false);
  }, []);

  const registerCompany = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredCompanies = JSON.parse(localStorage.getItem('hr-portal-companies') || '[]');
    const exists = [...DEMO_COMPANIES, ...registeredCompanies].some((c) => c.email === email);

    if (exists) {
      return { success: false, error: 'Email already registered' };
    }

    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name,
      email,
      workingHours: { start: '09:00', end: '18:00' },
      isOnboarded: false,
    };

    registeredCompanies.push({ ...newCompany, password });
    localStorage.setItem('hr-portal-companies', JSON.stringify(registeredCompanies));

    setPendingEmail(email);
    setPendingUser({ id: newCompany.id, email, name, role: 'admin' });
    setPendingCompany(newCompany);

    return { success: true };
  };

  const loginCompany = async (email: string, password: string): Promise<{ success: boolean; error?: string; requiresOtp?: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredCompanies = JSON.parse(localStorage.getItem('hr-portal-companies') || '[]');
    const allCompanies = [...DEMO_COMPANIES, ...registeredCompanies];
    const companyData = allCompanies.find((c) => c.email === email && c.password === password);

    if (companyData) {
      setPendingEmail(email);
      setPendingUser({ id: companyData.id, email: companyData.email, name: companyData.name, role: 'admin' });
      setPendingCompany({
        id: companyData.id,
        name: companyData.name,
        email: companyData.email,
        logo: companyData.logo,
        website: companyData.website,
        workingHours: companyData.workingHours,
        isOnboarded: companyData.isOnboarded,
      });
      return { success: true, requiresOtp: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const loginEmployee = async (employeeId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredEmployees = JSON.parse(localStorage.getItem('hr-portal-employees') || '[]');
    const allEmployees = [...DEMO_EMPLOYEES, ...registeredEmployees];
    const employee = allEmployees.find((e) => e.employeeId === employeeId && e.password === password);

    if (employee) {
      const userData: User = { 
        id: employee.id, 
        email: employee.email || '', 
        name: employee.name, 
        role: 'employee', 
        companyId: employee.companyId,
        employeeId: employee.employeeId,
        department: employee.department,
        designation: employee.designation,
        phone: employee.phone,
      };
      setUser(userData);
      localStorage.setItem('hr-portal-user', JSON.stringify(userData));
      
      // Load company data for employee
      const registeredCompanies = JSON.parse(localStorage.getItem('hr-portal-companies') || '[]');
      const allCompanies = [...DEMO_COMPANIES, ...registeredCompanies];
      const companyData = allCompanies.find((c) => c.id === employee.companyId);
      if (companyData) {
        const companyInfo: Company = {
          id: companyData.id,
          name: companyData.name,
          email: companyData.email,
          logo: companyData.logo,
          website: companyData.website,
          workingHours: companyData.workingHours,
          isOnboarded: true,
        };
        setCompany(companyInfo);
        localStorage.setItem('hr-portal-company', JSON.stringify(companyInfo));
      }
      
      return { success: true };
    }

    return { success: false, error: 'Invalid Employee ID or password' };
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (otp === VALID_OTP && pendingUser && pendingCompany) {
      setUser(pendingUser);
      setCompany(pendingCompany);
      localStorage.setItem('hr-portal-user', JSON.stringify(pendingUser));
      localStorage.setItem('hr-portal-company', JSON.stringify(pendingCompany));
      setPendingEmail(null);
      setPendingUser(null);
      setPendingCompany(null);
      return { success: true };
    }

    return { success: false, error: 'Invalid OTP. Use 123456 for demo.' };
  };

  const completeOnboarding = (data: OnboardingData) => {
    if (!company) return;

    const updatedCompany = {
      ...company,
      ...data.companyDetails,
      workingHours: data.workingHours || company.workingHours,
      isOnboarded: true,
    };

    // Save employees if provided
    if (data.employees && data.employees.length > 0) {
      const existingEmployees = JSON.parse(localStorage.getItem('hr-portal-employees') || '[]');
      const newEmployees = data.employees.map((emp, index) => ({
        id: `emp-${Date.now()}-${index}`,
        employeeId: emp.employeeId,
        password: emp.password || 'password123',
        name: `${emp.firstName} ${emp.lastName}`,
        companyId: company.id,
        department: emp.department || 'General',
        designation: emp.designation || 'Employee',
        email: emp.email || '',
        phone: emp.phone || '',
      }));
      localStorage.setItem('hr-portal-employees', JSON.stringify([...existingEmployees, ...newEmployees]));
    }

    // Update company
    const registeredCompanies = JSON.parse(localStorage.getItem('hr-portal-companies') || '[]');
    const updatedCompanies = registeredCompanies.map((c: any) =>
      c.id === company.id ? { ...c, ...updatedCompany } : c
    );
    localStorage.setItem('hr-portal-companies', JSON.stringify(updatedCompanies));

    setCompany(updatedCompany);
    localStorage.setItem('hr-portal-company', JSON.stringify(updatedCompany));
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('hr-portal-user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setPendingEmail(null);
    setPendingUser(null);
    setPendingCompany(null);
    localStorage.removeItem('hr-portal-user');
    localStorage.removeItem('hr-portal-company');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        pendingEmail,
        registerCompany,
        loginCompany,
        loginEmployee,
        verifyOtp,
        completeOnboarding,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
