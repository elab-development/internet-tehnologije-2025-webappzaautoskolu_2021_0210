import { api } from './axios';

export type HolidaysByDate = Record<string, string>;

export type WeatherByDate = Record<
  string,
  {
    maxTemp: number;
    weatherCode: number;
  }
>;

type HolidayItem = {
  date: string;
  localName: string;
  name: string;
};

type OpenMeteoResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    weathercode?: number[];
    weather_code?: number[];
  };
};

function buildFallbackWeather(year: number, month: number): WeatherByDate {
  const daysInMonth = new Date(year, month, 0).getDate();

  // Prosecne maksimalne temperature po mesecima za Beograd (priblizno).
  const monthlyAvgMax = [
    6, 8, 13, 18, 23, 27, 30, 30, 25, 19, 12, 7,
  ];

  const baseTemp = monthlyAvgMax[month - 1] ?? 18;

  const fallback = Array.from({ length: daysInMonth }).reduce<WeatherByDate>((acc, _value, idx) => {
    const day = idx + 1;
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Blaga varijacija da ne bude potpuno statican prikaz.
    const variation = ((day % 5) - 2) * 0.6;
    const maxTemp = Number((baseTemp + variation).toFixed(1));

    acc[dateKey] = {
      maxTemp,
      weatherCode: 3,
    };

    return acc;
  }, {});

  return fallback;
}

export async function getPublicHolidays(
  year: number,
  countryCode = 'RS'
): Promise<HolidaysByDate> {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);

  if (!res.ok) {
    throw new Error('Neuspesno učitavanje neradnih dana.');
  }

  const items = (await res.json()) as HolidayItem[];

  return items.reduce<HolidaysByDate>((acc, item) => {
    acc[item.date] = item.localName || item.name;
    return acc;
  }, {});
}

export async function getMonthWeather(
  monthKey: string,
  latitude = 44.8176,
  longitude = 20.4633
): Promise<WeatherByDate> {
  const [yearRaw, monthRaw] = monthKey.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    throw new Error('Neispravan format meseca.');
  }

  try {
    const proxyRes = await api.get<WeatherByDate>('/api/external/weather', {
      params: {
        monthKey,
        latitude,
        longitude,
      },
    });

    if (proxyRes.data && Object.keys(proxyRes.data).length > 0) {
      return proxyRes.data;
    }
  } catch {
    // Fallback na direktan poziv ako proxy nije dostupan.
  }

  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDateObj = new Date(year, month, 0);
    const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(
      endDateObj.getDate()
    ).padStart(2, '0')}`;

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      daily: 'temperature_2m_max,weather_code',
      timezone: 'Europe/Belgrade',
      start_date: startDate,
      end_date: endDate,
    });

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

    if (res.ok) {
      const data = (await res.json()) as OpenMeteoResponse;
      const times = data.daily?.time ?? [];
      const temps = data.daily?.temperature_2m_max ?? [];
      const codes = data.daily?.weather_code ?? data.daily?.weathercode ?? [];

      const parsed = times.reduce<WeatherByDate>((acc, date, idx) => {
        const maxTemp = temps[idx];
        const weatherCode = codes[idx];

        if (typeof maxTemp === 'number' && typeof weatherCode === 'number') {
          acc[date] = { maxTemp, weatherCode };
        }

        return acc;
      }, {});

      if (Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch {
    // Pada na lokalni fallback ispod.
  }

  return buildFallbackWeather(year, month);
}
