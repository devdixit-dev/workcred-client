import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios.api';

const leaveTypes = [
  { value: 'casual', label: 'Casual Leave', balance: 8 },
  { value: 'sick', label: 'Sick Leave', balance: 7 },
  { value: 'earned', label: 'Earned Leave', balance: 12 },
  { value: 'unpaid', label: 'Unpaid Leave', balance: null },
];

export default function LeaveApply() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaveType, setLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLeaveType = leaveTypes.find((t) => t.value === leaveType);
  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (days <= 0) {
      toast({ title: 'Invalid Dates', description: 'End date must be after start date.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    await api.post('/user/leaves', {
      leaveType,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      reason,
    }, { notifySuccess: false });

    toast({ title: 'Leave Application Submitted', description: 'Your leave request has been sent for approval.' });

    setIsSubmitting(false);
    navigate('/leave');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-fade-in">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/leave"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Apply for Leave</h1>
          <p className="text-muted-foreground">Submit a new leave request</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 animate-slide-up">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Leave Details</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Leave Type *</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center justify-between gap-4">
                            <span>{type.label}</span>
                            {type.balance !== null && <span className="text-xs text-muted-foreground">{type.balance} days available</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => date < new Date() || (startDate ? date < startDate : false)} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {days > 0 && (
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-sm text-muted-foreground">Total Leave Days</p>
                    <p className="text-2xl font-bold text-primary">{days}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Reason *</Label>
                  <Textarea placeholder="Please provide a reason for your leave request..." value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button variant="outline" asChild><Link to="/leave">Cancel</Link></Button>
              <Button type="submit" disabled={isSubmitting} className="hr-gradient"><Send className="mr-2 h-4 w-4" />{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
            <h3 className="font-semibold text-foreground mb-4">Leave Balance</h3>
            <div className="space-y-4">
              {leaveTypes.filter((t) => t.balance !== null).map((type) => (
                <div key={type.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{type.label}</span>
                    <span className="text-sm font-medium text-foreground">{type.balance} days</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full hr-gradient" style={{ width: `${((type.balance || 0) / 15) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          {selectedLeaveType && (
            <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
              <h3 className="font-semibold text-foreground mb-2">Selected: {selectedLeaveType.label}</h3>
              {selectedLeaveType.balance !== null ? (
                <p className="text-sm text-muted-foreground">You have <span className="font-medium text-primary">{selectedLeaveType.balance} days</span> of {selectedLeaveType.label.toLowerCase()} available.</p>
              ) : (
                <p className="text-sm text-muted-foreground">Unpaid leave does not count against your leave balance.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
