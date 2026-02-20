import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InfoCard from "../components/ui/InfoCard";

const steps = [
  { key: "enrollment", title: "Upis u auto školu SmartDrive", desc: "Registracija i dodela instruktora koji te vodi kroz celu obuku.", badge: "Start" },
  { key: "theory", title: "Teorijska nastava", desc: "Predavanja u učionici i priprema za testove saobraćajnih propisa.", badge: "Teorija" },
  { key: "theory_exam", title: "Polaganje teorije", desc: "Test znanja iz saobraćajnih pravila i bezbednosti u saobraćaju.", badge: "Ispit" },
  { key: "first_aid", title: "Prva pomoć", desc: "Osnove pružanja prve pomoći i reagovanje u hitnim situacijama.", badge: "Obavezno" },
  { key: "practice", title: "Praktična vožnja", desc: "Časovi vožnje sa instruktorom i realne saobraćajne situacije.", badge: "Vožnja" },
  { key: "final_exam", title: "Završni ispit", desc: "Polaganje vožnje pred komisijom i sticanje vozačke dozvole.", badge: "Finale" },
];

function Pill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "blue";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-blue-600/15 border-blue-600/40 text-blue-200"
      : "bg-slate-800 border-slate-700 text-slate-200";

  return (
    <div className={"px-4 py-3 rounded-2xl border " + toneClass}>
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
            <div className="text-xl font-semibold text-white">{title}</div>

            <Button variant="secondary" onClick={onClose}>
              Zatvori
            </Button>
          </div>

          <div className="p-8 md:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateHome() {
  const { user } = useAuth();

  const userId = user?.id ?? null;
  const stableUserKey = userId
    ? `id:${userId}`
    : user?.email
    ? `email:${user.email}`
    : null;

  const STORAGE_KEY = stableUserKey ? `theory_progress_${stableUserKey}` : null;

  const [theoryDone, setTheoryDone] = useState<boolean[]>(
    () => Array.from({ length: 20 }, () => false)
  );
  const [openTheoryModal, setOpenTheoryModal] = useState(false);

  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = false;
    if (!STORAGE_KEY) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 20) {
          setTheoryDone(parsed.map(Boolean));
        } else {
          setTheoryDone(Array.from({ length: 20 }, () => false));
        }
      } else {
        setTheoryDone(Array.from({ length: 20 }, () => false));
      }
    } catch {
      setTheoryDone(Array.from({ length: 20 }, () => false));
    } finally {
      hydratedRef.current = true;
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!STORAGE_KEY) return;
    if (!hydratedRef.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theoryDone));
    } catch {
      // ignore
    }
  }, [STORAGE_KEY, theoryDone]);

  const theoryStats = useMemo(() => {
    const total = 20;
    const done = theoryDone.filter(Boolean).length;
    const remaining = total - done;
    const percent = Math.round((done / total) * 100);
    const completed = done === total;
    return { total, done, remaining, percent, completed };
  }, [theoryDone]);

  const toggleTheory = (index: number) => {
    setTheoryDone((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const markAllTheory = () => setTheoryDone(Array.from({ length: 20 }, () => true));
  const resetTheory = () => setTheoryDone(Array.from({ length: 20 }, () => false));

  return (
    <div className="min-h-screen text-white px-6 md:px-10 lg:px-14 py-12 md:py-16">
      <div className="w-full space-y-12 md:space-y-14">
        {/* HEADER */}
        <div className="px-1 md:px-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Dobrodošla{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
        </div>

        {/* PROGRESS CARD (klikabilan) */}
        <div className="px-1 md:px-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpenTheoryModal(true)}
            className="cursor-pointer transition hover:scale-[1.01]"
          >
            <Card title="Napredak teorijske obuke">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                <div className="max-w-3xl">
                  <div className="text-3xl md:text-4xl font-semibold mt-2">
                    {theoryStats.completed
                      ? "Teorijska obuka uspešno završena ✅"
                      : `${theoryStats.percent}% završeno (${theoryStats.done}/${theoryStats.total})`}
                  </div>

                  <p className="text-slate-300 text-base md:text-lg mt-4">
                    Klikni da označiš koje si teorijske časove prešao/la, kako bi bio/la u toku sa svojim napretkom.
                  </p>

                  {!userId && (
                    <div className="mt-3 text-sm text-amber-200/90">
                      Nisi ulogovan/a — napredak se neće snimati dok se ne prijaviš.
                    </div>
                  )}
                </div>

                <div className="w-full xl:w-[720px]">
                  <div className="h-4 md:h-5 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${theoryStats.percent}%` }} />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-4">
                    <Pill label="Ukupno časova" value={theoryStats.total} />
                    <Pill label="Završeno" value={theoryStats.done} tone="blue" />
                    <Pill label="Preostalo" value={theoryStats.remaining} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* MODAL */}
        <Modal
          open={openTheoryModal}
          title="Napredak teorijske obuke (20 časova)"
          onClose={() => setOpenTheoryModal(false)}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-slate-300 text-base">
              Označi časove koje si završio/la.
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={markAllTheory}>
                Označi sve
              </Button>
              <Button variant="secondary" onClick={resetTheory}>
                Reset
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <label
                key={i}
                className={
                  "flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition " +
                  (theoryDone[i]
                    ? "bg-blue-600/15 border-blue-600/40"
                    : "bg-slate-800 border-slate-700 hover:bg-slate-700/40")
                }
              >
                <input
                  type="checkbox"
                  checked={theoryDone[i]}
                  onChange={() => toggleTheory(i)}
                  className="h-5 w-5"
                />
                <span className="text-lg text-slate-200 font-medium">Čas {i + 1}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 text-sm text-slate-500">
            {theoryStats.completed &&
              "Super! Teorijska obuka je kompletirana — sledeće je fokus na praktičnu vožnju."}
          </div>
        </Modal>

        {/* PLAN OBUKE */}
        <div className="px-1 md:px-2 space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Plan obuke</h2>
          </div>

          {/* InfoCard reusable */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {steps.map((step) => (
              <InfoCard
                key={step.key}
                title={step.title}
                description={step.desc}
                badge={step.badge}
                imageUrl="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}