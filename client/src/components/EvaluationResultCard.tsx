import type { InterviewAnswer } from '../types';
import { ScoreDisplay } from './ScoreDisplay';

type Props = {
  evaluation: InterviewAnswer;
};

function PointList({ title, items, tone }: { title: string; items?: string[] | null; tone: string }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className={`text-sm font-semibold ${tone}`}>{title}</h4>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function EvaluationResultCard({ evaluation }: Props) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Result</p>
          <p className="font-display text-2xl text-ink">{evaluation.result || 'Evaluated'}</p>
        </div>
        <ScoreDisplay score={Number(evaluation.score)} label="Score" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PointList title="Correct points" items={evaluation.correct_points} tone="text-success" />
        <PointList title="Missing points" items={evaluation.missing_points} tone="text-warm" />
        <PointList title="Incorrect points" items={evaluation.incorrect_points} tone="text-danger" />
      </div>

      <FeedbackPanel
        technical={evaluation.technical_feedback}
        communication={evaluation.communication_feedback}
        improved={evaluation.improved_answer}
        followUp={evaluation.follow_up_question}
        topic={evaluation.recommended_topic}
      />
    </div>
  );
}

export function FeedbackPanel({
  technical,
  communication,
  improved,
  followUp,
  topic,
}: {
  technical?: string | null;
  communication?: string | null;
  improved?: string | null;
  followUp?: string | null;
  topic?: string | null;
}) {
  return (
    <div className="space-y-4 border-t border-border pt-4">
      {technical && (
        <section>
          <h4 className="text-sm font-semibold text-ink">Technical feedback</h4>
          <p className="mt-1 text-sm text-ink-muted whitespace-pre-wrap">{technical}</p>
        </section>
      )}
      {communication && (
        <section>
          <h4 className="text-sm font-semibold text-ink">Communication feedback</h4>
          <p className="mt-1 text-sm text-ink-muted whitespace-pre-wrap">{communication}</p>
        </section>
      )}
      {improved && (
        <section className="rounded-xl bg-accent-soft/50 p-4">
          <h4 className="text-sm font-semibold text-accent-dark">Improved interview-ready answer</h4>
          <p className="mt-1 text-sm text-ink whitespace-pre-wrap">{improved}</p>
        </section>
      )}
      {followUp && (
        <section>
          <h4 className="text-sm font-semibold text-ink">Follow-up question</h4>
          <p className="mt-1 text-sm text-ink-muted">{followUp}</p>
        </section>
      )}
      {topic && (
        <p className="text-sm text-ink-muted">
          Recommended topic to revise: <strong className="text-ink">{topic}</strong>
        </p>
      )}
    </div>
  );
}
