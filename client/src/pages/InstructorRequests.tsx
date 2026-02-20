import { useEffect, useState } from "react";
import {
  approveLessonRequest,
  getInstructorLessonRequests,
  rejectLessonRequest,
  type LessonRequest,
} from "../api/lessonRequests";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

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

        <Button variant="secondary" onClick={load} disabled={loading}>
          Osveži
        </Button>
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
            <Card key={r._id} title={formatDT(r.requestedDate)}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">Trajanje: {r.duration} min</div>
              </div>

              <div className="text-slate-300 text-sm mt-2">
                Kandidat:{" "}
                <span className="text-white">
                  {r.candidate?.user?.name ?? "Nepoznato"} ({r.candidate?.user?.email ?? ""})
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  disabled={busyId === r._id}
                  onClick={() => onApprove(r._id)}
                  variant="primary"
                >
                  {busyId === r._id ? "Radim..." : "Odobri"}
                </Button>

                <Button
                  disabled={busyId === r._id}
                  onClick={() => onReject(r._id)}
                  variant="danger"
                >
                  Odbij
                </Button>
              </div>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="text-slate-400">Nema zahteva na čekanju.</div>
          )}
        </div>
      )}
    </div>
  );
}