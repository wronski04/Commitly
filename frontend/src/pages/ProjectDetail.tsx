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
        <p className="text-gray-500">Loading…</p>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <p className="text-red-600">{error ?? "Project not found"}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/")}
            className="mb-2 text-sm text-gray-500 hover:underline"
          >
            ← Back to projects
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-1 text-gray-600">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/projects/${project.id}/generate`)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Generate new
        </button>
      </div>

      <h2 className="mb-3 text-lg font-medium text-gray-900">Changelogs</h2>

      {changelogs.length === 0 ? (
        <p className="text-gray-500">
          No changelogs yet. Generate your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Tone</th>
                <th className="px-4 py-2 font-medium">Version</th>
                <th className="px-4 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {changelogs.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-2 text-gray-900">{c.title}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {TONE_LABELS[c.tone] ?? c.tone}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {c.version_tag ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
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
