import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileForm } from '../components/ProfileForm';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import type { Profile } from '../types';

export function OnboardingPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Set up your profile"
        description="Tell CareerPilot about your goals so interview questions match your level."
      />
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
      <PageHeader
        title="Profile settings"
        description="Update your goals, experience, and daily preparation preferences."
      />
      {success && (
        <p className="rounded-xl border border-success/20 bg-success-soft px-4 py-3 text-sm text-success">
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
