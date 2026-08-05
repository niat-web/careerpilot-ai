import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', hint: 'Overview' },
  { to: '/interview/new', label: 'New interview', hint: 'Practice' },
  { to: '/history', label: 'History', hint: 'Past sessions' },
  { to: '/study-plan', label: 'Study plan', hint: '7-day plan' },
  { to: '/profile', label: 'Profile', hint: 'Settings' },
];

export function Sidebar() {
  const { profile, signOut } = useAuth();

  return (
    <aside className="hidden h-full min-h-screen flex-col border-r border-border bg-ink text-white md:flex animate-slide-in">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            CP
          </span>
          <span className="font-display text-lg tracking-tight text-white">CareerPilot AI</span>
        </Link>
      </div>

      <div className="px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Workspace</p>
        <p className="mt-2 truncate text-sm font-medium text-white">
          {profile?.full_name || 'Student'}
        </p>
        <p className="truncate text-xs text-white/50">
          {profile?.target_role || 'Complete your profile'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 pb-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-3 transition ${
                isActive ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="block text-sm font-semibold">{link.label}</span>
            <span className="block text-xs opacity-70">{link.hint}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => void signOut()}
          className="w-full rounded-xl border border-white/15 px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `shrink-0 rounded-xl px-3 py-2 text-xs font-semibold ${
              isActive ? 'bg-accent text-white' : 'border border-border bg-card text-ink-muted'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
