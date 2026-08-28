import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ExternalLink, MapPin, RefreshCw } from "lucide-react";
import { useI18n, type Lang } from "../lib/i18n";
import type { FRMSAgendaResponse } from "../lib/frms-agenda";

const copy: Record<Lang, { eyebrow: string; title: string; text: string; loading: string; empty: string; error: string; refresh: string; official: string; location: string; source: string; window: string }> = {
  en: { eyebrow: "Morocco surf calendar", title: "FRMS official agenda", text: "Upcoming competitions and federation events for the next two months, synchronized from the Royal Moroccan Surfing Federation.", loading: "Loading the official calendar…", empty: "No structured events are available right now. The official calendar may be updated dynamically.", error: "The federation calendar could not be reached right now.", refresh: "Refresh", official: "Official agenda", location: "Location", source: "Last synchronized", window: "Showing the next 2 months" },
  fr: { eyebrow: "Calendrier du surf marocain", title: "Agenda officiel FRMS", text: "Compétitions et événements fédéraux des deux prochains mois, synchronisés avec la Fédération Royale Marocaine de Surf.", loading: "Chargement de l’agenda officiel…", empty: "Aucun événement structuré n’est disponible pour le moment. L’agenda officiel peut être mis à jour dynamiquement.", error: "L’agenda de la fédération est momentanément inaccessible.", refresh: "Actualiser", official: "Agenda officiel", location: "Lieu", source: "Dernière synchronisation", window: "Affichage des deux prochains mois" },
  ar: { eyebrow: "روزنامة ركوب الأمواج بالمغرب", title: "الأجندة الرسمية للجامعة", text: "المسابقات والفعاليات خلال الشهرين المقبلين، تتم مزامنتها مع الجامعة الملكية المغربية لركوب الموج.", loading: "جارٍ تحميل الأجندة الرسمية…", empty: "لا توجد أحداث منظمة متاحة حالياً. قد يتم تحديث الأجندة الرسمية بشكل ديناميكي.", error: "يتعذر الوصول إلى أجندة الجامعة حالياً.", refresh: "تحديث", official: "الأجندة الرسمية", location: "المكان", source: "آخر مزامنة", window: "عرض الشهرين المقبلين" },
  es: { eyebrow: "Calendario del surf marroquí", title: "Agenda oficial FRMS", text: "Competiciones y eventos federativos de los próximos dos meses, sincronizados con la Federación Real Marroquí de Surf.", loading: "Cargando el calendario oficial…", empty: "No hay eventos estructurados disponibles ahora. El calendario oficial puede actualizarse dinámicamente.", error: "El calendario de la federación no está disponible en este momento.", refresh: "Actualizar", official: "Agenda oficial", location: "Lugar", source: "Última sincronización", window: "Mostrando los próximos dos meses" },
  de: { eyebrow: "Marokkanischer Surfkalender", title: "Offizielle FRMS-Agenda", text: "Wettbewerbe und Verbandsveranstaltungen der nächsten zwei Monate, synchronisiert mit dem Königlichen Marokkanischen Surfverband.", loading: "Offiziellen Kalender laden…", empty: "Derzeit sind keine strukturierten Veranstaltungen verfügbar.", error: "Der Verbandskalender ist derzeit nicht erreichbar.", refresh: "Aktualisieren", official: "Offizielle Agenda", location: "Ort", source: "Letzte Synchronisierung", window: "Anzeige der nächsten zwei Monate" },
  it: { eyebrow: "Calendario del surf marocchino", title: "Agenda ufficiale FRMS", text: "Competizioni ed eventi federali dei prossimi due mesi, sincronizzati con la Federazione Reale Marocchina di Surf.", loading: "Caricamento del calendario ufficiale…", empty: "Nessun evento strutturato disponibile al momento.", error: "Il calendario della federazione non è raggiungibile in questo momento.", refresh: "Aggiorna", official: "Agenda ufficiale", location: "Luogo", source: "Ultima sincronizzazione", window: "Visualizzazione dei prossimi due mesi" },
  pt: { eyebrow: "Calendário de surf marroquino", title: "Agenda oficial FRMS", text: "Competições e eventos federativos dos próximos dois meses, sincronizados com a Federação Real Marroquina de Surf.", loading: "A carregar o calendário oficial…", empty: "Não existem eventos estruturados disponíveis neste momento.", error: "O calendário da federação não está disponível neste momento.", refresh: "Atualizar", official: "Agenda oficial", location: "Local", source: "Última sincronização", window: "A mostrar os próximos dois meses" },
  nl: { eyebrow: "Marokkaanse surfkalender", title: "Officiële FRMS-agenda", text: "Wedstrijden en federatie-evenementen voor de komende twee maanden, gesynchroniseerd met de Koninklijke Marokkaanse Surffederatie.", loading: "Officiële kalender laden…", empty: "Er zijn momenteel geen gestructureerde evenementen beschikbaar.", error: "De federatiekalender is momenteel niet bereikbaar.", refresh: "Vernieuwen", official: "Officiële agenda", location: "Locatie", source: "Laatst gesynchroniseerd", window: "De komende twee maanden" },
  tr: { eyebrow: "Fas sörf takvimi", title: "Resmî FRMS ajandası", text: "Fas Kraliyet Sörf Federasyonu ile senkronize edilen önümüzdeki iki ayın yarışmaları ve federasyon etkinlikleri.", loading: "Resmî takvim yükleniyor…", empty: "Şu anda yapılandırılmış etkinlik bulunmuyor.", error: "Federasyon takvimine şu anda ulaşılamıyor.", refresh: "Yenile", official: "Resmî ajanda", location: "Konum", source: "Son senkronizasyon", window: "Önümüzdeki iki ay gösteriliyor" },
  zh: { eyebrow: "摩洛哥冲浪日历", title: "FRMS 官方日程", text: "与摩洛哥皇家冲浪联合会同步的未来两个月比赛和联邦活动。", loading: "正在加载官方日历…", empty: "目前没有可用的结构化活动。", error: "目前无法访问联合会日历。", refresh: "刷新", official: "官方日程", location: "地点", source: "最后同步", window: "显示未来两个月" },
  ja: { eyebrow: "モロッコ・サーフカレンダー", title: "FRMS公式アジェンダ", text: "モロッコ王立サーフィン連盟と同期した今後2か月の大会・連盟イベントです。", loading: "公式カレンダーを読み込み中…", empty: "現在、構造化されたイベントはありません。", error: "現在、連盟カレンダーにアクセスできません。", refresh: "更新", official: "公式アジェンダ", location: "場所", source: "最終同期", window: "今後2か月を表示" },
  ko: { eyebrow: "모로코 서핑 일정", title: "FRMS 공식 일정", text: "모로코 왕립 서핑 연맹과 동기화된 향후 2개월의 대회 및 연맹 행사입니다.", loading: "공식 일정을 불러오는 중…", empty: "현재 이용 가능한 구조화된 이벤트가 없습니다.", error: "현재 연맹 일정에 연결할 수 없습니다.", refresh: "새로고침", official: "공식 일정", location: "장소", source: "마지막 동기화", window: "향후 2개월 표시" },
};

function formatDate(value: string | undefined, lang: Lang) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(date);
}

export function FRMSAgenda() {
  const { lang } = useI18n();
  const t = copy[lang];
  const [data, setData] = useState<FRMSAgendaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async (force = false) => {
    setLoading(true); setError(false);
    try {
      const response = await fetch(`/api/frms-agenda${force ? "?refresh=1" : ""}`, { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error("agenda");
      setData(await response.json() as FRMSAgendaResponse);
    } catch { setError(true); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const events = useMemo(() => data?.events ?? [], [data]);
  return (
    <section id="agenda" data-nav-theme="dark" className="bg-slate-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">{t.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{t.title}</h2>
            <p className="mt-4 text-lg leading-7 text-white/65">{t.text}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => void load(true)} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold hover:bg-white/10 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />{t.refresh}</button>
            <a href="https://www.fedesurfmaroc.com/agenda/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-950"><CalendarDays className="h-4 w-4" />{t.official}<ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </div>
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            <CalendarDays className="h-4 w-4" />
            {t.window}
          </div>
          {loading ? <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">{t.loading}</div> : error ? <div className="rounded-3xl border border-rose-300/20 bg-rose-300/5 p-10 text-center text-white/70">{t.error}</div> : events.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">{t.empty}</div> : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => <article key={event.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-300"><CalendarDays className="h-4 w-4" />{formatDate(event.start, lang)}{event.end ? ` — ${formatDate(event.end, lang)}` : ""}</div>
                <h3 className="mt-4 text-xl font-black">{event.title}</h3>
                {event.location && <p className="mt-3 flex items-center gap-2 text-sm text-white/60"><MapPin className="h-4 w-4 shrink-0" />{event.location}</p>}
                {event.category && <p className="mt-2 text-xs font-bold uppercase tracking-wide text-white/40">{event.category}</p>}
                {event.url && <a href={event.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">{t.official}<ExternalLink className="h-3.5 w-3.5" /></a>}
              </article>)}
            </div>
          )}
        </div>
        {data?.updatedAt && <p className="mt-5 text-right text-xs text-white/35">{t.source}: {new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.updatedAt))}</p>}
      </div>
    </section>
  );
}
