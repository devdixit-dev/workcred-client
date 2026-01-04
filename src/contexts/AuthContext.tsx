import api from '@/api/axios.api';
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
  // isAdmin: boolean;
  pendingEmail: string | null;

  registerCompany: (
    companyName: string,
    companyContact: string,
    gstNumber: string,
    companyType: string,
    contactPersonName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  resendVerification: () => Promise<{ success: boolean; error?: string; }>
  loginCompany: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  loginEmployee: (employeeId: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string; error?: string }>;
  completeOnboarding: (data: OnboardingData) => void;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
}

interface OnboardingData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  employees?: any[];
  workingHours?: { start: string; end: string };
  companyDetails?: { logo: string; website: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

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

  const registerCompany = async (
    companyName: string,
    companyContact: string,
    gstNumber: string,
    companyType: string,
    contactPersonName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {

    await api.post('/auth/init',
      {
        companyName, companyType, companyGSTnumber: gstNumber, companyAdmin: contactPersonName,
        companyContact, companyEmail: email, companyPassword: password
      },
      { withCredentials: true }
    );

    return { success: true };
  };

  const resendVerification = async () => {
    await api.post('/auth/resend-verification', {}, { withCredentials: true });
    return { success: true }
  }

  const loginCompany = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string; }> => {
    const res = await api.post('/auth/signin', { email, password, role }, { withCredentials: true });

    if (res.status === 200 && role === 'Admin') {
      setIsAuth(true);
      return { success: true }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  };

  const loginEmployee = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    const res = await api.post('/auth/signin', { email, password, role }, { withCredentials: true });

    if (res.status === 200) {
      return { success: true }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; message: string; error?: string }> => {
    const res = await api.post('/auth/verify',
      { otp },
      { withCredentials: true }
    );

    if (res.status === 200) {
      return { success: true, message: res.data.message };
    } else {
      return { success: false, message: res.data.message, error: 'Invalid OTP' };
    }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    localStorage.removeItem('hr-portal-user');
    localStorage.removeItem('hr-portal-company');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isAuthenticated: isAuth,
        isLoading,
        // isAdmin: user?.role === 'admin',
        pendingEmail,
        registerCompany,
        resendVerification,
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
