import { useState } from "react";
import { createLessonRequest } from "../api/lessonRequests";

export default function Booking() {
  const [requestedDate, setRequestedDate] = useState("");
  const [duration, setDuration] = useState(60);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    setLoading(true);
    try {
      // backend očekuje ISO Date string
      await createLessonRequest({
        requestedDate: new Date(requestedDate).toISOString(),
        duration,
      });
      setMsg("Zahtev je poslat instruktoru. Sačekajte potvrdu.");
      setRequestedDate("");
      setDuration(60);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e?.message ?? "Greška prilikom slanja zahteva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Zakazivanje vožnje</h1>
        <p className="text-slate-300">
          Kandidat šalje zahtev, instruktor potvrđuje i dodeljuje naziv časa.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Predlog termina</label>
          <input
            type="datetime-local"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Trajanje (min)</label>
          <input
            type="number"
            min={30}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500"
          />
        </div>

        {err && (
          <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">
            {err}
          </div>
        )}
        {msg && (
          <div className="text-sm text-green-300 bg-green-950/30 border border-green-900/60 rounded p-2">
            {msg}
          </div>
        )}

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-2 rounded font-semibold"
        >
          {loading ? "Šaljem..." : "Pošalji zahtev"}
        </button>
      </form>
    </div>
  );
}
