import type { InterviewSession } from '../types';
import { Link } from 'react-router-dom';

type Props = {
  interviews: InterviewSession[];
};

export function InterviewHistoryTable({ interviews }: Props) {
  if (!interviews.length) return null;

  return (
    <div className="surface-panel overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-2/80 text-xs uppercase tracking-[0.12em] text-ink-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Topic</th>
            <th className="px-4 py-3 font-semibold">Difficulty</th>
            <th className="px-4 py-3 font-semibold">Score</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {interviews.map((row) => (
            <tr key={row.id} className="border-b border-border/70 last:border-0 hover:bg-surface-2/60">
              <td className="px-4 py-3 font-medium text-ink">{row.target_role}</td>
              <td className="px-4 py-3 text-ink-muted">{row.topic}</td>
              <td className="px-4 py-3 text-ink-muted">{row.difficulty}</td>
              <td className="px-4 py-3 text-ink">
                {row.overall_score != null ? Number(row.overall_score).toFixed(0) : '—'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`chip ${
                    row.status === 'completed'
                      ? 'border-transparent bg-success-soft text-success'
                      : 'border-transparent bg-warm-soft text-warm'
                  }`}
                >
                  {row.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {row.started_at ? new Date(row.started_at).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={
                    row.status === 'completed'
                      ? `/interview/${row.id}/result`
                      : `/interview/${row.id}`
                  }
                  className="font-semibold text-accent hover:underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
