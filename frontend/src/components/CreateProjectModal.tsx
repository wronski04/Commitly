import { useState } from "react";
import type { FormEvent } from "react";
import { getErrorMessage } from "../api/error";
import * as projectsApi from "../api/projects";
import type { Project } from "../types";
import { Modal } from "./Modal";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export function CreateProjectModal({
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const project = await projectsApi.createProject(
        name,
        description.trim() || null,
      );
      onCreated(project);
    } catch (err) {
      setError(getErrorMessage(err, "Could not create project"));
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-line bg-paper px-3 py-2 text-ink outline-none transition focus:border-git focus-visible:ring-2 focus-visible:ring-git/30";

  return (
    <Modal title="New project" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-remove/30 bg-remove/10 px-3 py-2 text-sm text-remove">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-muted">
            Name
          </label>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-muted">
            Description <span className="lowercase text-muted/70">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-4 py-2 text-sm text-muted transition hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-git px-4 py-2 text-sm font-medium text-white transition hover:bg-git-hover disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
