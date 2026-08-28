export type FRMSEvent = {
  id: string;
  title: string;
  start?: string;
  end?: string;
  location?: string;
  category?: string;
  url?: string;
};

export type FRMSAgendaResponse = {
  source: string;
  updatedAt: string;
  windowStart: string;
  windowEnd: string;
  events: FRMSEvent[];
  warning?: string;
};

const SOURCE = "https://www.fedesurfmaroc.com/agenda/";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let memoryCache: { expiresAt: number; payload: FRMSAgendaResponse } | undefined;

function strip(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\\u0026/g, "&")
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(value: string, base: string) {
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function pickString(v: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = v[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function asEvent(value: unknown, index: number): FRMSEvent | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;

  const title = pickString(v, [
    "name", "title", "label", "event_name", "eventName", "nom", "titre",
  ]);
  if (!title) return null;

  const start = pickString(v, [
    "startDate", "start", "start_date", "startDateTime", "date_start",
    "dateStart", "begin", "from", "date",
  ]);
  const end = pickString(v, [
    "endDate", "end", "end_date", "endDateTime", "date_end", "dateEnd", "to",
  ]);

  const rawLocation = v.location ?? v.venue ?? v.place ?? v.spot ?? v.lieu;
  const place = typeof rawLocation === "string"
    ? rawLocation
    : rawLocation && typeof rawLocation === "object"
      ? pickString(rawLocation as Record<string, unknown>, ["name", "title", "label", "city", "address"])
      : undefined;

  const url = pickString(v, ["url", "link", "permalink", "href"]);
  const category = pickString(v, ["category", "type", "discipline", "disciplineName", "categorie"]);
  const id = pickString(v, ["id", "slug", "eventId", "uuid"]) ?? `${index}-${title}`;

  return {
    id: strip(id),
    title: strip(title),
    start: start ? strip(start) : undefined,
    end: end ? strip(end) : undefined,
    location: place ? strip(place) : undefined,
    category: category ? strip(category) : undefined,
    url: url ? absoluteUrl(strip(url), SOURCE) : undefined,
  };
}

function collectJson(value: unknown, out: FRMSEvent[]) {
  if (Array.isArray(value)) {
    value.forEach((x) => collectJson(x, out));
    return;
  }
  if (!value || typeof value !== "object") return;

  const event = asEvent(value, out.length);
  if (event) out.push(event);

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (["@context", "description", "image", "logo"].includes(key)) continue;
    if (typeof child === "object") collectJson(child, out);
  }
}

function parseJsonText(text: string): FRMSEvent[] {
  const events: FRMSEvent[] = [];
  const trimmed = text.trim();
  if (!trimmed) return events;

  try {
    collectJson(JSON.parse(trimmed), events);
    return events;
  } catch {
    // Some endpoints return JSONP or a JavaScript assignment.
  }

  const candidates = [
    trimmed.match(/^[^(]+\((\{[\s\S]*\}|\[[\s\S]*\])\)\s*;?$/)?.[1],
    trimmed.match(/(?:window\.__\w+|self\.__\w+|__NEXT_DATA__)\s*=\s*(\{[\s\S]*\})\s*;?/)?.[1],
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try { collectJson(JSON.parse(candidate), events); } catch { /* ignore */ }
  }
  return events;
}

function parseEmbeddedJson(html: string): FRMSEvent[] {
  const events: FRMSEvent[] = [];
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    events.push(...parseJsonText(match[1] ?? ""));
  }

  const nextData = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  if (nextData) events.push(...parseJsonText(nextData));

  return events;
}

function discoverUrls(html: string, base: string) {
  const urls = new Set<string>();

  // Script bundles are important because the FRMS calendar is rendered dynamically.
  for (const match of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    urls.add(absoluteUrl(match[1]!, base));
  }

  // Explicit URLs and API-looking paths embedded in HTML.
  for (const match of html.matchAll(/https?:[^"'\s<>]+/g)) {
    const value = match[0].replace(/\\u0026/g, "&");
    if (/agenda|event|calendar|ajax|api|wp-json|competition|compet/i.test(value)) urls.add(value);
  }

  for (const match of html.matchAll(/["']([^"']*(?:wp-json|\/api\/|\/ajax\/|agenda|calendar|event|competition)[^"']*)["']/gi)) {
    const value = match[1]!.replace(/\\u0026/g, "&");
    urls.add(absoluteUrl(value, base));
  }

  // Common API locations used by custom WordPress/React calendar implementations.
  for (const path of [
    "/wp-json/",
    "/wp-json/wp/v2/",
    "/wp-json/wp/v2/events",
    "/wp-json/wp/v2/agenda",
    "/wp-json/wp/v2/competitions",
    "/api/events",
    "/api/agenda",
    "/api/calendar",
    "/api/competitions",
    "/api/agenda/events",
  ]) urls.add(absoluteUrl(path, base));

  return [...urls].slice(0, 80);
}

function discoverApiCandidatesFromScript(script: string, base: string) {
  const urls = new Set<string>();

  for (const match of script.matchAll(/https?:\/\/[^"'`\s)]+/g)) {
    const value = match[0].replace(/\\u0026/g, "&");
    if (/agenda|event|calendar|ajax|api|competition|compet/i.test(value)) urls.add(value);
  }

  for (const match of script.matchAll(/["'`]((?:\/|\.\/|\.\.\/)[^"'`\s]*(?:api|agenda|event|calendar|ajax|competition|compet)[^"'`]*)["'`]/gi)) {
    urls.add(absoluteUrl(match[1]!, base));
  }

  return [...urls];
}

function dedupe(events: FRMSEvent[]) {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.title}|${event.start ?? ""}|${event.location ?? ""}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getAgendaWindow() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 2);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function eventOverlapsWindow(event: FRMSEvent, start: Date, end: Date) {
  if (!event.start) return false;
  const eventStart = new Date(event.start);
  if (Number.isNaN(eventStart.getTime())) return false;
  const eventEnd = event.end ? new Date(event.end) : eventStart;
  const normalizedEnd = Number.isNaN(eventEnd.getTime()) ? eventStart : eventEnd;
  return eventStart <= end && normalizedEnd >= start;
}

async function fetchText(url: string, accept = "text/html,application/json,text/plain,*/*") {
  const response = await fetch(url, {
    headers: {
      accept,
      "user-agent": "Mozilla/5.0 (compatible; Rabat-Surf-Club/1.0)",
      referer: SOURCE,
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return await response.text();
}

export async function fetchFRMSAgenda(force = false): Promise<FRMSAgendaResponse> {
  if (!force && memoryCache && memoryCache.expiresAt > Date.now()) return memoryCache.payload;

  const { start, end } = getAgendaWindow();
  const html = await fetchText(SOURCE);
  if (html === null) throw new Error("FRMS agenda could not be reached");

  let events = parseEmbeddedJson(html);
  const urls = discoverUrls(html, SOURCE);

  // Inspect JavaScript bundles for the actual calendar/API endpoint.
  const scriptUrls = urls.filter((url) => /\.m?js(?:\?|$)/i.test(url));
  for (const scriptUrl of scriptUrls.slice(0, 30)) {
    try {
      const script = await fetchText(scriptUrl, "text/javascript,text/plain,*/*");
      if (!script) continue;
      urls.push(...discoverApiCandidatesFromScript(script, SOURCE));
    } catch { /* continue with other candidates */ }
  }

  const uniqueUrls = [...new Set(urls)];
  for (const endpoint of uniqueUrls) {
    try {
      const text = await fetchText(endpoint, "application/json,text/plain,*/*");
      if (!text) continue;
      const parsed = parseJsonText(text);
      if (parsed.length) events.push(...parsed);
    } catch { /* one endpoint failing must not stop the sync */ }
  }

  events = dedupe(events)
    .filter((event) => event.title.length > 1)
    .filter((event) => eventOverlapsWindow(event, start, end))
    .sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime())
    .slice(0, 100);

  const payload: FRMSAgendaResponse = {
    source: SOURCE,
    updatedAt: new Date().toISOString(),
    windowStart: start.toISOString(),
    windowEnd: end.toISOString(),
    events,
    warning: events.length
      ? undefined
      : "The FRMS calendar is rendered dynamically. No events could be synchronized from its public data endpoints right now.",
  };

  memoryCache = { expiresAt: Date.now() + CACHE_TTL_MS, payload };
  return payload;
}
