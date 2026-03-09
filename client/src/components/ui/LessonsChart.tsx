import { useEffect, useMemo, useRef, useState } from 'react';

type ChartPoint = {
  label: string;
  value: number;
};

type LessonsChartProps = {
  title?: string;
  points: ChartPoint[];
};

declare global {
  interface Window {
    google?: {
      charts: {
        load: (version: string, settings: { packages: string[] }) => void;
        setOnLoadCallback: (cb: () => void) => void;
      };
      visualization: {
        arrayToDataTable: (rows: Array<Array<string | number>>) => unknown;
        ColumnChart: new (element: Element) => {
          draw: (data: unknown, options: unknown) => void;
        };
      };
    };
    __googleChartsLoaderPromise?: Promise<void>;
  }
}

const loadGoogleCharts = (): Promise<void> => {
  if (window.__googleChartsLoaderPromise) {
    return window.__googleChartsLoaderPromise;
  }

  window.__googleChartsLoaderPromise = new Promise<void>((resolve, reject) => {
    const onLoaded = () => {
      if (!window.google?.charts) {
        reject(new Error('Grafikon nije dostupan.'));
        return;
      }

      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(() => resolve());
    };

    const existing = document.getElementById('google-charts-loader') as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.charts) {
        onLoaded();
      } else {
        existing.addEventListener('load', onLoaded, { once: true });
        existing.addEventListener('error', () => reject(new Error('Ne mogu da ucitam grafikon.')), {
          once: true,
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-charts-loader';
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    script.onload = onLoaded;
    script.onerror = () => reject(new Error('Ne mogu da ucitam grafikon.'));
    document.head.appendChild(script);
  });

  return window.__googleChartsLoaderPromise;
};

export default function LessonsChart({ title = 'Broj casova po danima', points }: LessonsChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo<Array<Array<string | number>>>(
    () => [['Dan', 'Broj casova'], ...points.map((point) => [point.label, point.value])],
    [points]
  );
  const maxValue = useMemo(() => points.reduce((max, point) => Math.max(max, point.value), 0), [points]);
  const integerTicks = useMemo(() => Array.from({ length: maxValue + 1 }, (_, index) => index), [maxValue]);

  useEffect(() => {
    let cancelled = false;

    const draw = async () => {
      try {
        setError(null);
        await loadGoogleCharts();

        if (cancelled || !chartRef.current || !window.google?.visualization) return;

        const data = window.google.visualization.arrayToDataTable(rows);
        const chart = new window.google.visualization.ColumnChart(chartRef.current);

        chart.draw(data, {
          title,
          legend: { position: 'none' },
          backgroundColor: 'transparent',
          titleTextStyle: { color: '#e2e8f0' },
          hAxis: { textStyle: { color: '#cbd5e1' } },
          vAxis: {
            minValue: 0,
            textStyle: { color: '#cbd5e1' },
            format: '0',
            ticks: integerTicks,
          },
          colors: ['#38bdf8'],
        });
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Ne mogu da prikazem grafikon.';
          setError(message);
        }
      }
    };

    draw();

    const onResize = () => {
      draw();
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, [rows, title, integerTicks]);

  if (error) {
    return <p className="text-sm text-amber-300">{error}</p>;
  }

  return <div ref={chartRef} className="w-full h-80" />;
}


