import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            CP
          </span>
          <span className="font-display text-lg font-semibold text-ink">CareerPilot AI</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `hidden text-sm font-medium sm:inline ${isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'}`
                }
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-muted hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-dark"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
