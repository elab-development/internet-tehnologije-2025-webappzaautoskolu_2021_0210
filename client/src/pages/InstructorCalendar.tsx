import { useEffect, useMemo, useState } from 'react';
import { getLessons, type Lesson } from '../api/lessons';
import { getMonthWeather, type WeatherByDate } from '../api/external';
import LessonsChart from '../components/ui/LessonsChart';
import Card from '../components/ui/Card';

type DayGroup = {
  dateKey: string;
  lessons: Lesson[];
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDateKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

function formatDayHeader(dateKey: string) {
  const [yearRaw, monthRaw, dayRaw] = dateKey.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  return new Date(year, month - 1, day).toLocaleDateString('sr-RS', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatLessonTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sr-RS', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function lessonStatusClass(status: Lesson['status']) {
  if (status === 'completed') return 'bg-green-700/20 text-green-300 border-green-700/40';
  if (status === 'cancelled') return 'bg-red-700/20 text-red-300 border-red-700/40';
  return 'bg-blue-700/20 text-blue-300 border-blue-700/40';
}

function weatherLabel(weatherCode: number) {
  if (weatherCode <= 1) return 'Vedro';
  if (weatherCode <= 3) return 'Delimicno oblacno';
  if (weatherCode <= 67) return 'Kisa';
  if (weatherCode <= 77) return 'Sneg';
  if (weatherCode <= 99) return 'Nevreme';
  return 'Prognoza';
}

export default function InstructorCalendar() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [monthKey, setMonthKey] = useState(currentMonthKey());
  const [weatherByDate, setWeatherByDate] = useState<WeatherByDate>({});

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLessons();
      setLessons(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ne mogu da ucitam raspored.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    let active = true;

    const loadExternal = async () => {
      try {
        const weather = await getMonthWeather(monthKey);

        if (!active) return;

        setWeatherByDate(weather);
      } catch {
        if (!active) return;
      }
    };

    loadExternal();

    return () => {
      active = false;
    };
  }, [monthKey]);

  const monthLessons = useMemo(() => {
    return lessons
      .filter((lesson) => toDateKey(lesson.date).startsWith(monthKey))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [lessons, monthKey]);

  const groupedDays = useMemo<DayGroup[]>(() => {
    const grouped = monthLessons.reduce<Record<string, Lesson[]>>((acc, lesson) => {
      const dateKey = toDateKey(lesson.date);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(lesson);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((dateKey) => ({
        dateKey,
        lessons: grouped[dateKey].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      }));
  }, [monthLessons]);

  const chartPoints = useMemo(() => {
    return groupedDays.map((day) => {
      const dayNum = day.dateKey.split('-')[2];
      return {
        label: `${dayNum}.`,
        value: day.lessons.length,
      };
    });
  }, [groupedDays]);

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">Kalendar voznji instruktora</h1>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={monthKey}
            onChange={(e) => setMonthKey(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <Card title="Statistika po danima">
        {chartPoints.length > 0 ? (
          <LessonsChart points={chartPoints} />
        ) : (
          <p className="text-slate-400">Nema casova u izabranom mesecu.</p>
        )}
      </Card>


      {loading && <p className="text-slate-300">Ucitavanje rasporeda...</p>}
      {error && (
        <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">
          Greska: {error}
        </div>
      )}

      {!loading && !error && groupedDays.length === 0 && (
        <Card title="Raspored">
          <p className="text-slate-400">Nema zakazanih casova u ovom mesecu.</p>
        </Card>
      )}

      <div className="grid gap-3">
        {groupedDays.map((day) => {
          const weather = weatherByDate[day.dateKey];
          const hasUpcomingLesson = day.lessons.some((lesson) => new Date(lesson.date).getTime() >= Date.now());

          return (
            <Card key={day.dateKey} title={formatDayHeader(day.dateKey)}>
              <div className="flex flex-wrap gap-2 mb-3">

                {weather && hasUpcomingLesson && (
                  <span className="text-xs px-2 py-1 rounded border bg-cyan-700/20 text-cyan-200 border-cyan-700/40">
                    {weatherLabel(weather.weatherCode)} | max {Math.round(weather.maxTemp)} C
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {day.lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div className="text-sm">
                      <p className="font-medium">
                        {formatLessonTime(lesson.date)} - {lesson.title || 'Cas voznje'}
                      </p>
                      <p className="text-slate-300">
                        Kandidat: {lesson.candidate?.user?.name ?? '-'} ({lesson.candidate?.user?.email ?? '-'})
                      </p>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded border w-fit ${lessonStatusClass(lesson.status)}`}>
                      {lesson.status === 'scheduled' && 'Zakazan'}
                      {lesson.status === 'completed' && 'Zavrsen'}
                      {lesson.status === 'cancelled' && 'Otkazan'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
}




