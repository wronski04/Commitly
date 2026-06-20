import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../api/error";
import { ThemeToggle } from "./ThemeToggle";

interface AuthFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  footer: { text: string; linkText: string; to: string };
}

export function AuthForm({
  title,
  submitLabel,
  onSubmit,
  footer,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Thesis panel: git log → release notes */}
      <aside className="hidden w-1/2 flex-col justify-between border-r border-line bg-surface p-12 lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-git font-mono text-sm font-bold text-white">
            ›
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            commitly
          </span>
        </div>

        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink">
            Turn commits into
            <br />
            release notes.
          </h1>
          <p className="mt-4 max-w-sm text-muted">
            Paste your git log, pick a tone, and ship a clean changelog in
            seconds.
          </p>

          <div className="mt-10 overflow-hidden rounded-lg border border-line">
            <div className="border-b border-line bg-paper px-4 py-2 font-mono text-xs text-muted">
              git log → CHANGELOG.md
            </div>
            <pre className="overflow-x-auto bg-surface px-4 py-4 font-mono text-xs leading-relaxed">
              <span className="text-muted">$ </span>feat: add JWT auth{"\n"}
              <span className="text-muted">$ </span>feat: projects CRUD{"\n"}
              <span className="text-muted">$ </span>fix: logout crash{"\n"}
              <span className="text-muted">{"\n"}# v1.0.0{"\n"}</span>
              <span className="text-add">+ Added </span>JWT authentication{"\n"}
              <span className="text-add">+ Added </span>Projects CRUD{"\n"}
              <span className="text-git">~ Fixed </span>Logout crash{"\n"}
            </pre>
          </div>
        </div>

        <p className="font-mono text-xs text-muted">
          built with FastAPI · React · Groq
        </p>
      </aside>

      {/* Form panel */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {title}
          </h2>
          <p className="mt-1 mb-6 text-sm text-muted">
            Welcome — let's get you a changelog.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-remove/30 bg-remove/10 px-3 py-2 text-sm text-remove">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wide text-muted">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-git focus-visible:ring-2 focus-visible:ring-git/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wide text-muted">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-git focus-visible:ring-2 focus-visible:ring-git/30"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-git py-2.5 font-medium text-white transition hover:bg-git-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-git/50"
            >
              {submitting ? "Please wait…" : submitLabel}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            {footer.text}{" "}
            <Link
              to={footer.to}
              className="font-medium text-git hover:underline"
            >
              {footer.linkText}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
