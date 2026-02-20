import { useState } from "react";
import { createLessonRequest } from "../api/lessonRequests";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
      await createLessonRequest({
        requestedDate: new Date(requestedDate).toISOString(),
        duration,
      });
      setMsg("Zahtev je poslat instruktoru. Sačekajte potvrdu.");
      setRequestedDate("");
      setDuration(60);
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ??
          e?.message ??
          "Greška prilikom slanja zahteva."
      );
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

      <Card title="Pošalji zahtev">
        <form onSubmit={onSubmit} className="space-y-3">
          {/* Input komponenta trenutno ne podržava datetime-local i number idealno,
              pa joj prosleđujemo type string i vrednost kao string */}
          <Input
            label="Predlog termina"
            type="datetime-local"
            value={requestedDate}
            onChange={setRequestedDate}
          />

          <Input
            label="Trajanje (min)"
            type="number"
            value={String(duration)}
            onChange={(v) => setDuration(Number(v))}
            placeholder="npr. 60"
          />

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

          <div className="pt-1">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? "Šaljem..." : "Pošalji zahtev"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}