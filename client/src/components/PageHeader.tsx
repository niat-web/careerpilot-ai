import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
};

export function PageHeader({ title, description, actions, eyebrow }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function BrandMark({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sm font-bold text-accent-soft">
        CP
      </span>
      {!compact && (
        <span className="font-display text-lg tracking-tight text-ink">CareerPilot AI</span>
      )}
    </Link>
  );
}
