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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New project
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="text-gray-500">
          No projects yet. Create your first one to get started.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-gray-900">{project.name}</h2>
              <button
                onClick={(e) => handleDelete(e, project.id)}
                className="text-sm text-gray-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                title="Delete project"
              >
                ✕
              </button>
            </div>
            {project.description && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {project.description}
              </p>
            )}
            <p className="mt-3 text-xs text-gray-400">
              {new Date(project.created_at).toLocaleDateString()}
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
