const LABELS: Record<string, string> = {
  waiting: 'Waiting',
  generating_question: 'Generating question…',
  question_ready: 'Question ready',
  evaluating_answer: 'Evaluating answer…',
  generating_feedback: 'Generating feedback…',
  saving_result: 'Saving result…',
  completed: 'Completed',
  failed: 'Failed',
};

type Props = {
  status?: string | null;
};

export function ProcessingStatusBadge({ status }: Props) {
  if (!status) return null;
  const busy = ['generating_question', 'evaluating_answer', 'generating_feedback', 'saving_result'].includes(
    status
  );
  const failed = status === 'failed';
  const done = status === 'completed' || status === 'question_ready';

  const color = failed
    ? 'bg-red-100 text-red-800'
    : done
      ? 'bg-accent-soft text-accent-dark'
      : busy
        ? 'bg-amber-100 text-amber-900'
        : 'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${color} ${
        busy ? 'animate-pulse-soft' : ''
      }`}
    >
      {busy && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {LABELS[status] || status}
    </span>
  );
}
