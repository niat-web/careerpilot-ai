import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileForm } from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import type { Profile } from '../types';

export function OnboardingPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Set up your profile</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Tell CareerPilot a bit about yourself so interview questions match your level and goals.
        </p>
      </div>
      <ProfileForm
        initial={profile}
        submitLabel="Finish setup"
        error={error}
        onSubmit={async (payload) => {
          setError(null);
          try {
            await apiFetch<{ profile: Profile }>('/api/profile', {
              method: 'PUT',
              body: JSON.stringify(payload),
            });
            await refreshProfile();
            navigate('/dashboard');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save profile');
          }
        }}
      />
    </div>
  );
}

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Profile settings</h1>
        <p className="mt-2 text-sm text-ink-muted">Update your goals, experience, and prep preferences.</p>
      </div>
      {success && (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-dark">
          Profile updated successfully.
        </p>
      )}
      <ProfileForm
        initial={profile}
        submitLabel="Update profile"
        error={error}
        onSubmit={async (payload) => {
          setError(null);
          setSuccess(false);
          try {
            await apiFetch<{ profile: Profile }>('/api/profile', {
              method: 'PUT',
              body: JSON.stringify(payload),
            });
            await refreshProfile();
            setSuccess(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not update profile');
          }
        }}
      />
    </div>
  );
}
