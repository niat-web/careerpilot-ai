import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="surface-panel border-dashed px-6 py-14 text-center animate-fade-up">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
