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
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Markdown</label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="h-[28rem] w-full resize-y rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Preview</label>
          <div className="prose prose-sm h-[28rem] max-w-none overflow-auto rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">{actions}</div>
    </div>
  );
}
