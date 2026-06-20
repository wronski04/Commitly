import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface ChangelogEditorProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  actions: ReactNode;
}

export function ChangelogEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  actions,
}: ChangelogEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="font-mono text-xs uppercase tracking-wide text-muted">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 font-medium text-ink outline-none transition focus:border-git focus-visible:ring-2 focus-visible:ring-git/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-muted">
            Markdown
          </label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="h-[28rem] w-full resize-y rounded-md border border-line bg-surface px-3 py-2 font-mono text-sm text-ink outline-none transition focus:border-git focus-visible:ring-2 focus-visible:ring-git/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-muted">
            Preview
          </label>
          <div className="prose prose-sm h-[28rem] max-w-none overflow-auto rounded-md border border-line bg-paper px-4 py-3 dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">{actions}</div>
    </div>
  );
}
