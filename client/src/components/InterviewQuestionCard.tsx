import type { InterviewQuestion } from '../types';

type Props = {
  question: InterviewQuestion;
  current: number;
  total: number;
};

export function InterviewQuestionCard({ question, current, total }: Props) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-fade-up">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent-dark">
          Question {current} of {total}
        </span>
        <span className="rounded-full bg-surface px-2.5 py-1">{question.topic}</span>
        <span className="rounded-full bg-surface px-2.5 py-1">{question.difficulty}</span>
        {question.skill_tested && (
          <span className="rounded-full bg-surface px-2.5 py-1">{question.skill_tested}</span>
        )}
      </div>
      <h2 className="font-display text-2xl leading-snug text-ink">{question.question}</h2>
      <p className="mt-4 text-sm text-ink-muted">
        Take 2–5 minutes. Explain your thinking clearly — like you would in a real interview.
      </p>
    </article>
  );
}
