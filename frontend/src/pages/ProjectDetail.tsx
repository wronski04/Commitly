import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/error";
import * as changelogsApi from "../api/changelogs";
import * as projectsApi from "../api/projects";
import { Layout } from "../components/Layout";
import type { Changelog, Project } from "../types";

const TONE_LABELS: Record<string, string> = {
  technical: "Technical",
  user_friendly: "User-friendly",
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      projectsApi.getProject(id),
      changelogsApi.listChangelogs(id),
    ])
      .then(([p, c]) => {
        setProject(p);
        setChangelogs(c);
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load project")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="font-mono text-sm text-muted">Loading…</p>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <p className="text-sm text-remove">{error ?? "Project not found"}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        onClick={() => navigate("/")}
        className="mb-4 font-mono text-xs text-muted transition hover:text-ink"
      >
        ← projects
      </button>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-1.5 max-w-xl text-muted">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/projects/${project.id}/generate`)}
          className="shrink-0 rounded-md bg-git px-4 py-2 text-sm font-medium text-white transition hover:bg-git-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-git/50"
        >
          + Generate
        </button>
      </div>

      <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted">
        Changelogs / {changelogs.length}
      </p>

      {changelogs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg text-ink">No changelogs yet</p>
          <p className="mt-1 text-sm text-muted">
            Generate your first one from a git log or diff.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line">
              <tr className="font-mono text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-2.5 font-medium">Title</th>
                <th className="px-4 py-2.5 font-medium">Tone</th>
                <th className="px-4 py-2.5 font-medium">Version</th>
                <th className="px-4 py-2.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {changelogs.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/changelogs/${c.id}`)}
                  className="cursor-pointer border-b border-line transition last:border-0 hover:bg-paper"
                >
                  <td className="px-4 py-3 font-medium text-ink">{c.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            c.tone === "technical"
                              ? "var(--git)"
                              : "var(--add)",
                        }}
                      />
                      {TONE_LABELS[c.tone] ?? c.tone}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.version_tag ? (
                      <span className="rounded border border-line px-1.5 py-0.5 font-mono text-xs text-ink">
                        {c.version_tag}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {new Date(c.created_at).toISOString().slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
