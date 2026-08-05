import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/interview/new', label: 'New interview' },
  { to: '/history', label: 'History' },
  { to: '/study-plan', label: 'Study plan' },
  { to: '/profile', label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-24 space-y-1 rounded-2xl border border-border bg-card p-3 shadow-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-ink-muted hover:bg-surface hover:text-ink'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              isActive ? 'bg-accent text-white' : 'bg-white text-ink-muted border border-border'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
