import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Calendar,
  ExternalLink,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Shield,
  Sun,
  Waves,
} from "lucide-react";

import heroImage from "../assets/hero-surf-hero-4k.jpg";
import heroImageTwo from "../assets/generated-frame-1-4k-hero-4k.jpg";
import heroImageThree from "../assets/generated-frame-2-4k-hero-4k.jpg";
import clubLogo from "../assets/club-logo.png";
import { I18nProvider, useI18n, type Lang } from "../lib/i18n";
import { LanguageSwitcher } from "../components/language-switcher";
import { SurfConditions } from "../components/surf-conditions";
import { FRMSAgenda } from "../components/frms-agenda";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "Rabat Surf Club | Surf Lessons with Coach Jalal at Plage des Oudayas",
      },
      {
        name: "description",
        content:
          "Book surf lessons at Rabat Surf Club on Plage des Oudayas. Coach Jalal and his experienced crew teach beginners and intermediate surfers with all equipment included.",
      },
      {
        property: "og:title",
        content: "Rabat Surf Club | Surf Lessons with Coach Jalal",
      },
      {
        property: "og:description",
        content:
          "Surf lessons at Plage des Oudayas in Rabat. Equipment included, small groups, and personalized coaching.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const whatsappNumber = "212661654362";
const whatsappMessage = "Bonjour Rabat Surf Club 👋 Je souhaite réserver un cours de surf à la Plage des Oudayas. Pouvez-vous me renseigner sur les disponibilités et les formules ?";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
const waverickLink = "https://www.waverick.com/adventures/rabat-surf-club";
const facebookLink = "https://www.facebook.com/rabatsurfclub";
const instagramLink = "https://www.instagram.com/rabatsurfclub/";

const whatsappMessages: Partial<Record<Lang, string>> = {
  en: "Hi Rabat Surf Club 👋 I would like to book a surf lesson at Plage des Oudayas. Could you tell me about availability and packages?",
  fr: "Bonjour Rabat Surf Club 👋 Je souhaite réserver un cours de surf à la Plage des Oudayas. Pouvez-vous me renseigner sur les disponibilités et les formules ?",
  ar: "مرحباً نادي الرباط لركوب الأمواج 👋 أرغب في حجز درس ركوب أمواج في شاطئ الأوداية. هل يمكنكم إخباري بالمواعيد والباقات المتاحة؟",
  es: "Hola Rabat Surf Club 👋 Quiero reservar una clase de surf en la Playa de los Oudayas. ¿Podrían informarme sobre disponibilidad y paquetes?",
  de: "Hallo Rabat Surf Club 👋 Ich möchte eine Surfstunde an der Plage des Oudayas buchen. Können Sie mir Verfügbarkeit und Pakete nennen?",
  it: "Ciao Rabat Surf Club 👋 Vorrei prenotare una lezione di surf alla Plage des Oudayas. Potete dirmi disponibilità e pacchetti?",
  pt: "Olá Rabat Surf Club 👋 Gostaria de reservar uma aula de surf na Praia dos Oudayas. Podem informar-me sobre disponibilidade e pacotes?",
  nl: "Hallo Rabat Surf Club 👋 Ik wil graag een sur les boeken bij Plage des Oudayas. Kunnen jullie mij informeren over beschikbaarheid en pakketten?",
  tr: "Merhaba Rabat Surf Club 👋 Oudayas Plajı'nda sörf dersi rezervasyonu yapmak istiyorum. Müsaitlik ve paketler hakkında bilgi verebilir misiniz?",
  zh: "你好 Rabat Surf Club 👋 我想预订乌达雅斯海滩的冲浪课程。可以告诉我可预约时间和套餐吗？",
  ja: "こんにちは Rabat Surf Club 👋 ウダヤスビーチでサーフィンレッスンを予約したいです。空き状況とパッケージを教えてください。",
  ko: "안녕하세요 Rabat Surf Club 👋 우다야스 해변에서 서핑 레슨을 예약하고 싶습니다. 예약 가능 시간과 패키지를 알려주세요."
};

const packagePrices = [
  { price: "150", unit: "DHS", highlighted: false },
  { price: "500", unit: "DHS", highlighted: true },
  { price: "700", unit: "DHS", highlighted: false },
];

const highlightIcons = [Shield, Music, Award, Sun];

function HeroSlideshow() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const slides = [heroImage, heroImageTwo, heroImageThree];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-950" aria-label={t.common.heroSlideshow}>
      {slides.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          width={3840}
          height={2160}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out ${
            index === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
          }`}
          aria-hidden={index !== active}
        />
      ))}
    </div>
  );
}

function Index() {
  return (
    <I18nProvider>
      <Page />
    </I18nProvider>
  );
}

function Page() {
  const { t, lang } = useI18n();
  const [navOnDark, setNavOnDark] = useState(true);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main [data-nav-theme]")
    );

    const updateNavTheme = () => {
      const navProbeY = 78;
      let activeTheme = "dark";

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navProbeY && rect.bottom > navProbeY) {
          activeTheme = section.dataset.navTheme ?? "dark";
          break;
        }
      }

      setNavOnDark(activeTheme === "dark");
    };

    updateNavTheme();
    window.addEventListener("scroll", updateNavTheme, { passive: true });
    window.addEventListener("resize", updateNavTheme);
    return () => {
      window.removeEventListener("scroll", updateNavTheme);
      window.removeEventListener("resize", updateNavTheme);
    };
  }, []);

  useEffect(() => {
    document.title = `${t.header.brand} | ${t.hero.title}`;
  }, [lang, t.header.brand, t.hero.title]);

  const localizedWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessages[lang] ?? whatsappMessages["en"]!,
  )}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-0 bg-transparent transition-colors duration-500 ease-out ${
          navOnDark ? "text-white" : "text-slate-900"
        }`}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        >
          <a href="/" className="group flex items-center gap-3">
            <img
              src={clubLogo}
              alt="Rabat Surf Club"
              className={`h-12 w-12 rounded-full border-2 bg-white object-cover shadow-lg transition-colors duration-500 ${navOnDark ? "border-white/80" : "border-slate-900/20"}`}
              width={48}
              height={48}
            />
            <div className="leading-none">
              <span className="block text-lg font-extrabold tracking-tight sm:text-xl">{t.header.brand}</span>
              <span className={`mt-1 block text-xs font-medium transition-colors duration-500 ${navOnDark ? "text-white/80" : "text-slate-500"}`}>{t.hero.location}</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
            <a href="#lessons" className={`transition-colors duration-500 hover:text-cyan-600 ${navOnDark ? "" : ""}`}>{t.nav.lessons}</a>
            <a href="#about" className={`transition-colors duration-500 hover:text-cyan-600 ${navOnDark ? "" : ""}`}>{t.nav.about}</a>
            <a href="#spot" className={`transition-colors duration-500 ${navOnDark ? "hover:text-cyan-200" : "hover:text-cyan-600"}`}>{t.nav.spot}</a>
            <a href="#conditions" className={`transition-colors duration-500 ${navOnDark ? "hover:text-cyan-200" : "hover:text-cyan-600"}`}>{t.nav.conditions}</a>
            <a href="#agenda" className={`transition-colors duration-500 ${navOnDark ? "hover:text-cyan-200" : "hover:text-cyan-600"}`}>{t.nav.agenda}</a>
            <a href="#contact" className={`transition-colors duration-500 ${navOnDark ? "hover:text-cyan-200" : "hover:text-cyan-600"}`}>{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://ig.me/m/rabatsurfclub"
              target="_blank"
              rel="noreferrer"
              aria-label={t.common.instagramBook}
              className={`hidden items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-bold backdrop-blur-md transition-colors duration-500 sm:inline-flex ${navOnDark ? "border-white/40 bg-black/10 text-white hover:bg-white/15" : "border-slate-900/15 bg-white/20 text-slate-900 hover:bg-white/40"}`}
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              <span>{t.common.instagram}</span>
            </a>
            <div className={`rounded-full border backdrop-blur-md transition-colors duration-500 ${navOnDark ? "border-white/35 bg-black/10" : "border-slate-900/10 bg-white/20"}`}>
              <LanguageSwitcher />
            </div>
            <a
              href={localizedWhatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0aa57d] px-4 py-2.5 text-sm font-bold shadow-lg shadow-black/10 transition hover:bg-[#078d6c] sm:px-5"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t.header.bookLong}</span>
              <span className="sm:hidden">{t.header.bookShort}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Cinematic 4K photo slideshow hero */}
        <section data-nav-theme="dark" className="relative h-[72svh] min-h-[600px] max-h-[820px] overflow-hidden bg-slate-950 text-white md:h-[56.25vw] md:min-h-0">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />

          <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {t.hero.location}
              </div>
              <h1 className="max-w-3xl text-balance text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                {t.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
                {t.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={localizedWhatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0aa57d] px-6 py-3.5 text-base font-bold shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#078d6c]"
                >
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                  {t.hero.bookLesson}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#lessons"
                  className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/10 px-6 py-3.5 text-base font-bold backdrop-blur-md transition hover:bg-white/15"
                >
                  {t.hero.viewPackages}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Club introduction */}
        <section data-nav-theme="light" className="relative overflow-hidden bg-[#fbf8f1] py-20 sm:py-24">
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1.45fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-700">{t.common.club}</p>
                <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                  {t.intro.title}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">{t.intro.text}</p>
                <ul className="mt-7 space-y-3">
                  {t.intro.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700 sm:text-base">
                      <Waves className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#lessons"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-900/10 transition hover:bg-sky-800"
                >
                  {t.hero.viewPackages}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {t.intro.highlights.map(({ title, text }, i) => {
                  const Icon = highlightIcons[i] ?? Shield;
                  return (
                    <div
                      key={title}
                      className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-[0_16px_50px_rgba(16,40,60,0.07)] transition hover:-translate-y-1"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* About us */}
        <section id="about" data-nav-theme="light" className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/10">
                <img
                  src={heroImageTwo}
                  alt={t.about.imageAlt}
                  width={3840}
                  height={2160}
                  loading="lazy"
                  className="h-[360px] w-full object-cover sm:h-[460px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">{t.about.since}</p>
                  <p className="mt-1 text-5xl font-black tracking-tight">2008</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-700">{t.nav.about}</p>
                <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">{t.about.title}</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t.about.text}</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {t.about.values.map(({ title, text }) => (
                    <div key={title} className="rounded-2xl border border-slate-200 bg-[#fbf8f1] p-5">
                      <h3 className="font-extrabold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-7 text-sm font-semibold text-slate-500">{t.about.location}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section id="lessons" data-nav-theme="light" className="bg-[#f4ead9] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-700">{t.header.brand}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{t.pricing.title}</h2>
              <p className="mt-4 text-lg text-slate-600">{t.pricing.subtitle}</p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {t.pricing.packages.map((pkg, i) => {
                const meta = packagePrices[i] ?? packagePrices[0]!;
                return (
                  <article
                    key={pkg.name}
                    className={`relative flex flex-col rounded-[1.75rem] border bg-white p-7 shadow-[0_18px_50px_rgba(40,50,40,0.08)] ${
                      meta.highlighted ? "border-sky-600 ring-2 ring-sky-600/10" : "border-slate-200"
                    }`}
                  >
                    {meta.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-700 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-white">
                        {t.pricing.mostPopular}
                      </span>
                    )}
                    <h3 className="text-xl font-extrabold text-slate-900">{pkg.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{pkg.duration}</p>
                    <div className="mt-5 flex items-end gap-1">
                      <span className="text-5xl font-black tracking-tight text-slate-950">{meta.price}</span>
                      <span className="pb-1 text-sm font-bold text-slate-500">{meta.unit}</span>
                    </div>
                    <p className="mt-4 min-h-14 text-sm leading-6 text-slate-600">{pkg.description}</p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                          <Waves className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={localizedWhatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                        meta.highlighted
                          ? "bg-sky-700 text-white hover:bg-sky-800"
                          : "border border-sky-700 bg-white text-sky-800 hover:bg-sky-50"
                      }`}
                    >
                      {t.pricing.bookPackage}
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Spot + map */}
        <section id="spot" data-nav-theme="light" className="bg-[#fbf8f1] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[380px] overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-900/5">
                <iframe
                  title={t.common.mapTitle}
                  src="https://maps.google.com/maps?q=34.0327982,-6.8379037&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <a
                    href="https://www.google.com/maps?cid=3963894059508003290"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-lg"
                  >
                    {t.spot.openInGoogleMaps}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://waze.com/ul?ll=34.0327982,-6.8379037&navigate=yes"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-lg"
                  >
                    {t.spot.openInWaze}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_50px_rgba(16,40,60,0.07)] sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                  <Waves className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{t.spot.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{t.spot.text}</p>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {t.spot.stats.map(({ label, value }) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SurfConditions />

        <FRMSAgenda />

        {/* Contact CTA */}
        <section id="contact" data-nav-theme="dark" className="relative overflow-hidden bg-[#087f95] text-white">
          <div className="absolute -left-16 bottom-0 text-[13rem] leading-none text-white/5">〰</div>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-100">{t.nav.contact}</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{t.contact.title}</h2>
                <p className="mt-4 max-w-xl text-lg leading-7 text-white/80">{t.contact.text}</p>
                <div className="mt-7 space-y-3">
                  <a
                    href="https://www.google.com/maps?cid=3963894059508003290"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold">{t.contact.address}</span>
                  </a>
                  <a href="tel:+212661654362" className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold">+212 6 61 65 43 62</span>
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a href={localizedWhatsappLink} target="_blank" rel="noreferrer" className="group rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-1">
                  <MessageCircle className="h-9 w-9 text-[#18a878]" aria-hidden="true" />
                  <p className="mt-5 text-lg font-black">{t.contact.whatsapp}</p>
                  <p className="mt-1 text-sm text-slate-500">{t.common.whatsappCard}</p>
                  <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a href={instagramLink} target="_blank" rel="noreferrer" className="group rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-1">
                  <Instagram className="h-9 w-9 text-pink-600" aria-hidden="true" />
                  <p className="mt-5 text-lg font-black">{t.common.instagram}</p>
                  <p className="mt-1 text-sm text-slate-500">{t.common.instagramCard}</p>
                  <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a href={waverickLink} target="_blank" rel="noreferrer" className="group rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-1">
                  <Waves className="h-9 w-9 text-sky-700" aria-hidden="true" />
                  <p className="mt-5 text-lg font-black">Waverick</p>
                  <p className="mt-1 text-sm text-slate-500">{t.contact.bookOnline}</p>
                  <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a href={facebookLink} target="_blank" rel="noreferrer" className="group rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl transition hover:-translate-y-1">
                  <Facebook className="h-9 w-9 text-blue-600" aria-hidden="true" />
                  <p className="mt-5 text-lg font-black">Facebook</p>
                  <p className="mt-1 text-sm text-slate-500">{t.contact.sendMessage}</p>
                  <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={clubLogo} alt="Rabat Surf Club" className="h-9 w-9 rounded-full bg-white" width={36} height={36} />
            <div>
              <p className="font-bold">{t.header.brand}</p>
              <p className="text-xs text-white/50">{t.hero.location}</p>
            </div>
          </div>
          <p className="text-white/50">© {new Date().getFullYear()} Rabat Surf Club. {t.footer.rights}</p>
          <div className="flex items-center gap-5 text-white/70">
            <a href={localizedWhatsappLink} target="_blank" rel="noreferrer" className="hover:text-white">{t.footer.whatsapp}</a>
            <a href={instagramLink} target="_blank" rel="noreferrer" className="hover:text-white">{t.common.instagram}</a>
            <a href={facebookLink} target="_blank" rel="noreferrer" className="hover:text-white">{t.footer.facebook}</a>
            <a href={waverickLink} target="_blank" rel="noreferrer" className="hover:text-white">{t.footer.waverick}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
