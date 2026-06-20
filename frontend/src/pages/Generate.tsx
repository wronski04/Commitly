import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../api/error";
import * as changelogsApi from "../api/changelogs";
import { ChangelogEditor } from "../components/ChangelogEditor";
import { Layout } from "../components/Layout";
import { downloadMarkdown } from "../lib/download";
import type { Changelog, Tone } from "../types";

export function Generate() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rawInput, setRawInput] = useState("");
  const [tone, setTone] = useState<Tone>("technical");
  const [versionTag, setVersionTag] = useState("");

  const [current, setCurrent] = useState<Changelog | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!projectId || !rawInput.trim()) return;
    setError(null);
    setGenerating(true);
    try {
      if (current) {
        await changelogsApi.deleteChangelog(current.id);
      }
      const changelog = await changelogsApi.generateChangelog(
        projectId,
        rawInput,
        tone,
        versionTag.trim() || null,
      );
      setCurrent(changelog);
      setTitle(changelog.title);
      setContent(changelog.content);
    } catch (err) {
      setError(getErrorMessage(err, "Generation failed, please try again"));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!current || !projectId) return;
    setError(null);
    setSaving(true);
    try {
      await changelogsApi.updateChangelog(current.id, title, content);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not save changelog"));
      setSaving(false);
    }
  };

  const inputClass =
    "rounded-md border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-git focus-visible:ring-2 focus-visible:ring-git/30";

  return (
    <Layout>
      <button
        onClick={() => navigate(`/projects/${projectId}`)}
        className="mb-4 font-mono text-xs text-muted transition hover:text-ink"
      >
        ← project
      </button>
      <h1 className="mb-1 font-display text-3xl font-semibold tracking-tight text-ink">
        Generate changelog
      </h1>
      <p className="mb-6 text-sm text-muted">
        Paste a git log or diff and pick a tone.
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-remove/30 bg-remove/10 px-3 py-2 text-sm text-remove">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-muted">
            Commits or diff
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={8}
            placeholder="feat: add login&#10;fix: handle expired token&#10;…"
            className={`${inputClass} w-full resize-y bg-paper font-mono text-sm`}
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-wide text-muted">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className={inputClass}
            >
              <option value="technical">Technical</option>
              <option value="user_friendly">User-friendly</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-wide text-muted">
              Version
            </label>
            <input
              type="text"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              placeholder="v1.0.0"
              className={`${inputClass} w-32 font-mono`}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !rawInput.trim()}
            className="ml-auto rounded-md bg-git px-5 py-2 font-medium text-white transition hover:bg-git-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-git/50"
          >
            {generating ? "Generating…" : current ? "Regenerate" : "Generate"}
          </button>
        </div>
      </div>

      {current && (
        <div className="mt-6">
          <ChangelogEditor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            actions={
              <>
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
                  {saving ? "Saving…" : "Save to project"}
                </button>
              </>
            }
          />
        </div>
      )}
    </Layout>
  );
}
