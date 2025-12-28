import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  Palmtree,
  DollarSign,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Building2,
  User,
  Clock,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
  adminOnly?: boolean;
}

const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  {
    name: 'Employees',
    href: '/employees',
    icon: Users,
    children: [
      { name: 'Directory', href: '/employees' },
      { name: 'Add Employee', href: '/employees/add' },
    ],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: Calendar,
    children: [
      { name: 'Mark Attendance', href: '/attendance' },
      { name: 'Attendance Sheet', href: '/attendance/sheet' },
    ],
  },
  {
    name: 'Leave',
    href: '/leave',
    icon: Palmtree,
    children: [
      { name: 'Leave Requests', href: '/leave' },
      { name: 'Leave Balance', href: '/leave/balance' },
    ],
  },
  {
    name: 'Payroll',
    href: '/payroll',
    icon: DollarSign,
    adminOnly: true,
  },
  { name: 'Reports', href: '/reports', icon: BarChart3, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const employeeNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'My Attendance', href: '/my-attendance', icon: Clock },
  {
    name: 'Leave',
    href: '/leave',
    icon: Palmtree,
    children: [
      { name: 'Apply Leave', href: '/leave/apply' },
      { name: 'My Leaves', href: '/leave' },
    ],
  },
  { name: 'My Salary', href: '/my-salary', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Employees', 'Leave', 'Payroll', 'Attendance']);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 400;

  const navigation = isAdmin ? adminNavigation : employeeNavigation;

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-sidebar hr-transition',
          'lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isResizing && 'transition-none select-none'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg hr-gradient">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">HR Portal</h1>
              <p className="text-xs text-muted-foreground">{isAdmin ? 'Admin Panel' : 'Employee Portal'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 hover:bg-accent lg:hidden"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hr-transition',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-sidebar-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedItems.includes(item.name) && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavLink
                              to={child.href}
                              onClick={() => setIsOpen(false)}
                              className={({ isActive }) =>
                                cn(
                                  'block rounded-lg px-3 py-2 text-sm hr-transition',
                                  isActive
                                    ? 'bg-primary/10 font-medium text-primary'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hr-transition',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-sidebar-foreground hover:bg-accent hover:text-foreground'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-semibold text-primary">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'Administrator' : user?.designation || 'Employee'}
              </p>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/30 transition-colors hidden lg:block',
            isResizing && 'bg-primary/50'
          )}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-8 -mr-2 rounded bg-border/50 opacity-0 hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </aside>
    </>
  );
}
