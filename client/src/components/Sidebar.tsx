import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/interview/new', label: 'New interview' },
  { to: '/history', label: 'History' },
  { to: '/study-plan', label: 'Study plan' },
  { to: '/profile', label: 'Profile' },
];

export function Sidebar() {
  const { profile, signOut } = useAuth();

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-header">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
            CP
          </span>
          <span className="text-sm font-semibold text-white">CareerPilot</span>
        </Link>
        <p className="mt-3 truncate text-xs text-white/50">
          {profile?.full_name || 'Student'}
          {profile?.target_role ? ` · ${profile.target_role}` : ''}
        </p>
      </div>

      <div className="sidebar-body">
        <nav className="space-y-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={() => void signOut()}
          className="sidebar-nav-link w-full text-left"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="mb-4 flex gap-1.5 overflow-x-auto border-b border-border pb-3 md:hidden" aria-label="Mobile navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
              isActive ? 'bg-accent text-white' : 'bg-card text-ink-muted border border-border'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
