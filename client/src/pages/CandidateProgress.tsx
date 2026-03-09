import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { getMyTestResults, type CandidateTestResult } from "../api/tests";
import { getLessons, type Lesson } from "../api/lessons";

function formatDate(value: string) {
  return new Date(value).toLocaleString("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CandidateProgress() {
  const [testResults, setTestResults] = useState<CandidateTestResult[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [resultsData, lessonsData] = await Promise.all([
          getMyTestResults(),
          getLessons(),
        ]);

        setTestResults(resultsData);
        setLessons(lessonsData);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Greska pri ucitavanju napretka");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const testsTaken = testResults.length;
    const avgScore =
      testsTaken > 0
        ? Math.round(
            testResults.reduce((sum, result) => sum + result.percentage, 0) / testsTaken
          )
        : 0;

    const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;

    return {
      testsTaken,
      avgScore,
      completedLessons,
      totalLessons: lessons.length,
    };
  }, [testResults, lessons]);

  if (loading) {
    return <div className="p-6 text-slate-300">Ucitavanje napretka...</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Napredak kandidata</h1>

      {error && (
        <div className="text-red-300 bg-red-950/40 border border-red-900 rounded p-3">{error}</div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Testovi">
          <p className="text-2xl font-semibold">{stats.testsTaken}</p>
          <p className="text-slate-400 text-sm">Ukupno polaganja</p>
        </Card>

        <Card title="Prosek bodova">
          <p className="text-2xl font-semibold">{stats.avgScore}%</p>
          <p className="text-slate-400 text-sm">Prosecan rezultat testova</p>
        </Card>

        <Card title="Casovi voznje">
          <p className="text-2xl font-semibold">
            {stats.completedLessons}/{stats.totalLessons}
          </p>
          <p className="text-slate-400 text-sm">Zavrseni casovi</p>
        </Card>
      </div>

      <Card title="Rezultati testova">
        {testResults.length === 0 ? (
          <p className="text-slate-400">Jos nema polozenih testova.</p>
        ) : (
          <div className="space-y-3">
            {testResults.map((result) => (
              <div
                key={result._id}
                className="border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{result.test.title}</p>
                  <p className="text-slate-400 text-sm">{formatDate(result.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {result.score}/{result.maxScore}
                  </p>
                  <p className="text-slate-300 text-sm">{result.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Istorija casova">
        {lessons.length === 0 ? (
          <p className="text-slate-400">Nema evidentiranih casova.</p>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{lesson.title || "Cas voznje"}</p>
                  <p className="text-slate-400 text-sm">{formatDate(lesson.date)}</p>
                </div>
                <p className="text-slate-300 text-sm">Status: {lesson.status}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
