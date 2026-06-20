import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/error";
import * as projectsApi from "../api/projects";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { Layout } from "../components/Layout";
import type { Project } from "../types";

export function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    projectsApi
      .listProjects()
      .then(setProjects)
      .catch((err) => setError(getErrorMessage(err, "Could not load projects")))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setShowModal(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this project and all its changelogs?")) return;
    await projectsApi.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Layout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Projects / {projects.length}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            Your projects
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-git px-4 py-2 text-sm font-medium text-white transition hover:bg-git-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-git/50"
        >
          + New project
        </button>
      </div>

      {loading && <p className="font-mono text-sm text-muted">Loading…</p>}
      {error && <p className="text-sm text-remove">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg text-ink">No projects yet</p>
          <p className="mt-1 text-sm text-muted">
            Create your first project to start generating changelogs.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="group cursor-pointer rounded-lg border border-line bg-surface p-5 transition hover:border-git/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display font-semibold text-ink">
                {project.name}
              </h2>
              <button
                onClick={(e) => handleDelete(e, project.id)}
                className="font-mono text-sm text-muted opacity-0 transition hover:text-remove group-hover:opacity-100"
                title="Delete project"
              >
                ✕
              </button>
            </div>
            {project.description && (
              <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                {project.description}
              </p>
            )}
            <p className="mt-4 font-mono text-xs text-muted">
              {new Date(project.created_at).toISOString().slice(0, 10)}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </Layout>
  );
}
