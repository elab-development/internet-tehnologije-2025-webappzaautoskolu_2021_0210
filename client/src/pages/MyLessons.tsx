import { useEffect, useState } from "react";
import { getLessons, type Lesson } from "../api/lessons";
import { useAuth } from "../context/AuthContext";

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

export default function MyLessons() {
  const { user } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getLessons();

      // flitriranje samo časove ovog kandidata
      const my = data.filter(
        (l: any) => l.candidate?.user?._id === user?.id
      );

      setLessons(my);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Greška pri učitavanju časova"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Moji časovi vožnje</h1>

      {loading && <p className="text-slate-300">Učitavanje...</p>}

      {error && (
        <div className="text-red-400 bg-red-950/30 border border-red-900/60 rounded p-3">
          {error}
        </div>
      )}

      {!loading && lessons.length === 0 && (
        <div className="text-slate-400">
          Trenutno nemaš zakazane časove.
        </div>
      )}

      {/* Kartice */}
      <div className="grid md:grid-cols-2 gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {lesson.title || "Čas vožnje"}
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded border ${statusColor(
                  lesson.status
                )}`}
              >
                {lesson.status === "scheduled" && "Zakazan"}
                {lesson.status === "completed" && "Završen"}
                {lesson.status === "cancelled" && "Otkazan"}
              </span>
            </div>

            <div className="text-sm text-slate-300 space-y-1">
              <p>📅 {formatDate(lesson.date)}</p>
              <p>⏱ {lesson.duration} min</p>
              <p>
                👨‍🏫 Instruktor:{" "}
                {lesson.instructor?.user?.name || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
