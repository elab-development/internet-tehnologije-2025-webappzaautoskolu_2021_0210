import { Request, Response } from 'express';
import https from 'https';

type OpenMeteoResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    weather_code?: number[];
    weathercode?: number[];
  };
};

type WeatherByDate = Record<
  string,
  {
    maxTemp: number;
    weatherCode: number;
  }
>;

function getJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        response.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf-8');

          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode ?? 0}: ${body}`));
            return;
          }

          try {
            resolve(JSON.parse(body) as T);
          } catch {
            reject(new Error('Neispravan JSON odgovor.'));
          }
        });
      })
      .on('error', (err) => reject(err));
  });
}

export async function getMonthlyWeather(req: Request, res: Response) {
  const monthKey = String(req.query.monthKey ?? '');
  const latitudeRaw = req.query.latitude;
  const longitudeRaw = req.query.longitude;

  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return res.status(400).json({ message: 'Neispravan format meseca.' });
  }

  const [yearRaw, monthRaw] = monthKey.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  const latitude =
    typeof latitudeRaw === 'string' && Number.isFinite(Number(latitudeRaw))
      ? Number(latitudeRaw)
      : 44.8176;
  const longitude =
    typeof longitudeRaw === 'string' && Number.isFinite(Number(longitudeRaw))
      ? Number(longitudeRaw)
      : 20.4633;

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

  try {
    const data = await getJson<OpenMeteoResponse>(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const times = data.daily?.time ?? [];
    const temps = data.daily?.temperature_2m_max ?? [];
    const codes = data.daily?.weather_code ?? data.daily?.weathercode ?? [];

    const weatherByDate = times.reduce<WeatherByDate>((acc, date, idx) => {
      const maxTemp = temps[idx];
      const weatherCode = codes[idx];

      if (typeof maxTemp === 'number' && typeof weatherCode === 'number') {
        acc[date] = { maxTemp, weatherCode };
      }

      return acc;
    }, {});

    return res.json(weatherByDate);
  } catch {
    return res.status(502).json({ message: 'Servis za prognozu trenutno nije dostupan.' });
  }
}
