import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";

const steps = [
  {
    key: "enrollment",
    title: "Upis i dokumentacija",
    desc: "Provera dokumentacije i uvodni dogovor sa instruktorom.",
  },
  {
    key: "theory",
    title: "Teorijska nastava",
    desc: "Priprema kroz predavanja i testove saobracajnih propisa.",
  },
  {
    key: "practice",
    title: "Prakticna voznja",
    desc: "Redovni casovi voznje i savladavanje realnih saobracajnih situacija.",
  },
  {
    key: "final",
    title: "Zavrsni ispit",
    desc: "Polaganje voznje pred komisijom.",
  },
];

const quickActions = [
  { to: "/testovi", title: "Teorijski testovi", desc: "Pokreni test i proveri znanje." },
  { to: "/zakazivanje-voznje", title: "Zakazi voznju", desc: "Zakazi sledeci cas." },
  { to: "/moji-zahtevi", title: "Moji zahtevi", desc: "Prati status poslatih zahteva." },
  { to: "/moji-casovi", title: "Moji casovi", desc: "Pregled zakazanih i zavrsenih casova." },
];

export default function CandidateHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-white px-6 md:px-10 lg:px-14 py-12 md:py-16">
      <div className="space-y-10">
        <section className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Dobrodosla{user?.name ? `, ${user.name}` : ""}👋
          </h1>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          {quickActions.map((item) => (
            <Link key={item.to} to={item.to} className="block">
              <Card title={item.title}>
                <p className="text-slate-300">{item.desc}</p>
              </Card>
            </Link>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Plan obuke</h2>
          <Card>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 grid place-items-center font-semibold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-slate-300 text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
