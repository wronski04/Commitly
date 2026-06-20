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
      // Discard the previous auto-generated draft when regenerating.
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

  const handleExport = () => {
    downloadMarkdown(title || "changelog", content);
  };

  return (
    <Layout>
      <button
        onClick={() => navigate(`/projects/${projectId}`)}
        className="mb-2 text-sm text-gray-500 hover:underline"
      >
        ← Back to project
      </button>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Generate changelog
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Commits or diff
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={8}
            placeholder="Paste your git commits or diff here…"
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            >
              <option value="technical">Technical</option>
              <option value="user_friendly">User-friendly</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Version tag <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              placeholder="v1.0.0"
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !rawInput.trim()}
            className="ml-auto rounded-md bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating
              ? "Generating…"
              : current
                ? "Regenerate"
                : "Generate"}
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
                  onClick={handleExport}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Export .md
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
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
