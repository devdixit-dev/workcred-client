import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api/axios.api';

const leaveTypeLabels: Record<string, string> = {
  casual: 'Casual Leave',
  sick: 'Sick Leave',
  earned: 'Earned Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  unpaid: 'Unpaid Leave',
};

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function LeavePage() {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  const loadLeaves = async () => {
    const endpoint = isAdmin ? '/admin/leaves' : '/user/leaves';
    const res = await api.get(endpoint);
    setLeaves(res.data.data || []);
  };

  useEffect(() => {
    loadLeaves();
  }, [isAdmin]);

  const filteredLeaves = useMemo(
    () => leaves.filter((leave) => statusFilter === 'all' || leave.status === statusFilter),
    [leaves, statusFilter]
  );

  const handleAction = (leave: any, action: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setActionType(action);
    setComment('');
  };

  const confirmAction = async () => {
    if (!selectedLeave || !actionType) return;

    await api.patch(`/admin/leaves/${selectedLeave.id}`, {
      status: actionType === 'approve' ? 'approved' : 'rejected',
      comments: comment,
    }, { notifySuccess: false });

    toast({
      title: actionType === 'approve' ? 'Leave Approved' : 'Leave Rejected',
      description: `Leave request has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
    });

    setSelectedLeave(null);
    setActionType(null);
    await loadLeaves();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
          <p className="text-muted-foreground">Review and manage employee leave applications</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-foreground">{leaves.filter((l) => l.status === 'pending').length}</p></div><div className="rounded-lg bg-warning/10 p-2"><Clock className="h-5 w-5 text-warning" /></div></div></div>
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-foreground">{leaves.filter((l) => l.status === 'approved').length}</p></div><div className="rounded-lg bg-success/10 p-2"><Check className="h-5 w-5 text-success" /></div></div></div>
        <div className="rounded-xl border border-border bg-card p-4 hr-shadow-card"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Rejected</p><p className="text-2xl font-bold text-foreground">{leaves.filter((l) => l.status === 'rejected').length}</p></div><div className="rounded-lg bg-destructive/10 p-2"><X className="h-5 w-5 text-destructive" /></div></div></div>
      </div>

      <div className="space-y-4 animate-slide-up">
        {filteredLeaves.map((leave) => {
          const initials = `${(leave.employeeName || 'U')[0] || 'U'}${(leave.employeeName || 'U').split(' ')[1]?.[0] || ''}`;

          return (
            <div key={leave.id} className="rounded-xl border border-border bg-card p-5 hr-shadow-card hr-card-hover">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full hr-gradient"><span className="text-lg font-semibold text-primary-foreground">{initials}</span></div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{leave.employeeName || 'You'}</h3>
                    <p className="text-sm text-muted-foreground">{leave.employeeDepartment || '-'} | {leave.employeeDesignation || '-'}</p>
                    <Badge variant="outline" className={cn('mt-2', statusStyles[leave.status])}>{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-medium text-foreground">{leaveTypeLabels[leave.leaveType]}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}</p>
                  <p className="text-sm font-medium text-primary">{leave.days} day(s)</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-secondary/50 p-3"><p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Reason:</span> {leave.reason}</p></div>

              {isAdmin && leave.status === 'pending' && (
                <div className="mt-4 flex items-center justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleAction(leave, 'reject')} className="text-destructive hover:bg-destructive/10"><X className="mr-1 h-4 w-4" />Reject</Button>
                  <Button size="sm" onClick={() => handleAction(leave, 'approve')} className="bg-success hover:bg-success/90"><Check className="mr-1 h-4 w-4" />Approve</Button>
                </div>
              )}

              {leave.comments && (
                <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground"><MessageSquare className="h-4 w-4 mt-0.5" /><span>{leave.comments}</span></div>
              )}
            </div>
          );
        })}

        {filteredLeaves.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4"><Clock className="h-8 w-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold text-foreground">No leave requests</h3>
            <p className="text-muted-foreground">There are no leave requests matching your filter</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request</DialogTitle>
            <DialogDescription>
              {actionType === 'approve' ? 'Are you sure you want to approve this leave request?' : 'Please provide a reason for rejecting this leave request.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4"><Textarea placeholder="Add a comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLeave(null)}>Cancel</Button>
            <Button onClick={confirmAction} className={actionType === 'approve' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}>
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
