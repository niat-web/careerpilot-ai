import type { InterviewQuestion } from '../types';

type Props = {
  question: InterviewQuestion;
  current: number;
  total: number;
};

export function InterviewQuestionCard({ question, current, total }: Props) {
  return (
    <article className="surface-panel p-6 animate-fade-up">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="chip border-transparent bg-accent-soft text-accent-dark">
          Question {current} of {total}
        </span>
        <span className="chip">{question.topic}</span>
        <span className="chip">{question.difficulty}</span>
        {question.skill_tested && <span className="chip">{question.skill_tested}</span>}
      </div>
      <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl">{question.question}</h2>
      <p className="mt-4 text-sm text-ink-muted">
        Take 2–5 minutes. Explain your thinking clearly — like you would in a real interview.
      </p>
    </article>
  );
}
