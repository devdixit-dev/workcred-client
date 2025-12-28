import { useState } from 'react';
import {
  Building2,
  Users,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const adminSettingsSections = [
  { id: 'company', name: 'Company Profile', icon: Building2 },
  { id: 'departments', name: 'Departments', icon: Users },
  { id: 'leave', name: 'Leave Policies', icon: Calendar },
  { id: 'payroll', name: 'Payroll Settings', icon: DollarSign },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
];

const employeeSettingsSections = [
  { id: 'security', name: 'Reset Password', icon: Shield },
];

export default function Settings() {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leaveApprovalNotifications, setLeaveApprovalNotifications] = useState(true);
  const [payrollNotifications, setPayrollNotifications] = useState(true);

  const settingsSections = isAdmin ? adminSettingsSections : employeeSettingsSections;

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  // Employee view - only reset password
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="animate-slide-up">
          <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-6">Reset Password</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="hr-gradient">
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin view - all settings
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your HR system configuration</p>
      </div>

      <div className="animate-slide-up">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {settingsSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="gap-2">
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Company Profile */}
          <TabsContent value="company">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Company Information</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="TechCorp Solutions Pvt. Ltd." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration Number</Label>
                  <Input id="registrationNo" defaultValue="U72200MH2019PTC123456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input id="email" type="email" defaultValue="hr@techcorp.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+91 22 1234 5678" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue="123 Tech Park, Andheri East, Mumbai - 400069"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="hr-gradient">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Departments */}
          <TabsContent value="departments">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Departments</h2>
                <Button size="sm" className="hr-gradient">
                  Add Department
                </Button>
              </div>
              <div className="space-y-3">
                {['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Operations'].map(
                  (dept) => (
                    <div
                      key={dept}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-secondary/50 hr-transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{dept}</p>
                          <p className="text-sm text-muted-foreground">5-12 employees</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )
                )}
              </div>
            </div>
          </TabsContent>

          {/* Leave Policies */}
          <TabsContent value="leave">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Leave Policy Configuration</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { type: 'Casual Leave', days: 12 },
                  { type: 'Sick Leave', days: 10 },
                  { type: 'Earned Leave', days: 15 },
                  { type: 'Maternity Leave', days: 180 },
                  { type: 'Paternity Leave', days: 15 },
                ].map((leave) => (
                  <div
                    key={leave.type}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <p className="font-medium text-foreground">{leave.type}</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        defaultValue={leave.days}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">days/year</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="hr-gradient">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Payroll Settings */}
          <TabsContent value="payroll">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Payroll Configuration</h2>
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>PF Contribution (%)</Label>
                    <Input type="number" defaultValue="12" />
                  </div>
                  <div className="space-y-2">
                    <Label>ESI Contribution (%)</Label>
                    <Input type="number" defaultValue="0.75" />
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Tax (₹)</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Cycle</Label>
                    <Input defaultValue="Monthly (Last working day)" disabled />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="hr-gradient">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates for important activities
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Leave Approval Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when leave requests need approval
                    </p>
                  </div>
                  <Switch
                    checked={leaveApprovalNotifications}
                    onCheckedChange={setLeaveApprovalNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Payroll Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for payroll processing
                    </p>
                  </div>
                  <Switch
                    checked={payrollNotifications}
                    onCheckedChange={setPayrollNotifications}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="hr-gradient">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="hr-gradient">
                  Update Password
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}