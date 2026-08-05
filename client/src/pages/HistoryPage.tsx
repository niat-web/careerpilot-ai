import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { InterviewHistoryTable } from '../components/InterviewHistoryTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import type { InterviewSession } from '../types';

export function HistoryPage() {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ interviews: InterviewSession[] }>('/api/interviews')
      .then((res) => setInterviews(res.interviews))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading history…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Interview history</h1>
        <p className="mt-2 text-sm text-ink-muted">Review past mock interviews and open reports.</p>
      </div>
      {error && <ErrorAlert message={error} />}
      {interviews.length ? (
        <InterviewHistoryTable interviews={interviews} />
      ) : (
        <EmptyState
          title="No interviews yet"
          description="Your completed and in-progress interviews will appear here."
          action={
            <Link to="/interview/new" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              Start interview
            </Link>
          }
        />
      )}
    </div>
  );
}
