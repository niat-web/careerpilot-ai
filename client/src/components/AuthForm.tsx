import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, registerSchema } from '../lib/validation';
import { ErrorAlert } from './ErrorAlert';

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  full_name: string;
  email: string;
  password: string;
};

type Mode = 'login' | 'register';

type Props = {
  mode: Mode;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  error?: string | null;
};

export function AuthForm({ mode, onSubmit, error }: Props) {
  if (mode === 'register') {
    return <RegisterForm onSubmit={onSubmit} error={error} />;
  }
  return <LoginForm onSubmit={onSubmit} error={error} />;
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
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => onSubmit(data))}
      className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div>
        <h1 className="font-display text-3xl text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Start practicing technical interviews with CareerPilot AI.
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
          {...register('full_name')}
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-danger">{errors.full_name.message}</p>
        )}
      </div>

      <EmailPasswordFields register={register} errors={errors} mode="register" />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Please wait…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </form>
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
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => onSubmit(data))}
      className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div>
        <h1 className="font-display text-3xl text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-muted">Log in to continue your interview prep.</p>
      </div>

      {error && <ErrorAlert message={error} />}

      <EmailPasswordFields register={register} errors={errors} mode="login" />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Please wait…' : 'Log in'}
      </button>

      <p className="text-center text-sm text-ink-muted">
        New here?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

function EmailPasswordFields({
  register,
  errors,
  mode,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  mode: Mode;
}) {
  return (
    <>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
      </div>
    </>
  );
}
