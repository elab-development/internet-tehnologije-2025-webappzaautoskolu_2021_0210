import { useEffect, useMemo, useState } from "react";
import { getInstructors, deleteInstructor } from "../api/instructors";
import type { Instructor } from "../types/models";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Instructors() {
  const [items, setItems] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInstructors();
      setItems(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Ne mogu da učitam listu instruktora."
      );
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

    return items.filter((i) => {
      const name = i.user?.name?.toLowerCase() ?? "";
      const email = i.user?.email?.toLowerCase() ?? "";
      return name.includes(q) || email.includes(q);
    });
  }, [items, query]);

  const onDelete = async (id: string) => {
    const ok = confirm("Da li si siguran/na da želiš da obrišeš instruktora?");
    if (!ok) return;

    try {
      await deleteInstructor(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (err: any) {
      alert(
        err?.response?.data?.message ?? err?.message ?? "Brisanje nije uspelo."
      );
    }
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Instruktori</h1>

        <Button variant="secondary" onClick={load} disabled={loading}>
          Osveži
        </Button>
      </div>

      <Card title="Lista instruktora">
        <div className="space-y-3">
          <Input
            label="Pretraga"
            placeholder="Pretraga po imenu/email-u..."
            value={query}
            onChange={setQuery}
          />

          {loading && <p className="text-slate-300">Učitavanje...</p>}

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">
              Greška: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Ime</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-right py-2">Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((i) => (
                    <tr key={i._id} className="border-b border-slate-800">
                      <td className="py-2">{i.user?.name ?? "-"}</td>
                      <td className="py-2 text-slate-300">{i.user?.email ?? "-"}</td>
                      <td className="py-2 text-right">
                        <Button variant="danger" onClick={() => onDelete(i._id)}>
                          Obriši
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td className="py-3 text-slate-400" colSpan={3}>
                        Nema instruktora za prikaz.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}