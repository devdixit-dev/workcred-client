import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users2,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    title: 'Employee Directory',
    description: 'Keep every profile, role, and department organized in one searchable workspace.',
    icon: Users2,
  },
  {
    title: 'Attendance Tracking',
    description: 'Capture daily check-ins, view team attendance patterns, and reduce manual follow-ups.',
    icon: CalendarCheck2,
  },
  {
    title: 'Leave Management',
    description: 'Review requests faster with balances, approval workflows, and cleaner visibility.',
    icon: Clock3,
  },
  {
    title: 'Payroll Overview',
    description: 'Streamline salary processes and maintain transparent records for every employee.',
    icon: Wallet,
  },
  {
    title: 'Reports & Analytics',
    description: 'Turn attendance and workforce data into actionable monthly and quarterly insights.',
    icon: BarChart3,
  },
  {
    title: 'Secure Access Control',
    description: 'Separate admin and employee views with role-based access and protected routes.',
    icon: ShieldCheck,
  },
];

const milestones = [
  'Company onboarding in guided steps',
  'Add team members and assign departments',
  'Set working hours and attendance policies',
  'Manage payroll, leave, and monthly reporting',
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-64 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12)_0,transparent_45%)]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg hr-gradient">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="text-lg font-semibold tracking-tight [font-family:'Sora',sans-serif]">WorkCred</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground hr-transition">Features</a>
            <a href="#how" className="hover:text-foreground hr-transition">How it works</a>
            <a href="#trust" className="hover:text-foreground hr-transition">Why teams choose us</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="hr-gradient">
              <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                {isAuthenticated ? 'Open Dashboard' : 'Start Free'}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for growing teams and modern HR operations
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl [font-family:'Sora',sans-serif]">
              Run your workforce with clarity, speed, and less admin chaos.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              WorkCred is your all-in-one HR workspace for attendance, employee records, leave, payroll, and reporting.
              Keep teams aligned with a clean dashboard and role-based access.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="hr-gradient">
                <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                  {isAuthenticated ? 'Go to Dashboard' : 'Create Company Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Onboarding</p>
                <p className="mt-1 font-semibold">Guided Setup</p>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Roles</p>
                <p className="mt-1 font-semibold">Admin + Employee</p>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-3 col-span-2 sm:col-span-1">
                <p className="text-xs text-muted-foreground">Deployment</p>
                <p className="mt-1 font-semibold">Production Ready</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-6 hr-shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Product Highlights</p>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Live Overview
              </span>
            </div>
            <div className="space-y-3">
              {milestones.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-primary">Features</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight [font-family:'Sora',sans-serif]">
                Everything your HR team needs in one place
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-xl border border-border bg-card/60 p-5 hr-card-hover">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight [font-family:'Sora',sans-serif]">How WorkCred gets you live fast</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border/70 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">Step 01</p>
                <p className="mt-2 font-medium">Register your company</p>
                <p className="mt-2 text-sm text-muted-foreground">Create your account and verify email to initialize your workspace.</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">Step 02</p>
                <p className="mt-2 font-medium">Complete onboarding</p>
                <p className="mt-2 text-sm text-muted-foreground">Add employees, set working hours, and configure company details.</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/50 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">Step 03</p>
                <p className="mt-2 font-medium">Operate and scale</p>
                <p className="mt-2 text-sm text-muted-foreground">Track attendance, manage leave, and monitor payroll and reports.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-card/70 p-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight [font-family:'Sora',sans-serif]">Built to simplify HR decisions every day</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              From first onboarding to monthly payroll, WorkCred helps teams save time, reduce manual errors, and keep every process visible.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="hr-gradient">
                <Link to={isAuthenticated ? '/dashboard' : '/register'}>{isAuthenticated ? 'Open Workspace' : 'Start with WorkCred'}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
          <p>(c) {new Date().getFullYear()} WorkCred. HR operations platform.</p>
          <p>Attendance, leave, payroll, and employee management in one system.</p>
        </div>
      </footer>
    </div>
  );
}
