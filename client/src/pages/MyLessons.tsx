import { useEffect, useMemo, useState } from "react";
import { getLessons, type Lesson } from "../api/lessons";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function formatDate(date: string) {
  return new Date(date).toLocaleString("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusColor(status: Lesson["status"]) {
  switch (status) {
    case "completed":
      return "bg-green-600/20 text-green-400 border-green-700/40";
    case "cancelled":
      return "bg-red-600/20 text-red-400 border-red-700/40";
    default:
      return "bg-blue-600/20 text-blue-400 border-blue-700/40";
  }
}

type SortBy = "date" | "status";
type SortDir = "asc" | "desc";

const statusRank: Record<Lesson["status"], number> = {
  scheduled: 0,
  completed: 1,
  cancelled: 2,
};

export default function MyLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLessons();
      setLessons(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Greška pri učitavanju časova");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sortedLessons = useMemo(() => {
    const copy = [...lessons];

    copy.sort((a, b) => {
      let cmp = 0;

      if (sortBy === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        cmp = statusRank[a.status] - statusRank[b.status];
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return copy;
  }, [lessons, sortBy, sortDir]);

  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Moji časovi vožnje</h1>

        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sortiraj:</span>
            <select
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
            >
              <option value="date">Po datumu</option>
              <option value="status">Po statusu</option>
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          >
            {sortDir === "asc" ? "Rastuće" : "Opadajuće"}
          </Button>
        </div>
      </div>

      {loading && <p className="text-slate-300">Učitavanje...</p>}

      {error && (
        <div className="text-red-400 bg-red-950/30 border border-red-900/60 rounded p-3">
          {error}
        </div>
      )}

      {!loading && sortedLessons.length === 0 && (
        <div className="text-slate-400">Trenutno nemaš zakazane časove.</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {sortedLessons.map((lesson) => (
          <Card key={lesson._id} title={lesson.title || "Čas vožnje"}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-3 py-1 rounded border ${statusColor(lesson.status)}`}>
                {lesson.status === "scheduled" && "Zakazan"}
                {lesson.status === "completed" && "Završen"}
                {lesson.status === "cancelled" && "Otkazan"}
              </span>
            </div>

            <div className="text-sm text-slate-300 space-y-1">
              <p>📅 {formatDate(lesson.date)}</p>
              <p>⏱ {lesson.duration} min</p>
              <p>👨‍🏫 Instruktor: {lesson.instructor?.user?.name || "-"}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}