import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useInterviewRealtime } from '../hooks/useInterviewRealtime';
import { InterviewQuestionCard } from '../components/InterviewQuestionCard';
import { AnswerTextarea } from '../components/AnswerTextarea';
import { EvaluationResultCard } from '../components/EvaluationResultCard';
import { ProcessingStatusBadge } from '../components/ProcessingStatusBadge';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import type { InterviewAnswer, InterviewQuestion, InterviewSession } from '../types';

type InterviewPayload = {
  session: InterviewSession;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
};

export function LiveInterviewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<InterviewPayload | null>(null);
  const [answer, setAnswer] = useState('');
  const [latestEval, setLatestEval] = useState<InterviewAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const { processingStatus, sessionPatch } = useInterviewRealtime(id, user?.id);

  const load = useCallback(async () => {
    if (!id) return;
    const res = await apiFetch<InterviewPayload>(`/api/interviews/${id}`);
    setData(res);
    if (res.session.status === 'completed') {
      navigate(`/interview/${id}/result`, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    load()
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load interview'))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (sessionPatch && data) {
      setData((prev) => (prev ? { ...prev, session: { ...prev.session, ...sessionPatch } } : prev));
    }
  }, [sessionPatch, data]);

  const currentQuestion = useMemo(() => {
    if (!data?.questions.length) return null;
    return data.questions[data.questions.length - 1];
  }, [data]);

  const answeredCurrent = useMemo(() => {
    if (!currentQuestion || !data) return false;
    return data.answers.some((a) => a.question_id === currentQuestion.id) || !!latestEval;
  }, [currentQuestion, data, latestEval]);

  const status = processingStatus || data?.session.processing_status;

  async function handleSubmitAnswer() {
    if (!id || !currentQuestion) return;
    if (answer.trim().length < 10) {
      setError('Please write a longer answer (at least 10 characters).');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<{
        evaluation: InterviewAnswer;
        is_last_question: boolean;
      }>(`/api/interviews/${id}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          question_id: currentQuestion.id,
          student_answer: answer.trim(),
        }),
      });
      setLatestEval(res.evaluation);
      setAnswer('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit answer');
    } finally {
      setBusy(false);
    }
  }

  async function handleNextQuestion() {
    if (!id) return;
    setBusy(true);
    setError(null);
    setLatestEval(null);
    try {
      await apiFetch(`/api/interviews/${id}/question`, { method: 'POST' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load next question');
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/interviews/${id}/complete`, { method: 'POST' });
      navigate(`/interview/${id}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete interview');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingState label="Loading interview…" />;
  if (!data || !currentQuestion) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error || 'Interview not found.'} />
        <Link to="/interview/new" className="text-accent hover:underline">
          Start a new interview
        </Link>
      </div>
    );
  }

  const answeredCount = data.answers.length;
  const isLastAnswered = answeredCount >= data.session.total_questions;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Live interview</h1>
          <p className="text-sm text-ink-muted">
            {data.session.target_role} · {data.session.topic} · {data.session.difficulty}
          </p>
        </div>
        <ProcessingStatusBadge status={status} />
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <InterviewQuestionCard
        question={currentQuestion}
        current={currentQuestion.question_order}
        total={data.session.total_questions}
      />

      {!answeredCurrent && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <AnswerTextarea value={answer} onChange={setAnswer} disabled={busy} />
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSubmitAnswer()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {busy ? 'Evaluating…' : 'Submit answer'}
          </button>
        </div>
      )}

      {(latestEval ||
        data.answers.find((a) => a.question_id === currentQuestion.id)) && (
        <>
          <EvaluationResultCard
            evaluation={
              latestEval ||
              data.answers.find((a) => a.question_id === currentQuestion.id)!
            }
          />
          <div className="flex flex-wrap gap-3">
            {!isLastAnswered ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleNextQuestion()}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
              >
                {busy ? 'Loading…' : 'Next question'}
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleComplete()}
                className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-60"
              >
                {busy ? 'Generating report…' : 'Finish & view report'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
