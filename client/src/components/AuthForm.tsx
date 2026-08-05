import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, registerSchema } from '../lib/validation';
import { ErrorAlert } from './ErrorAlert';

type LoginData = { email: string; password: string };
type RegisterData = { full_name: string; email: string; password: string };
type Mode = 'login' | 'register';

type Props = {
  mode: Mode;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string | null;
};

export function AuthForm({ mode, onSubmit, error }: Props) {
  if (mode === 'register') return <RegisterForm onSubmit={onSubmit} error={error} />;
  return <LoginForm onSubmit={onSubmit} error={error} />;
}

function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink text-white lg:block">
        <div className="hero-grid absolute inset-0" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <p className="font-display text-3xl text-accent-soft">CareerPilot AI</p>
          <div>
            <h2 className="max-w-md font-display text-3xl leading-snug">
              Practice with structure. Improve with feedback.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Built for undergraduates and entry-level developers preparing for technical interviews.
            </p>
          </div>
          <p className="text-xs text-white/40">Gemini-powered coaching · Supabase-secured sessions</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="font-display text-3xl text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({
  onSubmit,
  error,
}: {
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start practicing technical interviews with CareerPilot AI."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(async (d) => onSubmit(d))} className="space-y-4">
        {error && <ErrorAlert message={error} />}
        <Field label="Full name" error={errors.full_name?.message}>
          <input className="input-field" autoComplete="name" {...register('full_name')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className="input-field" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" className="input-field" autoComplete="new-password" {...register('password')} />
        </Field>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}

function LoginForm({
  onSubmit,
  error,
}: {
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your interview preparation."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(async (d) => onSubmit(d))} className="space-y-4">
        {error && <ErrorAlert message={error} />}
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className="input-field" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            className="input-field"
            autoComplete="current-password"
            {...register('password')}
          />
        </Field>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-3">
          {isSubmitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
