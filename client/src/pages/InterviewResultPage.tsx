import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { PageHeader } from '../components/PageHeader';
import type { InterviewAnswer, InterviewQuestion, InterviewSession } from '../types';

type Payload = {
  session: InterviewSession;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
};

export function InterviewResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiFetch<Payload>(`/api/interviews/${id}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load report'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState label="Loading report…" />;
  if (error || !data) return <ErrorAlert message={error || 'Report not found'} />;

  const { session, answers } = data;

  if (session.status !== 'completed') {
    return (
      <div className="space-y-4">
        <ErrorAlert message="This interview is not completed yet." />
        <Link to={`/interview/${session.id}`} className="font-semibold text-accent hover:underline">
          Continue interview
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={session.target_role}
        description={`${session.topic} · ${session.interview_type} · ${session.difficulty}`}
      />

      <div className="surface-panel p-6 animate-fade-up">
        <ScoreDisplay
          score={Number(session.overall_score || 0)}
          max={100}
          label="Overall score"
          size="lg"
        />
        <p className="mt-2 text-center text-sm text-ink-muted">
          Performance level: <strong className="text-ink">{session.performance_level}</strong>
        </p>
        {session.final_message && (
          <p className="mt-6 rounded-xl bg-accent-soft/60 p-4 text-sm text-ink">{session.final_message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoBlock title="Technical summary" body={session.technical_summary} />
        <InfoBlock title="Communication summary" body={session.communication_summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListBlock title="Strong areas" items={session.strong_areas} />
        <ListBlock title="Weak areas" items={session.weak_areas} />
      </div>

      <ListBlock title="Topics to revise" items={session.topics_to_revise} />
      {session.next_difficulty && (
        <p className="text-sm text-ink-muted">
          Recommended next difficulty: <strong className="text-ink">{session.next_difficulty}</strong>
        </p>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">Answer breakdown</h2>
        {answers.map((a, idx) => (
          <div key={a.id} className="surface-panel p-4 text-sm">
            <p className="font-semibold text-ink">
              Q{idx + 1}: {Number(a.score).toFixed(1)}/10 · {a.result}
            </p>
            <p className="mt-1 line-clamp-2 text-ink-muted">{a.technical_feedback}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to={`/study-plan?session=${session.id}`} className="btn btn-primary">
          Generate 7-day study plan
        </Link>
        <Link to="/interview/new" className="btn btn-secondary">
          Practice again
        </Link>
        <Link to="/dashboard" className="btn btn-ghost">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <div className="surface-panel p-5">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm text-ink-muted">{body}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <div className="surface-panel p-5">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
