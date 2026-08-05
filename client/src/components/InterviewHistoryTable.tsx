import type { InterviewSession } from '../types';
import { Link } from 'react-router-dom';

type Props = {
  interviews: InterviewSession[];
};

export function InterviewHistoryTable({ interviews }: Props) {
  if (!interviews.length) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface/80 text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Topic</th>
            <th className="px-4 py-3 font-medium">Difficulty</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {interviews.map((row) => (
            <tr key={row.id} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-3">{row.target_role}</td>
              <td className="px-4 py-3">{row.topic}</td>
              <td className="px-4 py-3">{row.difficulty}</td>
              <td className="px-4 py-3">
                {row.overall_score != null ? Number(row.overall_score).toFixed(0) : '—'}
              </td>
              <td className="px-4 py-3 capitalize">{row.status.replace('_', ' ')}</td>
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
                  className="font-medium text-accent hover:underline"
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
