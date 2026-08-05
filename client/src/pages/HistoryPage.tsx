import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { InterviewHistoryTable } from '../components/InterviewHistoryTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { InterviewSession } from '../types';

export function HistoryPage() {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'completed' | 'in_progress'>('all');

  useEffect(() => {
    apiFetch<{ interviews: InterviewSession[] }>('/api/interviews')
      .then((res) => setInterviews(res.interviews))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return interviews.filter((item) => {
      const statusOk = status === 'all' ? true : item.status === status;
      if (!statusOk) return false;
      if (!q) return true;
      return [item.target_role, item.topic, item.difficulty, item.interview_type]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [interviews, query, status]);

  if (loading) return <LoadingState label="Loading history…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="History"
        title="Interview history"
        description="Search and filter past mocks, then open a report or resume an unfinished session."
        actions={
          <Link to="/interview/new" className="btn btn-primary">
            New interview
          </Link>
        }
      />

      {error && <ErrorAlert message={error} />}

      {interviews.length > 0 && (
        <div className="surface-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <input
            className="input-field"
            placeholder="Search role, topic, difficulty…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search interviews"
          />
          <div className="flex gap-2">
            {([
              ['all', 'All'],
              ['completed', 'Completed'],
              ['in_progress', 'In progress'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`btn text-xs ${status === value ? 'btn-primary' : 'btn-secondary'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length ? (
        <InterviewHistoryTable interviews={filtered} />
      ) : interviews.length ? (
        <EmptyState title="No matches" description="Try a different search or status filter." />
      ) : (
        <EmptyState
          title="No interviews yet"
          description="Your completed and in-progress interviews will appear here."
          action={
            <Link to="/interview/new" className="btn btn-primary">
              Start interview
            </Link>
          }
        />
      )}
    </div>
  );
}
