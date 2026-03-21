import api from '@/api/axios.api';
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'User';
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

interface EmployeeInput {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  designation: string;
}

interface OnboardingData {
  employees?: EmployeeInput[];
  workingHours?: { start: string; end: string };
  companyDetails?: { logo: string; website: string };
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
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

  resendVerification: () => Promise<{ success: boolean; error?: string }>;
  loginCompany: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  loginEmployee: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string; error?: string }>;
  completeOnboarding: (data: OnboardingData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => void;
  logout: () => Promise<void>;
}

interface MeResponse {
  status: number;
  message: string;
  data: {
    user: User;
    company: Company | null;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const hydrateSession = async () => {
    const res = await api.get<MeResponse>('/auth/me');
    setUser(res.data.data.user);
    setCompany(res.data.data.company);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await hydrateSession();
      } catch {
        setUser(null);
        setCompany(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
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
    await api.post('/auth/init', {
      companyName,
      companyType,
      companyGSTnumber: gstNumber,
      companyAdmin: contactPersonName,
      companyContact,
      companyEmail: email,
      companyPassword: password
    }, { notifySuccess: false, notifyError: false });

    setPendingEmail(email);
    return { success: true };
  };

  const resendVerification = async () => {
    await api.post('/auth/resend-verification', {}, { notifySuccess: false, notifyError: false });
    return { success: true };
  };

  const loginCompany = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    const res = await api.post<MeResponse>('/auth/signin', { email, password, role }, { notifySuccess: false, notifyError: false });
    setUser(res.data.data.user);
    setCompany(res.data.data.company);
    return { success: true };
  };

  const loginEmployee = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    const res = await api.post<MeResponse>('/auth/signin', { email, password, role }, { notifySuccess: false, notifyError: false });
    setUser(res.data.data.user);
    setCompany(res.data.data.company);
    return { success: true };
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; message: string; error?: string }> => {
    const res = await api.post('/auth/verify', { otp }, { notifySuccess: false, notifyError: false });
    return { success: true, message: res.data.message };
  };

  const completeOnboarding = async (data: OnboardingData): Promise<{ success: boolean; error?: string }> => {
    await api.post('/admin/onboarding', data, { notifySuccess: false });
    await hydrateSession();
    return { success: true };
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Clear client auth state even if server already dropped the cookie.
    } finally {
      setUser(null);
      setCompany(null);
      setPendingEmail(null);
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = useMemo(() => user?.role === 'Admin', [user?.role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isAuthenticated,
        isLoading,
        isAdmin,
        pendingEmail,
        registerCompany,
        resendVerification,
        loginCompany,
        loginEmployee,
        verifyOtp,
        completeOnboarding,
        updateProfile,
        logout
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
