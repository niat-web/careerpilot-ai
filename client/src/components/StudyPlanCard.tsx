import type { StudyPlan } from '../types';

type Props = {
  plan: StudyPlan;
};

export function StudyPlanCard({ plan }: Props) {
  const days = plan.plan_content?.days || [];

  return (
    <div className="space-y-4">
      <div className="surface-panel p-6">
        <h2 className="font-display text-2xl text-ink">{plan.plan_title}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Created {plan.created_at ? new Date(plan.created_at).toLocaleString() : ''}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {days.map((day) => (
          <article key={day.day} className="surface-panel p-5 animate-fade-up">
            <div className="mb-2 flex items-center justify-between">
              <span className="chip border-transparent bg-accent-soft text-accent-dark">Day {day.day}</span>
              <span className="text-xs text-ink-muted">{day.duration_minutes} min</span>
            </div>
            <h3 className="font-display text-lg text-ink">{day.topic}</h3>
            <p className="mt-1 text-sm text-ink-muted">{day.objective}</p>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <strong className="text-ink">Learn:</strong> {day.learning_activity}
              </p>
              <p>
                <strong className="text-ink">Practice:</strong> {day.practice_activity}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
