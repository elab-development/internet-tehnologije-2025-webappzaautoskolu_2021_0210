import { useEffect, useMemo, useState } from "react";
import { createLessonRequest } from "../api/lessonRequests";
import {
  getMonthWeather,
  getPublicHolidays,
  type HolidaysByDate,
  type WeatherByDate,
} from "../api/external";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

function todayDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weatherLabel(weatherCode: number) {
  if (weatherCode <= 1) return "Vedro";
  if (weatherCode <= 3) return "Delimicno oblacno";
  if (weatherCode <= 67) return "Kisa";
  if (weatherCode <= 77) return "Sneg";
  if (weatherCode <= 99) return "Nevreme";
  return "Prognoza";
}

function estimateWeatherByDate(dateKey: string): { maxTemp: number; weatherCode: number } | null {
  const parts = dateKey.split("-");
  if (parts.length !== 3) return null;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;

  const monthlyAvgMax = [6, 8, 13, 18, 23, 27, 30, 30, 25, 19, 12, 7];
  const baseTemp = monthlyAvgMax[month - 1] ?? 18;
  const variation = ((day % 5) - 2) * 0.6;

  return {
    maxTemp: Number((baseTemp + variation).toFixed(1)),
    weatherCode: 3,
  };
}

export default function Booking() {
  const [date, setDate] = useState(todayDateString());
  const [time, setTime] = useState("08:00");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [holidaysByDate, setHolidaysByDate] = useState<HolidaysByDate>({});
  const [weatherByDate, setWeatherByDate] = useState<WeatherByDate>({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  const requestedDate = useMemo(() => {
    if (!date) return "";
    return `${date}T${time}`;
  }, [date, time]);

  const selectedYear = useMemo(() => {
    const parsed = Number(date.split("-")[0]);
    return Number.isFinite(parsed) ? parsed : new Date().getFullYear();
  }, [date]);

  const selectedMonthKey = useMemo(() => date.slice(0, 7), [date]);

  useEffect(() => {
    let active = true;

    const loadHolidays = async () => {
      try {
        const holidays = await getPublicHolidays(selectedYear, "RS");
        if (!active) return;
        setHolidaysByDate(holidays);
      } catch {
        if (!active) return;
        setHolidaysByDate({});
      }
    };

    loadHolidays();

    return () => {
      active = false;
    };
  }, [selectedYear]);

  useEffect(() => {
    let active = true;

    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        const weather = await getMonthWeather(selectedMonthKey);
        if (!active) return;
        setWeatherByDate(weather);
      } catch {
        if (!active) return;
        setWeatherByDate({});
      } finally {
        if (active) setWeatherLoading(false);
      }
    };

    loadWeather();

    return () => {
      active = false;
    };
  }, [selectedMonthKey]);

  const selectedHolidayName = holidaysByDate[date];
  const selectedWeather = weatherByDate[date] ?? estimateWeatherByDate(date);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!date) {
      setErr("Molim Vas izaberite termin.");
      return;
    }

    if (selectedHolidayName) {
      setErr(`Izabrani datum je neradan dan (${selectedHolidayName}). Molim Vas izaberite drugi termin.`);
      return;
    }

    setLoading(true);
    try {
      await createLessonRequest({
        requestedDate,
      });
      setMsg("Zahtev je poslat instruktoru. Sacekajte potvrdu.");
      setDate(todayDateString());
      setTime("08:00");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e?.message ?? "Greska prilikom slanja zahteva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Posalji zahtev">
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Datum" type="date" value={date} onChange={setDate} />

        <div>
          <label className="block text-sm text-slate-300 mb-1">Termin</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-700 p-2 outline-none focus:border-slate-500 text-white"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {weatherLoading && <div className="text-sm text-slate-300">Ucitavanje prognoze...</div>}

        {!weatherLoading && selectedWeather && (
          <div className="text-sm text-cyan-200 bg-cyan-950/30 border border-cyan-900/60 rounded p-2">
            Prognoza za {date}: {weatherLabel(selectedWeather.weatherCode)}, max {Math.round(selectedWeather.maxTemp)} C.
          </div>
        )}

        {selectedHolidayName && (
          <div className="text-sm text-amber-300 bg-amber-950/30 border border-amber-900/60 rounded p-2">
            Upozorenje: {date} je neradan dan ({selectedHolidayName}).
          </div>
        )}

        {err && (
          <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/60 rounded p-2">{err}</div>
        )}

        {msg && (
          <div className="text-sm text-green-300 bg-green-950/30 border border-green-900/60 rounded p-2">{msg}</div>
        )}

        <div className="pt-1">
          <Button type="submit" disabled={loading || Boolean(selectedHolidayName)} variant="primary">
            {loading ? "Saljem..." : "Posalji zahtev"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
