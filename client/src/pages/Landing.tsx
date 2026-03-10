import { useNavigate } from "react-router-dom";
import hero from "../assets/hero1.jpeg";

const stats = [
  { label: "Kandidata u 2025", value: "350+" },
  { label: "Prosečna ocena", value: "4.9/5" },
  { label: "Prolaznost iz prve", value: "92%" },
];

const steps = [
  {
    title: "Prijava za 2 minuta",
    text: "Napravi nalog i bukiraj svoj termin.",
  },
  {
    title: "Teorija i testovi online",
    text: "Vežba uz dobro smišljene testove.",
  },
  {
    title: "Voznja po tvom ritmu",
    text: "Online rezervacija termina, kada tebi odgovara.",
  },
];

const reviews = [
  {
    name: "Milica J.",
    city: "Novi Sad",
    text: "Najviše mi je značilo što sve imam u aplikaciji. Bez zvanja i jurcanja za terminima.",
  },
  {
    name: "Luka P.",
    city: "Beograd",
    text: "Instruktor je bio strpljiv, a raspored pregledan. Položio sam iz prve i praktični deo je prosao bez stresa.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-24 h-96 w-96 rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-slate-800/40 blur-3xl" />
      </div>

      <header className="relative z-10 flex w-full items-center justify-between border-b border-slate-800 px-6 py-6 md:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Auto-skola</p>
          <h1 className="text-xl font-semibold md:text-2xl">
            Smart<span className="text-blue-500">Drive</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-slate-700"
          >
            Prijava
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
          >
            Registracija
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full px-6 pb-16 md:px-10 md:pb-24">
        <section className="grid items-center gap-10 py-8 md:grid-cols-[1.1fr_0.9fr] md:py-14">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1 text-xs uppercase tracking-[0.2em] text-blue-300">
              Upis otvoren za mart
            </p>

            <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
              Nauči da voziš
              <span className="block text-blue-400">sigurno, jasno, bez haosa.</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              SmartDrive kombinuje modernu aplikaciju i instruktore koji će pratiti tvoji napredak.
             
            </p>

            
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-700/30 to-slate-700/30 blur-xl" />
            <img
              src={hero}
              alt="Instruktor i kandidat tokom voznje"
              className="relative h-[430px] w-full rounded-[2rem] border border-slate-700 object-cover shadow-2xl"
            />
          </div>
        </section>

        <section className="grid gap-4 py-8 sm:grid-cols-3 md:py-10">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-700 bg-slate-800/90 p-5 backdrop-blur"
            >
              <p className="text-3xl font-semibold text-blue-400">{item.value}</p>
              <p className="mt-2 text-sm text-slate-300">{item.label}</p>
            </article>
          ))}
        </section>

        <section className="py-8 md:py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold md:text-3xl">Kako izgleda obuka</h3>
            
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition hover:-translate-y-1 hover:border-blue-500/80"
              >
                <p className="text-sm font-semibold text-blue-400">0{index + 1}</p>
                <h4 className="mt-3 text-xl font-semibold">{step.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-2 md:py-12">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
              <p className="text-sm leading-relaxed text-slate-300">"{review.text}"</p>
              <p className="mt-4 font-semibold">{review.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{review.city}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center md:p-10">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300">Sledeći korak</p>
          <h3 className="mt-3 text-2xl font-semibold md:text-4xl">Rezerviši svoj prvi čas ove nedelje</h3>
          
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mt-6 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Kreiraj nalog i zakaži
          </button>
        </section>
      </main>
    </div>
  );
}

