import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { InterviewHistoryTable } from '../components/InterviewHistoryTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import type { InterviewSession, ProgressRow, Profile } from '../types';

type DashboardData = {
  profile: Profile | null;
  stats: {
    total_interviews: number;
    completed_interviews: number;
    average_score: number | null;
    topics_practiced: number;
  };
  recent_sessions: InterviewSession[];
  progress: ProgressRow[];
};

export function DashboardPage() {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<DashboardData>('/api/dashboard')
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading your dashboard…" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">
            Hi{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Track your mock interviews and keep practicing toward your target role.
          </p>
        </div>
        <Link
          to="/interview/new"
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Start new interview
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Interviews" value={data.stats.total_interviews} />
            <DashboardCard title="Completed" value={data.stats.completed_interviews} />
            <DashboardCard
              title="Average score"
              value={data.stats.average_score != null ? data.stats.average_score : '—'}
              hint="Across completed interviews"
            />
            <DashboardCard title="Topics practiced" value={data.stats.topics_practiced} />
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Recent interviews</h2>
              <Link to="/history" className="text-sm font-medium text-accent hover:underline">
                View all
              </Link>
            </div>
            {data.recent_sessions.length ? (
              <InterviewHistoryTable interviews={data.recent_sessions} />
            ) : (
              <EmptyState
                title="No interviews yet"
                description="Start your first mock interview to see progress here."
                action={
                  <Link
                    to="/interview/new"
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
                  >
                    Start interview
                  </Link>
                }
              />
            )}
          </section>

          {data.progress.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl text-ink">Topic progress</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.progress.slice(0, 6).map((row) => (
                  <div key={row.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="font-medium text-ink">{row.topic}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      Avg {Number(row.average_score).toFixed(1)} · Best{' '}
                      {Number(row.best_score).toFixed(1)} · {row.attempts} attempts
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
