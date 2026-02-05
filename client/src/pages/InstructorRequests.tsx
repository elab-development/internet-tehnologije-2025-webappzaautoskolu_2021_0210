import { useEffect, useState } from "react";
import {
  approveLessonRequest,
  getInstructorLessonRequests,
  rejectLessonRequest,
  type LessonRequest,
} from "../api/lessonRequests";

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("sr-RS");
}

export default function InstructorRequests() {
  const [items, setItems] = useState<LessonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await getInstructorLessonRequests();
      setItems(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e?.message ?? "Greška prilikom učitavanja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onApprove = async (id: string) => {
    const title = prompt("Unesi naziv časa (npr. Kružni tok):");
    if (!title) return;

    setBusyId(id);
    try {
      await approveLessonRequest(id, title);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Neuspešno odobravanje.");
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (id: string) => {
    const reason = prompt("Razlog odbijanja:");
    if (!reason) return;

    setBusyId(id);
    try {
      await rejectLessonRequest(id, reason);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Neuspešno odbijanje.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Zahtevi za časove</h1>
        <button
          onClick={load}
          className="bg-slate-800 border border-slate-700 px-3 py-2 rounded hover:bg-slate-700"
        >
          Osveži
        </button>
      </div>

      {loading && <p className="text-slate-300">Učitavanje...</p>}
      {err && (
        <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">
          {err}
        </div>
      )}

      {!loading && !err && (
        <div className="grid gap-3">
          {items.map((r) => (
            <div key={r._id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{formatDT(r.requestedDate)}</div>
                <div className="text-sm text-slate-300">Trajanje: {r.duration} min</div>
              </div>

              <div className="text-slate-300 text-sm mt-2">
                Kandidat:{" "}
                <span className="text-white">
                  {r.candidate?.user?.name ?? "Nepoznato"} ({r.candidate?.user?.email ?? ""})
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  disabled={busyId === r._id}
                  onClick={() => onApprove(r._id)}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-60 px-3 py-2 rounded"
                >
                  Odobri
                </button>

                <button
                  disabled={busyId === r._id}
                  onClick={() => onReject(r._id)}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-60 px-3 py-2 rounded"
                >
                  Odbij
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-slate-400">Nema zahteva na čekanju.</div>
          )}
        </div>
      )}
    </div>
  );
}
