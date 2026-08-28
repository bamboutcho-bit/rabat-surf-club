import { useEffect, useState } from "react";
import { Waves, Wind, Thermometer, RefreshCw, TriangleAlert } from "lucide-react";

import { useI18n } from "../lib/i18n";

const LAT = 34.0327982;
const LON = -6.8379037;

type DayForecast = {
  date: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  tempMax: number | null;
};

type FetchState =
  { status: "loading" } | { status: "error" } | { status: "ready"; days: DayForecast[] };

function ratingFor(waveHeight: number | null, windSpeed: number | null): "good" | "fair" | "poor" {
  if (waveHeight == null || windSpeed == null) return "fair";
  if (waveHeight >= 0.5 && waveHeight <= 1.6 && windSpeed <= 20) return "good";
  if (waveHeight < 0.25 || waveHeight > 2.2 || windSpeed > 32) return "poor";
  return "fair";
}

function windArrowRotation(direction: number | null) {
  // Meteorological convention: direction wind is coming FROM.
  // Rotate an "up" arrow to point in the direction the wind blows TOWARD.
  if (direction == null) return 0;
  return direction + 180;
}

async function fetchForecast(): Promise<DayForecast[]> {
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&daily=wave_height_max,wave_period_max&timezone=auto&forecast_days=7`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`;

  const [marineRes, weatherRes] = await Promise.all([fetch(marineUrl), fetch(weatherUrl)]);
  if (!marineRes.ok || !weatherRes.ok) {
    throw new Error("Forecast request failed");
  }
  const marine = await marineRes.json();
  const weather = await weatherRes.json();

  const dates: string[] = marine?.daily?.time ?? weather?.daily?.time ?? [];

  return dates.map((date, i) => ({
    date,
    waveHeight: marine?.daily?.wave_height_max?.[i] ?? null,
    wavePeriod: marine?.daily?.wave_period_max?.[i] ?? null,
    windSpeed: weather?.daily?.wind_speed_10m_max?.[i] ?? null,
    windDirection: weather?.daily?.wind_direction_10m_dominant?.[i] ?? null,
    tempMax: weather?.daily?.temperature_2m_max?.[i] ?? null,
  }));
}

export function SurfConditions() {
  const { t, lang } = useI18n();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchForecast()
      .then((days) => {
        if (!cancelled) setState({ status: "ready", days });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const localeMap: Record<string, string> = {
    en: "en-US", fr: "fr-FR", ar: "ar-MA", es: "es-ES", de: "de-DE",
    it: "it-IT", pt: "pt-PT", nl: "nl-NL", tr: "tr-TR", zh: "zh-CN",
    ja: "ja-JP", ko: "ko-KR",
  };
  const dateFormatter = new Intl.DateTimeFormat(localeMap[lang] ?? "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const ratingStyles: Record<"good" | "fair" | "poor", string> = {
    good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    fair: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    poor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  };

  return (
    <section id="conditions" data-nav-theme="light" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t.conditions.title}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t.conditions.subtitle}</p>
      </div>

      <div className="mt-10">
        {state.status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>{t.conditions.loading}</span>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-12 text-center text-muted-foreground">
            <TriangleAlert className="h-6 w-6 text-primary" aria-hidden="true" />
            <span>{t.conditions.error}</span>
          </div>
        )}

        {state.status === "ready" && (
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-7">
            {state.days.map((day, i) => {
              const rating = ratingFor(day.waveHeight, day.windSpeed);
              return (
                <div
                  key={day.date}
                  className="w-40 shrink-0 snap-start rounded-2xl border border-border bg-card p-4 shadow-sm sm:w-auto"
                >
                  <p className="text-sm font-semibold text-card-foreground">
                    {i === 0 ? t.conditions.today : dateFormatter.format(new Date(day.date))}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${ratingStyles[rating]}`}
                  >
                    {t.conditions.rating[rating]}
                  </span>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-foreground">
                      <Waves className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">
                          {day.waveHeight != null ? `${day.waveHeight.toFixed(1)} m` : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.conditions.waveHeight}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-foreground">
                      <Waves
                        className="h-4 w-4 shrink-0 rotate-90 text-primary"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold">
                          {day.wavePeriod != null ? `${day.wavePeriod.toFixed(0)} s` : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.conditions.wavePeriod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-foreground">
                      <Wind
                        className="h-4 w-4 shrink-0 text-primary"
                        style={{ transform: `rotate(${windArrowRotation(day.windDirection)}deg)` }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold">
                          {day.windSpeed != null ? `${day.windSpeed.toFixed(0)} km/h` : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.conditions.wind}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-foreground">
                      <Thermometer className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">
                          {day.tempMax != null ? `${day.tempMax.toFixed(0)}°C` : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.conditions.airTemp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
        {t.conditions.disclaimer}
      </p>
    </section>
  );
}
