import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { StudyPlanCard } from '../components/StudyPlanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { StudyPlan } from '../types';

export function StudyPlanPage() {
  const { profile } = useAuth();
  const [params] = useSearchParams();
  const sessionId = params.get('session');
  const [plans, setPlans] = useState<Array<Pick<StudyPlan, 'id' | 'plan_title' | 'created_at'>>>([]);
  const [active, setActive] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadPlans() {
    const res = await apiFetch<{ study_plans: Array<Pick<StudyPlan, 'id' | 'plan_title' | 'created_at'>> }>(
      '/api/study-plans'
    );
    setPlans(res.study_plans);
    if (res.study_plans[0]) {
      const detail = await apiFetch<{ study_plan: StudyPlan }>(`/api/study-plans/${res.study_plans[0].id}`);
      setActive(detail.study_plan);
    }
  }

  useEffect(() => {
    loadPlans()
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load study plans'))
      .finally(() => setLoading(false));
  }, []);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<{ study_plan: StudyPlan }>('/api/study-plans', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId || undefined,
          target_role: profile?.target_role,
          weak_areas: profile?.weak_technologies || [],
          daily_time: profile?.daily_preparation_minutes || 60,
        }),
      });
      setActive(res.study_plan);
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate study plan');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingState label="Loading study plans…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preparation"
        title="Seven-day study plan"
        description={`Generate a realistic prep schedule based on your weak areas${
          sessionId ? ' and latest interview report' : ''
        }.`}
        actions={
          <button type="button" disabled={busy} onClick={() => void generate()} className="btn btn-primary">
            {busy ? 'Generating…' : 'Generate new plan'}
          </button>
        }
      />

      {error && <ErrorAlert message={error} />}

      {active ? (
        <StudyPlanCard plan={active} />
      ) : (
        <EmptyState
          title="No study plan yet"
          description="Generate a seven-day plan to organize your interview preparation."
          action={
            <button type="button" disabled={busy} onClick={() => void generate()} className="btn btn-primary">
              Generate plan
            </button>
          }
        />
      )}

      {plans.length > 1 && (
        <section className="space-y-2">
          <h2 className="font-display text-xl text-ink">Previous plans</h2>
          <ul className="space-y-2">
            {plans.map((plan) => (
              <li key={plan.id}>
                <button
                  type="button"
                  className="text-sm font-semibold text-accent hover:underline"
                  onClick={() => {
                    void apiFetch<{ study_plan: StudyPlan }>(`/api/study-plans/${plan.id}`).then((res) =>
                      setActive(res.study_plan)
                    );
                  }}
                >
                  {plan.plan_title} ·{' '}
                  {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : ''}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
