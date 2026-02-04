import { Link } from "react-router-dom";

export default function CandidateHome() {
  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Dobrodošli 👋</h1>
        <p className="text-slate-300">
          Ovde možete pratiti napredak obuke i brzo pristupiti najvažnijim akcijama.
        </p>
      </div>

      {/* STATISTIKA */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Ukupno časova" value="32" />
        <StatCard title="Završeno" value="18" />
        <StatCard title="Preostalo" value="14" />
        <StatCard title="Položeni testovi" value="3 / 5" />
      </div>

      {/* SLEDEĆI ČAS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-2">Sledeći čas vožnje</h2>

        <div className="text-slate-300">
          📅 12. mart 2026 • 16:00h <br />
          👨‍🏫 Instruktor: Marko Petrović
        </div>

        <Link
          to="/moji-casovi"
          className="inline-block mt-4 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          Pogledaj sve časove
        </Link>
      </div>

      {/* BRZE AKCIJE */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Brze akcije</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <ActionButton to="/zakazivanje-voznje" text="➕ Zakaži čas vožnje" />
          <ActionButton to="/testovi" text="📝 Polaži test" />
          <ActionButton to="/moji-rezultati" text="📊 Rezultati testova" />
        </div>
      </div>
    </div>
  );
}

/* ---------- reusable male komponente ---------- */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function ActionButton({ to, text }: { to: string; text: string }) {
  return (
    <Link
      to={to}
      className="block text-center bg-slate-800 border border-slate-700 rounded-xl p-4 hover:bg-slate-700"
    >
      {text}
    </Link>
  );
}
