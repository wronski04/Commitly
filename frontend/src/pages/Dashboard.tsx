import { WorkspaceLayout } from "../components/WorkspaceLayout";

export function Dashboard() {
  return (
    <WorkspaceLayout>
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-git font-mono text-xl font-bold text-white">
          ›
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
          Pick a project to start
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Select a project from the left, or create a new one to generate your
          first changelog from a git log.
        </p>
      </div>
    </WorkspaceLayout>
  );
}
