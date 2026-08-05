type Props = {
  title: string;
  value: string | number;
  hint?: string;
};

export function DashboardCard({ title, value, hint }: Props) {
  return (
    <div className="surface-panel p-5 animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{title}</p>
      <p className="mt-3 font-display text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}
