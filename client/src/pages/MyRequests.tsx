import { useEffect, useState } from "react";
import { getMyLessonRequests, type LessonRequest } from "../api/lessonRequests";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("sr-RS");
}

export default function MyRequests() {
  const [items, setItems] = useState<LessonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await getMyLessonRequests();
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

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Moji zahtevi</h1>

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
                <span className="text-sm text-slate-300">
                  Status:{" "}
                  {r.status === "pending"
                    ? "Na čekanju"
                    : r.status === "approved"
                    ? "Odobreno"
                    : "Odbijeno"}
                </span>
              </div>

              <div className="text-slate-300 text-sm mt-2">Trajanje: {r.duration} min</div>

              {r.status === "approved" && r.instructorTitle && (
                <div className="mt-2 text-green-300 text-sm">
                  Naziv časa (instruktor): <span className="text-white">{r.instructorTitle}</span>
                </div>
              )}

              {r.status === "rejected" && r.rejectionReason && (
                <div className="mt-2 text-red-300 text-sm">
                  Razlog odbijanja: <span className="text-white">{r.rejectionReason}</span>
                </div>
              )}
            </Card>
          ))}

          {items.length === 0 && <div className="text-slate-400">Nema zahteva.</div>}
        </div>
      )}
    </div>
  );
}