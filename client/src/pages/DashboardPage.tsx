import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { InterviewHistoryTable } from '../components/InterviewHistoryTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
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

  const inProgress = useMemo(
    () => (data?.recent_sessions || []).filter((s) => s.status === 'in_progress'),
    [data]
  );

  const tip = useMemo(() => {
    const weak = profile?.weak_technologies?.[0];
    if (weak) return `Focus tip: spend today’s prep block on ${weak}.`;
    if ((data?.stats.completed_interviews || 0) === 0) {
      return 'Focus tip: start with a 3-question Easy mock to build rhythm.';
    }
    return 'Focus tip: review your last report before increasing difficulty.';
  }, [profile, data]);

  if (loading) return <LoadingState label="Loading your dashboard…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}`}
        description="Track mock interviews, resume unfinished sessions, and keep momentum toward your target role."
        actions={
          <Link to="/interview/new" className="btn btn-primary">
            Start new interview
          </Link>
        }
      />

      {error && <ErrorAlert message={error} />}

      {inProgress.length > 0 && (
        <div className="surface-panel animate-fade-up border-l-4 border-l-warm p-5">
          <p className="text-sm font-semibold text-ink">Resume in-progress interview</p>
          <p className="mt-1 text-sm text-ink-muted">
            You have {inProgress.length} unfinished session{inProgress.length > 1 ? 's' : ''}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {inProgress.slice(0, 3).map((s) => (
              <Link key={s.id} to={`/interview/${s.id}`} className="btn btn-secondary text-xs">
                Continue {s.topic} · {s.difficulty}
              </Link>
            ))}
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard title="Interviews" value={data.stats.total_interviews} hint="All sessions" />
            <DashboardCard title="Completed" value={data.stats.completed_interviews} hint="Finished mocks" />
            <DashboardCard
              title="Average score"
              value={data.stats.average_score != null ? data.stats.average_score : '—'}
              hint="Across completed interviews"
            />
            <DashboardCard title="Topics practiced" value={data.stats.topics_practiced} hint="Tracked progress" />
          </div>

          <div className="surface-panel p-5 animate-fade-up stagger-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Coach note</p>
            <p className="mt-2 text-sm text-ink">{tip}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/study-plan" className="btn btn-secondary text-xs">
                Open study plan
              </Link>
              <Link to="/history" className="btn btn-ghost text-xs">
                View history
              </Link>
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">Recent interviews</h2>
              <Link to="/history" className="text-sm font-semibold text-accent hover:underline">
                View all
              </Link>
            </div>
            {data.recent_sessions.length ? (
              <InterviewHistoryTable interviews={data.recent_sessions} />
            ) : (
              <EmptyState
                title="No interviews yet"
                description="Start your first mock interview to see progress and history here."
                action={
                  <Link to="/interview/new" className="btn btn-primary">
                    Start interview
                  </Link>
                }
              />
            )}
          </section>

          {data.progress.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-2xl text-ink">Topic progress</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {data.progress.slice(0, 6).map((row, i) => (
                  <div
                    key={row.id}
                    className={`surface-panel p-4 animate-fade-up stagger-${Math.min(i + 1, 4)}`}
                  >
                    <p className="font-semibold text-ink">{row.topic}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      Avg {Number(row.average_score).toFixed(1)} · Best {Number(row.best_score).toFixed(1)} ·{' '}
                      {row.attempts} attempts
                    </p>
                    <div className="progress-track mt-3">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(100, (Number(row.average_score) / 10) * 100)}%` }}
                      />
                    </div>
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
