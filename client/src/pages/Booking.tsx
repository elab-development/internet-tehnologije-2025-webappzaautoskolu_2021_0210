import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

type Slot = { id: string; label: string };

export default function Booking() {
  const [izabrani, setIzabrani] = useState<string | null>(null);

  const termini = useMemo<Slot[]>(() => {
    // Demo termini (dok ne povežemo backend)
    return [
      { id: "1", label: "Utorak 12.03.2026 • 16:00" },
      { id: "2", label: "Sreda 13.03.2026 • 10:00" },
      { id: "3", label: "Petak 15.03.2026 • 18:30" },
    ];
  }, []);

  const zakazi = () => {
    if (!izabrani) return alert("Molimo izaberite termin.");
    alert("Termin je izabran. Sledeći korak: kreiranje časa preko backend-a.");
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Zakazivanje vožnje</h1>
        <p className="text-slate-300">
          Izaberite jedan od dostupnih termina svog instruktora.
        </p>
      </div>

      <Card title="Dostupni termini">
        <div className="space-y-2">
          {termini.map((t) => (
            <label
              key={t.id}
              className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded p-3 cursor-pointer"
            >
              <input
                type="radio"
                name="slot"
                checked={izabrani === t.id}
                onChange={() => setIzabrani(t.id)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <Button onClick={zakazi}>Zakaži termin</Button>
        </div>
      </Card>
    </div>
  );
}
