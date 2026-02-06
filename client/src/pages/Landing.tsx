import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* TOP NAV */}
      <div className="w-full px-10 py-6 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide">
          AUTO ŠKOLA <span className="text-blue-500">SmartDrive</span>
        </h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition"
          >
            Sign up
          </Link>
        </div>
      </div>


      {/* HERO SECTION */}
      <div className="w-full grid md:grid-cols-2 items-center px-10 py-20 gap-16">

        {/* TEXT */}
        <div className="space-y-7">
          <h2 className="text-5xl font-extrabold leading-tight">
            Nauči da voziš <br />
            <span className="text-blue-400">pametno i bez stresa</span>
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            SmartDrive je moderna digitalna auto-škola koja ti omogućava da sve
            organizuješ online: časove vožnje, zahteve, napredak i rezultate.
            Bez papira. Bez haosa. Samo fokus na polaganje.
          </p>

          <div className="flex gap-4 pt-3">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500"
            >
              Započni obuku
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-slate-700 rounded-xl hover:bg-slate-800"
            >
              Prijava
            </Link>
          </div>
        </div>


        {/* IMAGE */}
        <div className="relative">
          <img
            src={hero}
            alt="Auto škola"
            className="rounded-2xl shadow-2xl w-full h-[520px] object-cover"
          />
        </div>
      </div>


      {/* INFO SECTION */}
<div className="w-full bg-slate-900/60 px-10 py-16">
  <div className="grid md:grid-cols-3 gap-8 text-slate-300">

    {/* CARD */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8
                    transition-all duration-300
                    hover:scale-105 hover:bg-slate-800 hover:shadow-xl cursor-pointer">

      <h3 className="text-blue-400 font-bold text-xl mb-3">
        Plan obuke
      </h3>

      <p>
        Struktuisan program: teorija, praktična vožnja i priprema za ispit.
        Sve aktivnosti jasno organizovane kroz aplikaciju.
      </p>
    </div>


    {/* CARD */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8
                    transition-all duration-300
                    hover:scale-105 hover:bg-slate-800 hover:shadow-xl cursor-pointer">

      <h3 className="text-blue-400 font-bold text-xl mb-3">
        Podrška instruktora
      </h3>

      <p>
        Kandidat šalje zahtev za termin, a instruktor potvrđuje.
        Bez konflikata u rasporedu i bez čekanja u redovima.
      </p>
    </div>


    {/* CARD */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8
                    transition-all duration-300
                    hover:scale-105 hover:bg-slate-800 hover:shadow-xl cursor-pointer">

      <h3 className="text-blue-400 font-bold text-xl mb-3">
        Napredak i rezultati
      </h3>

      <p>
        Prati odrađene časove, statistiku, rezultate testova i svoj napredak
        u realnom vremenu na jednom mestu.
      </p>
    </div>

  </div>
 </div>
  </div>
);
}
