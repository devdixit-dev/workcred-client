import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { verifyOtp, pendingEmail, isAuthenticated, company } = useAuth();
  const { toast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingEmail) {
      navigate('/register');
    }
  }, [pendingEmail, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter all 6 digits.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = await verifyOtp(otpString);

    if (result.success) {
      toast({
        title: 'Verification Successful',
        description: 'Your email has been verified. Please login to continue.',
      });
      navigate('/login');
    } else {
      toast({
        title: 'Verification Failed',
        description: result.error,
        variant: 'destructive',
      });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }

    setIsLoading(false);
  };

  const handleResend = () => {
    toast({
      title: 'OTP Resent',
      description: 'A new verification code has been sent. (Demo: 123456)',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hr-surface-subtle p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl hr-gradient mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
          <p className="text-muted-foreground mt-1">
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-medium text-foreground">{pendingEmail}</p>
        </div>

        {/* OTP Form */}
        <div className="rounded-xl border border-border bg-card p-6 hr-shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button type="submit" className="w-full hr-gradient" disabled={isLoading}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Didn't receive code? </span>
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:underline font-medium"
            >
              Resend
            </button>
          </div>

          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Demo OTP: <span className="font-mono font-bold text-primary text-lg">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}
