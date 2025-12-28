import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyOtp from "@/pages/VerifyOtp";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import AddEmployee from "@/pages/AddEmployee";
import Attendance from "@/pages/Attendance";
import MyAttendance from "@/pages/MyAttendance";
import Profile from "@/pages/Profile";
import Leave from "@/pages/Leave";
import LeaveApply from "@/pages/LeaveApply";
import LeaveBalance from "@/pages/LeaveBalance";
import Payroll from "@/pages/Payroll";
import MySalary from "@/pages/MySalary";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Onboarding (Protected but outside main layout) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes with Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
