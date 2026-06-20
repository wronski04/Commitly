import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-git font-mono text-sm font-bold text-white">
              ›
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              commitly
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden font-mono text-xs text-muted sm:inline">
                {user.email}
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={logout}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-git"
            >
              log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
