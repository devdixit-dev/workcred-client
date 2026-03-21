import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Home = lazy(() => import('@/pages/Home'));
const VerifyOtp = lazy(() => import('@/pages/VerifyOtp'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Employees = lazy(() => import('@/pages/Employees'));
const AddEmployee = lazy(() => import('@/pages/AddEmployee'));
const Attendance = lazy(() => import('@/pages/Attendance'));
const MyAttendance = lazy(() => import('@/pages/MyAttendance'));
const Profile = lazy(() => import('@/pages/Profile'));
const Leave = lazy(() => import('@/pages/Leave'));
const LeaveApply = lazy(() => import('@/pages/LeaveApply'));
const LeaveBalance = lazy(() => import('@/pages/LeaveBalance'));
const Payroll = lazy(() => import('@/pages/Payroll'));
const MySalary = lazy(() => import('@/pages/MySalary'));
const Reports = lazy(() => import('@/pages/Reports'));
const Settings = lazy(() => import('@/pages/Settings'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-hr-surface-subtle">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/employees/add" element={<AddEmployee />} />
                <Route path="/employees/:id" element={<ComingSoon title="Employee Profile" description="Employee profile and detailed information view is coming soon." />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/my-attendance" element={<MyAttendance />} />
                <Route path="/attendance/sheet" element={<ComingSoon title="Attendance Sheet" description="Monthly attendance sheet view is coming soon." />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/leave/apply" element={<LeaveApply />} />
                <Route path="/leave/balance" element={<LeaveBalance />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/my-salary" element={<MySalary />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
