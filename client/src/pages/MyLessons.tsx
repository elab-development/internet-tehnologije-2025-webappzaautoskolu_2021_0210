import { useEffect, useMemo, useState } from "react";
import { getLessons, type Lesson } from "../api/lessons";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function formatDatum(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("sr-RS");
}

export default function MyLessons() {
  const [items, setItems] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

  const [status, setStatus] = useState<"svi" | Lesson["status"]>("svi");
  const [pretraga, setPretraga] = useState("");

  const ucitaj = async () => {
    setLoading(true);
    setGreska(null);
    try {
      const data = await getLessons();
      setItems(data);
    } catch (e: any) {
      setGreska(e?.response?.data?.message ?? e?.message ?? "Ne mogu da učitam časove.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ucitaj();
  }, []);

  const filtrirano = useMemo(() => {
    let list = items;

    if (status !== "svi") {
      list = list.filter((l) => l.status === status);
    }

    const q = pretraga.trim().toLowerCase();
    if (q) {
      list = list.filter((l) => formatDatum(l.date).toLowerCase().includes(q));
    }

    return list;
  }, [items, status, pretraga]);

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Moji časovi</h1>
          <p className="text-slate-300">Pregled zakazanih i prethodnih časova vožnje.</p>
        </div>
        <Button variant="secondary" onClick={ucitaj}>
          Osveži
        </Button>
      </div>

      <Card>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Status</label>
            <select
              className="w-full rounded bg-slate-900 border border-slate-700 p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="svi">Svi</option>
              <option value="scheduled">Zakazani</option>
              <option value="completed">Završeni</option>
              <option value="cancelled">Otkazani</option>
            </select>
          </div>

          <Input
            label="Pretraga (datum/vreme)"
            value={pretraga}
            onChange={setPretraga}
            placeholder="npr. 12.3.2026"
          />

          <div className="flex items-end">
            <div className="text-slate-300 text-sm">
              Prikazano: <span className="font-semibold text-white">{filtrirano.length}</span>
            </div>
          </div>
        </div>
      </Card>

      {loading && <p className="text-slate-300">Učitavanje...</p>}

      {greska && (
        <Card title="Greška">
          <p className="text-red-400">{greska}</p>
        </Card>
      )}

      {!loading && !greska && (
        <Card title="Lista časova">
          {filtrirano.length === 0 ? (
            <p className="text-slate-300">Nema časova za prikaz.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Datum</th>
                    <th className="text-left py-2">Trajanje</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrirano.map((l) => (
                    <tr key={l._id} className="border-b border-slate-800">
                      <td className="py-2">{formatDatum(l.date)}</td>
                      <td className="py-2">{l.duration} min</td>
                      <td className="py-2">
                        {l.status === "scheduled" && "Zakazan"}
                        {l.status === "completed" && "Završen"}
                        {l.status === "cancelled" && "Otkazan"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
