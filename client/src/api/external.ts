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
  };
};

export async function getPublicHolidays(
  year: number,
  countryCode = 'RS'
): Promise<HolidaysByDate> {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);

  if (!res.ok) {
    throw new Error('Neuspesno ucitavanje neradnih dana.');
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

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDateObj = new Date(year, month, 0);
  const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(
    endDateObj.getDate()
  ).padStart(2, '0')}`;

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'temperature_2m_max,weathercode',
    timezone: 'Europe/Belgrade',
    start_date: startDate,
    end_date: endDate,
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Neuspesno ucitavanje vremenske prognoze.');
  }

  const data = (await res.json()) as OpenMeteoResponse;
  const times = data.daily?.time ?? [];
  const temps = data.daily?.temperature_2m_max ?? [];
  const codes = data.daily?.weathercode ?? [];

  return times.reduce<WeatherByDate>((acc, date, idx) => {
    const maxTemp = temps[idx];
    const weatherCode = codes[idx];

    if (typeof maxTemp === 'number' && typeof weatherCode === 'number') {
      acc[date] = { maxTemp, weatherCode };
    }

    return acc;
  }, {});
}
