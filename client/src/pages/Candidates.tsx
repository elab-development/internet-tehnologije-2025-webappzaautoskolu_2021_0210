import { useEffect, useMemo, useState } from "react";
import { getCandidates, deleteCandidate } from "../api/candidates";
import type { Candidate } from "../types/models";

export default function Candidates() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCandidates();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((c) => {
      const name = c.user?.name?.toLowerCase() ?? "";
      const email = c.user?.email?.toLowerCase() ?? "";
      return name.includes(q) || email.includes(q);
    });
  }, [items, query]);

  const onDelete = async (id: string) => {
    const ok = confirm("Da li si sigurna da želiš da obrišeš kandidata?");
    if (!ok) return;

    try {
      await deleteCandidate(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? err?.message ?? "Delete failed");
    }
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Candidates</h1>

        <button
          onClick={load}
          className="bg-slate-800 border border-slate-700 px-3 py-2 rounded hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500"
            placeholder="Search by name/email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && <p className="text-slate-300">Loading...</p>}

        {error && (
          <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-300">
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Total lessons</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className="border-b border-slate-800">
                    <td className="py-2">{c.user?.name ?? "-"}</td>
                    <td className="py-2 text-slate-300">{c.user?.email ?? "-"}</td>
                    <td className="py-2">{c.totalLessons}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onDelete(c._id)}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td className="py-3 text-slate-400" colSpan={4}>
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

