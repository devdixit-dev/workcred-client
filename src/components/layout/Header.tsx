import { useState, useEffect } from 'react';
import { Menu, Bell, HelpCircle, LogOut, LogIn, LogOut as LogOutIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false);
    }
  }, [countdown, isDisabled]);

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setIsDisabled(true);
    setCountdown(10);
    toast({
      title: 'Checked In',
      description: `You checked in at ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setIsDisabled(true);
    setCountdown(10);
    toast({
      title: 'Checked Out',
      description: `You checked out at ${new Date().toLocaleTimeString()}`,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Check In/Out buttons for employees */}
        {!isAdmin && (
          <div className="flex items-center gap-2 mr-2">
            {!isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                size="sm"
                disabled={isDisabled}
                className="bg-success hover:bg-success/90 text-success-foreground gap-2 disabled:opacity-50"
              >
                {isDisabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isDisabled ? `Wait ${countdown}s` : 'Check In'}
                </span>
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                size="sm"
                variant="destructive"
                disabled={isDisabled}
                className="gap-2 disabled:opacity-50"
              >
                {isDisabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOutIcon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isDisabled ? `Wait ${countdown}s` : 'Check Out'}
                </span>
              </Button>
            )}
          </div>
        )}

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-2 gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full hr-gradient">
                <span className="text-sm font-semibold text-primary-foreground">{initials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}