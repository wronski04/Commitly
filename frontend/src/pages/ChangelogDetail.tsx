import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/error";
import * as changelogsApi from "../api/changelogs";
import { ChangelogEditor } from "../components/ChangelogEditor";
import { Layout } from "../components/Layout";
import { downloadMarkdown } from "../lib/download";

export function ChangelogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    changelogsApi
      .getChangelog(id)
      .then((c) => {
        setProjectId(c.project_id);
        setTitle(c.title);
        setContent(c.content);
      })
      .catch((err) =>
        setError(getErrorMessage(err, "Could not load changelog")),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setError(null);
    setSaving(true);
    try {
      await changelogsApi.updateChangelog(id, title, content);
      if (projectId) navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not save changelog"));
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this changelog?")) return;
    await changelogsApi.deleteChangelog(id);
    if (projectId) navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <Layout>
        <p className="font-mono text-sm text-muted">Loading…</p>
      </Layout>
    );
  }

  if (error && !title) {
    return (
      <Layout>
        <p className="text-sm text-remove">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        onClick={() => projectId && navigate(`/projects/${projectId}`)}
        className="mb-4 font-mono text-xs text-muted transition hover:text-ink"
      >
        ← project
      </button>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight text-ink">
        Changelog
      </h1>

      {error && (
        <div className="mb-4 rounded-md border border-remove/30 bg-remove/10 px-3 py-2 text-sm text-remove">
          {error}
        </div>
      )}

      <ChangelogEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        actions={
          <>
            <button
              onClick={handleDelete}
              className="mr-auto rounded-md border border-remove/40 px-4 py-2 text-sm text-remove transition hover:bg-remove/10"
            >
              Delete
            </button>
            <button
              onClick={() => downloadMarkdown(title || "changelog", content)}
              className="rounded-md border border-line px-4 py-2 text-sm text-muted transition hover:text-ink"
            >
              Export .md
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-git px-4 py-2 text-sm font-medium text-white transition hover:bg-git-hover disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      />
    </Layout>
  );
}
