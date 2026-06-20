import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as projectsApi from "../api/projects";
import { useAuth } from "../hooks/useAuth";
import type { Project } from "../types";
import { CreateProjectModal } from "./CreateProjectModal";
import { ThemeToggle } from "./ThemeToggle";

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    projectsApi
      .listProjects()
      .then(setProjects)
      .catch(() => {});
  }, []);

  const handleCreated = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setShowModal(false);
    navigate(`/projects/${project.id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project and all its changelogs?")) return;
    await projectsApi.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeId === id) navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="flex h-14 items-center justify-between px-6">
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

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="shrink-0 border-b border-line bg-surface p-4 md:w-64 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wide text-muted">
              Projects
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="font-mono text-xs text-git transition hover:text-git-hover"
            >
              + new
            </button>
          </div>

          <nav className="space-y-0.5">
            {projects.map((p) => {
              const active = p.id === activeId;
              return (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-paper"
                >
                  <span
                    className={`w-2 shrink-0 font-mono ${active ? "text-git" : "text-transparent"}`}
                  >
                    *
                  </span>
                  <span
                    className={`flex-1 truncate ${active ? "font-medium text-ink" : "text-muted group-hover:text-ink"}`}
                  >
                    {p.name}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, p.id)}
                    className="font-mono text-xs text-muted opacity-0 transition hover:text-remove group-hover:opacity-100"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </Link>
              );
            })}
            {projects.length === 0 && (
              <p className="px-3 py-2 font-mono text-xs text-muted">
                no projects yet
              </p>
            )}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
