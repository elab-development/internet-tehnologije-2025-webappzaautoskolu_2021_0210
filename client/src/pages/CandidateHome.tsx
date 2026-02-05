import { useMemo } from "react";
import InfoCard from "../components/ui/InfoCard";
import { useAuth } from "../context/AuthContext";

export default function CandidateHome() {
  const { user } = useAuth();

  const todayTip = useMemo(() => {
    const tips = [
      "Pre svake vožnje proveri ogledala i položaj sedišta – štedi greške na ispitu.",
      "Na raskrsnici: prvo posmatranje, pa signalizacija, pa manevrisanje.",
      "Kod kružnog toka: prati saobraćajne znakove i uključi pokazivač pravca na izlazu.",
      "Prva pomoć: zapamti redosled – bezbednost, procena, poziv, pomoć.",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }, []);

  return (
    <div className="p-6 text-white space-y-6">
      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dobrodošla, {user?.name ?? "kandidat"} 👋</h1>
            <p className="text-slate-300 mt-1">
              Ovde pratiš časove, zakazuješ vožnje i pripremaš se za polaganje.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3">
            <div className="text-xs text-slate-400">Tip dana</div>
            <div className="text-sm text-slate-200 mt-1">{todayTip}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Status</div>
          <div className="text-lg font-semibold mt-1">Aktivan kandidat</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Teorija</div>
          <div className="text-lg font-semibold mt-1">Priprema u toku</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Prva pomoć</div>
          <div className="text-lg font-semibold mt-1">Obuka preporučena</div>
        </div>
      </div>

      {/* CARDS */}
      <div>
        <h2 className="text-xl font-bold mb-3">Brzi pristup</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            title="Zakazivanje vožnje"
            badge="Kandidat → Instruktor"
            description="Pošalji zahtev za termin. Instruktor potvrđuje i dodeljuje naziv časa."
            to="/zakazivanje-voznje"
            imageUrl="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=60"
          />

          <InfoCard
            title="Moji zahtevi"
            badge="Status"
            description="Prati da li je zahtev na čekanju, odobren ili odbijen."
            to="/moji-zahtevi"
            imageUrl="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=60"
          />

          <InfoCard
            title="Moji časovi"
            badge="Vožnja"
            description="Pregled zakazanih i odrađenih časova. Naziv časa dodeljuje instruktor."
            to="/moji-casovi"
            imageUrl="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60"
          />
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="Teorijski ispit – preporuke"
          badge="Priprema"
          description="Uči znakove, prednost prolaza i pravila na raskrsnicama. Radi kratke testove svaki dan."
          to="/testovi"
          imageUrl="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=60"
        />

        <InfoCard
          title="Prva pomoć – šta je važno"
          badge="Obavezno"
          description="Nauči osnovne korake: bezbednost, procena stanja, poziv 194/112, reanimacija (osnove)."
          imageUrl="https://images.unsplash.com/photo-1582719478185-2f8b2f1b7b7a?auto=format&fit=crop&w=1200&q=60"
        />
      </div>
    </div>
  );
}
