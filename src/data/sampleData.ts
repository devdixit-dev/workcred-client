import { Employee, Attendance, Leave, LeaveBalance, Activity, Department, Payroll } from '@/types';

export const departments: Department[] = [
  { id: '1', name: 'Engineering', head: 'emp001', employeeCount: 12 },
  { id: '2', name: 'Human Resources', head: 'emp006', employeeCount: 4 },
  { id: '3', name: 'Marketing', head: 'emp008', employeeCount: 6 },
  { id: '4', name: 'Sales', head: 'emp011', employeeCount: 8 },
  { id: '5', name: 'Finance', head: 'emp015', employeeCount: 5 },
  { id: '6', name: 'Operations', head: 'emp018', employeeCount: 7 },
];

export const employees: Employee[] = [
  {
    id: 'emp001',
    employeeId: 'EMP001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@company.com',
    phone: '+91 98765 43210',
    department: 'Engineering',
    designation: 'Engineering Manager',
    joiningDate: '2019-03-15',
    status: 'active',
    salary: { basic: 120000, hra: 48000, da: 12000, allowances: 15000, deductions: 18000 },
  },
  {
    id: 'emp002',
    employeeId: 'EMP002',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@company.com',
    phone: '+91 98765 43211',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2020-06-01',
    status: 'active',
    salary: { basic: 85000, hra: 34000, da: 8500, allowances: 10000, deductions: 13000 },
  },
  {
    id: 'emp003',
    employeeId: 'EMP003',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@company.com',
    phone: '+91 98765 43212',
    department: 'Engineering',
    designation: 'Software Engineer',
    joiningDate: '2021-01-10',
    status: 'active',
    salary: { basic: 65000, hra: 26000, da: 6500, allowances: 8000, deductions: 10000 },
  },
  {
    id: 'emp004',
    employeeId: 'EMP004',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@company.com',
    phone: '+91 98765 43213',
    department: 'Engineering',
    designation: 'Software Engineer',
    joiningDate: '2021-04-20',
    status: 'active',
    salary: { basic: 60000, hra: 24000, da: 6000, allowances: 7500, deductions: 9500 },
  },
  {
    id: 'emp005',
    employeeId: 'EMP005',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@company.com',
    phone: '+91 98765 43214',
    department: 'Engineering',
    designation: 'DevOps Engineer',
    joiningDate: '2020-09-15',
    status: 'active',
    salary: { basic: 75000, hra: 30000, da: 7500, allowances: 9000, deductions: 11500 },
  },
  {
    id: 'emp006',
    employeeId: 'EMP006',
    firstName: 'Anita',
    lastName: 'Desai',
    email: 'anita.desai@company.com',
    phone: '+91 98765 43215',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2018-07-01',
    status: 'active',
    salary: { basic: 95000, hra: 38000, da: 9500, allowances: 12000, deductions: 15000 },
  },
  {
    id: 'emp007',
    employeeId: 'EMP007',
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@company.com',
    phone: '+91 98765 43216',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2021-08-01',
    status: 'active',
    salary: { basic: 45000, hra: 18000, da: 4500, allowances: 5500, deductions: 7000 },
  },
  {
    id: 'emp008',
    employeeId: 'EMP008',
    firstName: 'Meera',
    lastName: 'Iyer',
    email: 'meera.iyer@company.com',
    phone: '+91 98765 43217',
    department: 'Marketing',
    designation: 'Marketing Head',
    joiningDate: '2019-02-01',
    status: 'active',
    salary: { basic: 110000, hra: 44000, da: 11000, allowances: 14000, deductions: 17000 },
  },
  {
    id: 'emp009',
    employeeId: 'EMP009',
    firstName: 'Sanjay',
    lastName: 'Gupta',
    email: 'sanjay.gupta@company.com',
    phone: '+91 98765 43218',
    department: 'Marketing',
    designation: 'Digital Marketing Manager',
    joiningDate: '2020-03-15',
    status: 'active',
    salary: { basic: 70000, hra: 28000, da: 7000, allowances: 8500, deductions: 11000 },
  },
  {
    id: 'emp010',
    employeeId: 'EMP010',
    firstName: 'Kavita',
    lastName: 'Nair',
    email: 'kavita.nair@company.com',
    phone: '+91 98765 43219',
    department: 'Marketing',
    designation: 'Content Specialist',
    joiningDate: '2021-05-10',
    status: 'active',
    salary: { basic: 50000, hra: 20000, da: 5000, allowances: 6000, deductions: 7800 },
  },
  {
    id: 'emp011',
    employeeId: 'EMP011',
    firstName: 'Arjun',
    lastName: 'Menon',
    email: 'arjun.menon@company.com',
    phone: '+91 98765 43220',
    department: 'Sales',
    designation: 'Sales Director',
    joiningDate: '2018-11-01',
    status: 'active',
    salary: { basic: 130000, hra: 52000, da: 13000, allowances: 16000, deductions: 20000 },
  },
  {
    id: 'emp012',
    employeeId: 'EMP012',
    firstName: 'Deepa',
    lastName: 'Rao',
    email: 'deepa.rao@company.com',
    phone: '+91 98765 43221',
    department: 'Sales',
    designation: 'Senior Sales Executive',
    joiningDate: '2020-01-20',
    status: 'active',
    salary: { basic: 55000, hra: 22000, da: 5500, allowances: 7000, deductions: 8700 },
  },
  {
    id: 'emp013',
    employeeId: 'EMP013',
    firstName: 'Karthik',
    lastName: 'Sundaram',
    email: 'karthik.s@company.com',
    phone: '+91 98765 43222',
    department: 'Engineering',
    designation: 'QA Engineer',
    joiningDate: '2021-02-15',
    status: 'active',
    salary: { basic: 55000, hra: 22000, da: 5500, allowances: 6800, deductions: 8500 },
  },
  {
    id: 'emp014',
    employeeId: 'EMP014',
    firstName: 'Lakshmi',
    lastName: 'Prasad',
    email: 'lakshmi.prasad@company.com',
    phone: '+91 98765 43223',
    department: 'Finance',
    designation: 'Finance Manager',
    joiningDate: '2019-06-01',
    status: 'active',
    salary: { basic: 100000, hra: 40000, da: 10000, allowances: 12500, deductions: 15800 },
  },
  {
    id: 'emp015',
    employeeId: 'EMP015',
    firstName: 'Nitin',
    lastName: 'Joshi',
    email: 'nitin.joshi@company.com',
    phone: '+91 98765 43224',
    department: 'Finance',
    designation: 'Senior Accountant',
    joiningDate: '2020-04-01',
    status: 'active',
    salary: { basic: 65000, hra: 26000, da: 6500, allowances: 8000, deductions: 10200 },
  },
  {
    id: 'emp016',
    employeeId: 'EMP016',
    firstName: 'Pooja',
    lastName: 'Mehta',
    email: 'pooja.mehta@company.com',
    phone: '+91 98765 43225',
    department: 'Operations',
    designation: 'Operations Manager',
    joiningDate: '2019-09-15',
    status: 'active',
    salary: { basic: 90000, hra: 36000, da: 9000, allowances: 11000, deductions: 14200 },
  },
  {
    id: 'emp017',
    employeeId: 'EMP017',
    firstName: 'Suresh',
    lastName: 'Pillai',
    email: 'suresh.pillai@company.com',
    phone: '+91 98765 43226',
    department: 'Engineering',
    designation: 'Frontend Developer',
    joiningDate: '2021-07-01',
    status: 'active',
    salary: { basic: 58000, hra: 23200, da: 5800, allowances: 7200, deductions: 9100 },
  },
  {
    id: 'emp018',
    employeeId: 'EMP018',
    firstName: 'Divya',
    lastName: 'Krishnan',
    email: 'divya.k@company.com',
    phone: '+91 98765 43227',
    department: 'Engineering',
    designation: 'Backend Developer',
    joiningDate: '2021-03-10',
    status: 'active',
    salary: { basic: 62000, hra: 24800, da: 6200, allowances: 7700, deductions: 9700 },
  },
  {
    id: 'emp019',
    employeeId: 'EMP019',
    firstName: 'Arun',
    lastName: 'Nambiar',
    email: 'arun.n@company.com',
    phone: '+91 98765 43228',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: '2022-01-15',
    status: 'active',
    salary: { basic: 42000, hra: 16800, da: 4200, allowances: 5200, deductions: 6600 },
  },
  {
    id: 'emp020',
    employeeId: 'EMP020',
    firstName: 'Geeta',
    lastName: 'Sharma',
    email: 'geeta.sharma@company.com',
    phone: '+91 98765 43229',
    department: 'Human Resources',
    designation: 'Recruiter',
    joiningDate: '2022-02-01',
    status: 'active',
    salary: { basic: 40000, hra: 16000, da: 4000, allowances: 5000, deductions: 6300 },
  },
];

// Generate attendance for current month
const generateAttendance = (): Attendance[] => {
  const attendance: Attendance[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  employees.forEach((emp) => {
    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        attendance.push({
          id: `att-${emp.id}-${day}`,
          employeeId: emp.id,
          date: date.toISOString().split('T')[0],
          status: 'weekend',
        });
        continue;
      }
      
      // Random attendance status
      const rand = Math.random();
      let status: Attendance['status'];
      let checkIn: string | undefined;
      let checkOut: string | undefined;
      let workingHours: number | undefined;
      
      if (rand > 0.95) {
        status = 'absent';
      } else if (rand > 0.9) {
        status = 'leave';
      } else if (rand > 0.85) {
        status = 'half-day';
        checkIn = '09:30';
        checkOut = '14:00';
        workingHours = 4.5;
      } else {
        status = 'present';
        const checkInHour = 8 + Math.floor(Math.random() * 2);
        const checkInMin = Math.floor(Math.random() * 60);
        checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMin.toString().padStart(2, '0')}`;
        
        const checkOutHour = 17 + Math.floor(Math.random() * 3);
        const checkOutMin = Math.floor(Math.random() * 60);
        checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMin.toString().padStart(2, '0')}`;
        
        workingHours = (checkOutHour - checkInHour) + (checkOutMin - checkInMin) / 60;
      }
      
      attendance.push({
        id: `att-${emp.id}-${day}`,
        employeeId: emp.id,
        date: date.toISOString().split('T')[0],
        status,
        checkIn,
        checkOut,
        workingHours: workingHours ? parseFloat(workingHours.toFixed(1)) : undefined,
      });
    }
  });
  
  return attendance;
};

export const attendance: Attendance[] = generateAttendance();

export const leaves: Leave[] = [
  {
    id: 'leave001',
    employeeId: 'emp002',
    leaveType: 'casual',
    startDate: '2024-12-18',
    endDate: '2024-12-19',
    days: 2,
    reason: 'Personal work',
    status: 'pending',
    appliedOn: '2024-12-14',
  },
  {
    id: 'leave002',
    employeeId: 'emp004',
    leaveType: 'sick',
    startDate: '2024-12-16',
    endDate: '2024-12-16',
    days: 1,
    reason: 'Not feeling well',
    status: 'approved',
    appliedOn: '2024-12-15',
    approvedBy: 'emp001',
  },
  {
    id: 'leave003',
    employeeId: 'emp009',
    leaveType: 'earned',
    startDate: '2024-12-23',
    endDate: '2024-12-27',
    days: 5,
    reason: 'Year-end vacation',
    status: 'pending',
    appliedOn: '2024-12-10',
  },
  {
    id: 'leave004',
    employeeId: 'emp012',
    leaveType: 'casual',
    startDate: '2024-12-20',
    endDate: '2024-12-20',
    days: 1,
    reason: 'Family function',
    status: 'approved',
    appliedOn: '2024-12-12',
    approvedBy: 'emp011',
  },
  {
    id: 'leave005',
    employeeId: 'emp017',
    leaveType: 'sick',
    startDate: '2024-12-13',
    endDate: '2024-12-14',
    days: 2,
    reason: 'Fever and cold',
    status: 'approved',
    appliedOn: '2024-12-13',
    approvedBy: 'emp001',
  },
];

export const leaveBalances: LeaveBalance[] = employees.map((emp) => ({
  employeeId: emp.id,
  casual: { total: 12, used: Math.floor(Math.random() * 6), balance: 0 },
  sick: { total: 10, used: Math.floor(Math.random() * 4), balance: 0 },
  earned: { total: 15, used: Math.floor(Math.random() * 8), balance: 0 },
})).map((lb) => ({
  ...lb,
  casual: { ...lb.casual, balance: lb.casual.total - lb.casual.used },
  sick: { ...lb.sick, balance: lb.sick.total - lb.sick.used },
  earned: { ...lb.earned, balance: lb.earned.total - lb.earned.used },
}));

export const activities: Activity[] = [
  {
    id: 'act001',
    type: 'leave',
    title: 'Leave Request',
    description: 'Priya Sharma applied for 2 days casual leave',
    timestamp: '2024-12-14T10:30:00',
    employeeId: 'emp002',
    employeeName: 'Priya Sharma',
  },
  {
    id: 'act002',
    type: 'employee',
    title: 'New Employee Joined',
    description: 'Welcome Geeta Sharma to the HR team!',
    timestamp: '2024-12-01T09:00:00',
    employeeId: 'emp020',
    employeeName: 'Geeta Sharma',
  },
  {
    id: 'act003',
    type: 'payroll',
    title: 'Payroll Processed',
    description: 'November 2024 payroll has been processed for 20 employees',
    timestamp: '2024-12-05T14:00:00',
  },
  {
    id: 'act004',
    type: 'attendance',
    title: 'Late Arrival',
    description: 'Amit Patel marked late arrival at 10:45 AM',
    timestamp: '2024-12-13T10:45:00',
    employeeId: 'emp003',
    employeeName: 'Amit Patel',
  },
  {
    id: 'act005',
    type: 'announcement',
    title: 'Holiday Announcement',
    description: 'Office will remain closed on Dec 25 for Christmas',
    timestamp: '2024-12-10T11:00:00',
  },
  {
    id: 'act006',
    type: 'leave',
    title: 'Leave Approved',
    description: 'Sneha Reddy\'s sick leave has been approved',
    timestamp: '2024-12-15T09:15:00',
    employeeId: 'emp004',
    employeeName: 'Sneha Reddy',
  },
];

export const payrolls: Payroll[] = employees.map((emp) => {
  const grossSalary = emp.salary.basic + emp.salary.hra + emp.salary.da + emp.salary.allowances;
  const pf = Math.round(emp.salary.basic * 0.12);
  const tax = Math.round(grossSalary * 0.1);
  const totalDeductions = pf + tax + emp.salary.deductions;
  
  return {
    id: `payroll-${emp.id}-nov`,
    employeeId: emp.id,
    month: 'November',
    year: 2024,
    basicSalary: emp.salary.basic,
    hra: emp.salary.hra,
    da: emp.salary.da,
    allowances: emp.salary.allowances,
    grossSalary,
    pf,
    tax,
    otherDeductions: emp.salary.deductions,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
    status: 'paid',
    processedOn: '2024-12-05',
  };
});
