import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewSetupForm } from '../components/InterviewSetupForm';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import type { InterviewQuestion, InterviewSession } from '../types';

export function NewInterviewPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Configure your interview"
        description="Choose a role, topic, and difficulty. CareerPilot generates one question at a time and evaluates each answer."
      />
      <InterviewSetupForm
        defaultRole={profile?.target_role || undefined}
        defaultDifficulty={profile?.preferred_difficulty || undefined}
        error={error}
        onSubmit={async (data) => {
          setError(null);
          try {
            const res = await apiFetch<{ session: InterviewSession; question: InterviewQuestion }>(
              '/api/interviews/start',
              { method: 'POST', body: JSON.stringify(data) }
            );
            navigate(`/interview/${res.session.id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not start interview');
          }
        }}
      />
    </div>
  );
}
