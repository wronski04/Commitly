import { useAuth } from "../hooks/useAuth";

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Commitly</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{user?.email}</span>
          <button
            onClick={logout}
            className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-10">
        <p className="text-gray-500">Your projects will appear here.</p>
      </main>
    </div>
  );
}
