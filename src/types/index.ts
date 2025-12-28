export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  salary: {
    basic: number;
    hra: number;
    da: number;
    allowances: number;
    deductions: number;
  };
  reportingTo?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'weekend';
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  notes?: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: string;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: { total: number; used: number; balance: number };
  sick: { total: number; used: number; balance: number };
  earned: { total: number; used: number; balance: number };
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  da: number;
  allowances: number;
  grossSalary: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  processedOn?: string;
}

export interface Department {
  id: string;
  name: string;
  head?: string;
  employeeCount: number;
}

export interface Activity {
  id: string;
  type: 'leave' | 'attendance' | 'payroll' | 'employee' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  employeeId?: string;
  employeeName?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'draft';
  postedDate: string;
  applicants: number;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  resumeUrl?: string;
  rating?: number;
  notes?: string;
}
