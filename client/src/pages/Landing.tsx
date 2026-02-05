import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="font-bold tracking-wide text-lg">SmartDrive</div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-semibold"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/40 text-slate-200 text-sm">
              🚗 Moderna auto-škola • Online aplikacija
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              AUTO ŠKOLA <span className="text-blue-400">SmartDrive</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed">
              Organizuj obuku na jednom mestu: časovi vožnje, zakazivanja, testovi i
              rezultati. Instruktori potvrđuju termine, a ti pratiš napredak bez haosa i
              papira.
            </p>

            <div className="grid gap-3 text-slate-200">
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <span>Brzo zakazivanje vožnje (zahtev → potvrda instruktora)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <span>Pregled časova i istorije obuke</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <span>Teorijska priprema + evidencija rezultata</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/signup"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
              >
                Napravi nalog
              </Link>

              <Link
                to="/login"
                className="px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
              >
                Već imam nalog
              </Link>
            </div>

            <div className="text-xs text-slate-500">
              * Nakon prijave se prikazuje panel po ulozi (kandidat/instruktor/admin).
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="absolute -inset-6 bg-blue-600/10 blur-2xl rounded-full" />

            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="relative">
                <img
                  src={hero}
                  alt="Auto škola SmartDrive"
                  className="w-full h-[420px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/40" />
              </div>

              <div className="p-4 border-t border-slate-800">
                <div className="text-sm text-slate-300">
                  „Pametna obuka. Sigurna vožnja. Brže do dozvole.“
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  SmartDrive • Moderna digitalna auto-škola
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small section below */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-blue-400 font-semibold">Plan obuke</div>
            <div className="text-slate-300 text-sm mt-2">
              Jasno definisani koraci: teorija → vožnja → polaganje.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-blue-400 font-semibold">Podrška instruktora</div>
            <div className="text-slate-300 text-sm mt-2">
              Termini se potvrđuju od strane instruktora — bez duplih rezervacija.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-blue-400 font-semibold">Napredak i rezultati</div>
            <div className="text-slate-300 text-sm mt-2">
              Sve na jednom mestu: časovi, zahtevi, testovi, rezultati.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
