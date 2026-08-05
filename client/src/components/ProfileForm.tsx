import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileFormSchema } from '../lib/validation';
import { TARGET_ROLES, DIFFICULTIES } from '../types';
import type { Profile } from '../types';
import { ErrorAlert } from './ErrorAlert';

type FormData = z.infer<typeof profileFormSchema>;

type Props = {
  initial?: Partial<Profile> | null;
  submitLabel?: string;
  onSubmit: (data: {
    full_name: string;
    university?: string | null;
    current_year?: string | null;
    target_role: string;
    experience_level: string;
    preferred_difficulty: string;
    known_technologies: string[];
    weak_technologies: string[];
    daily_preparation_minutes: number;
    onboarding_completed: boolean;
  }) => Promise<void>;
  error?: string | null;
};

function splitTech(value?: string) {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProfileForm({ initial, submitLabel = 'Save profile', onSubmit, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: initial?.full_name || '',
      university: initial?.university || '',
      current_year: initial?.current_year || '',
      target_role: (initial?.target_role as FormData['target_role']) || 'Full-Stack Developer',
      experience_level: (initial?.experience_level as FormData['experience_level']) || 'Beginner',
      preferred_difficulty: (initial?.preferred_difficulty as FormData['preferred_difficulty']) || 'Easy',
      known_technologies: (initial?.known_technologies || []).join(', '),
      weak_technologies: (initial?.weak_technologies || []).join(', '),
      daily_preparation_minutes: initial?.daily_preparation_minutes || 60,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onSubmit({
          full_name: data.full_name,
          university: data.university || null,
          current_year: data.current_year || null,
          target_role: data.target_role,
          experience_level: data.experience_level,
          preferred_difficulty: data.preferred_difficulty,
          known_technologies: splitTech(data.known_technologies),
          weak_technologies: splitTech(data.weak_technologies),
          daily_preparation_minutes: data.daily_preparation_minutes,
          onboarding_completed: true,
        });
      })}
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      {error && <ErrorAlert message={error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.full_name?.message}>
          <input className="input" {...register('full_name')} />
        </Field>
        <Field label="University" error={errors.university?.message}>
          <input className="input" {...register('university')} />
        </Field>
        <Field label="Current year" error={errors.current_year?.message}>
          <input className="input" placeholder="e.g. 3rd year" {...register('current_year')} />
        </Field>
        <Field label="Daily prep minutes" error={errors.daily_preparation_minutes?.message}>
          <input type="number" className="input" {...register('daily_preparation_minutes')} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Target role" error={errors.target_role?.message}>
          <select className="input" {...register('target_role')}>
            {TARGET_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Experience level" error={errors.experience_level?.message}>
          <select className="input" {...register('experience_level')}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </Field>
        <Field label="Preferred difficulty" error={errors.preferred_difficulty?.message}>
          <select className="input" {...register('preferred_difficulty')}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Technologies you know (comma-separated)"
        error={errors.known_technologies?.message}
      >
        <input className="input" placeholder="React, Node.js, SQL" {...register('known_technologies')} />
      </Field>

      <Field
        label="Weak areas to improve (comma-separated)"
        error={errors.weak_technologies?.message}
      >
        <input
          className="input"
          placeholder="System design, TypeScript, Authentication"
          {...register('weak_technologies')}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 2px var(--color-accent);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
