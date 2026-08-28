import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

import appCss from "../styles.css?url";


const SYSTEM_COPY: Record<string, { notFoundTitle: string; notFoundText: string; home: string; loadTitle: string; loadText: string; retry: string }> = {
  en:{notFoundTitle:"Page not found",notFoundText:"The page you’re looking for doesn’t exist or has been moved.",home:"Go home",loadTitle:"This page didn’t load",loadText:"Something went wrong on our end. You can try again or head back home.",retry:"Try again"},
  fr:{notFoundTitle:"Page introuvable",notFoundText:"La page que vous recherchez n’existe pas ou a été déplacée.",home:"Accueil",loadTitle:"Cette page ne s’est pas chargée",loadText:"Une erreur s’est produite. Vous pouvez réessayer ou retourner à l’accueil.",retry:"Réessayer"},
  ar:{notFoundTitle:"الصفحة غير موجودة",notFoundText:"الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",home:"العودة إلى الرئيسية",loadTitle:"تعذر تحميل الصفحة",loadText:"حدث خطأ من جانبنا. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.",retry:"حاول مرة أخرى"},
  es:{notFoundTitle:"Página no encontrada",notFoundText:"La página que buscas no existe o ha sido trasladada.",home:"Ir al inicio",loadTitle:"No se pudo cargar la página",loadText:"Algo salió mal. Puedes intentarlo de nuevo o volver al inicio.",retry:"Intentar de nuevo"},
  de:{notFoundTitle:"Seite nicht gefunden",notFoundText:"Die gesuchte Seite existiert nicht oder wurde verschoben.",home:"Startseite",loadTitle:"Diese Seite wurde nicht geladen",loadText:"Etwas ist schiefgelaufen. Du kannst es erneut versuchen oder zur Startseite zurückkehren.",retry:"Erneut versuchen"},
  it:{notFoundTitle:"Pagina non trovata",notFoundText:"La pagina che cerchi non esiste o è stata spostata.",home:"Torna alla home",loadTitle:"La pagina non è stata caricata",loadText:"Si è verificato un problema. Puoi riprovare o tornare alla home.",retry:"Riprova"},
  pt:{notFoundTitle:"Página não encontrada",notFoundText:"A página que procura não existe ou foi movida.",home:"Ir para o início",loadTitle:"Esta página não carregou",loadText:"Ocorreu um problema. Pode tentar novamente ou voltar ao início.",retry:"Tentar novamente"},
  nl:{notFoundTitle:"Pagina niet gevonden",notFoundText:"De pagina die je zoekt bestaat niet of is verplaatst.",home:"Naar home",loadTitle:"Deze pagina kon niet worden geladen",loadText:"Er ging iets mis. Probeer het opnieuw of ga terug naar de homepagina.",retry:"Opnieuw proberen"},
  tr:{notFoundTitle:"Sayfa bulunamadı",notFoundText:"Aradığınız sayfa mevcut değil veya taşınmış.",home:"Ana sayfaya git",loadTitle:"Sayfa yüklenemedi",loadText:"Bir sorun oluştu. Tekrar deneyebilir veya ana sayfaya dönebilirsiniz.",retry:"Tekrar dene"},
  zh:{notFoundTitle:"找不到页面",notFoundText:"你要访问的页面不存在或已被移动。",home:"返回首页",loadTitle:"页面加载失败",loadText:"发生了一些问题。你可以重试或返回首页。",retry:"重试"},
  ja:{notFoundTitle:"ページが見つかりません",notFoundText:"お探しのページは存在しないか、移動されました。",home:"ホームへ",loadTitle:"ページを読み込めませんでした",loadText:"問題が発生しました。もう一度試すか、ホームに戻ってください。",retry:"もう一度試す"},
  ko:{notFoundTitle:"페이지를 찾을 수 없습니다",notFoundText:"찾으시는 페이지가 존재하지 않거나 이동되었습니다.",home:"홈으로",loadTitle:"페이지를 불러오지 못했습니다",loadText:"문제가 발생했습니다. 다시 시도하거나 홈으로 돌아갈 수 있습니다.",retry:"다시 시도"},
};

function getSystemCopy(){
  if(typeof window === "undefined") return SYSTEM_COPY.en;
  return SYSTEM_COPY[localStorage.getItem("rsc-lang") || "en"] || SYSTEM_COPY.en;
}

function NotFoundComponent() {
  const c = getSystemCopy();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{c.notFoundTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {c.notFoundText}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {c.home}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const c = getSystemCopy();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {c.loadTitle}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {c.loadText}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {c.retry}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {c.home}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rabat Surf Club" },
      {
        name: "description",
        content:
          "Surf lessons in Rabat with Coach Jalal at Plage des Oudayas. Beginner and intermediate packages with all equipment included.",
      },
      { property: "og:title", content: "Rabat Surf Club" },
      {
        property: "og:description",
        content:
          "Surf lessons in Rabat with Coach Jalal at Plage des Oudayas. Beginner and intermediate packages with all equipment included.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rabat Surf Club" },
      {
        name: "twitter:description",
        content:
          "Surf lessons in Rabat with Coach Jalal at Plage des Oudayas. Beginner and intermediate packages with all equipment included.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Zen+Maru+Gothic:wght@400;500;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lang = localStorage.getItem("rsc-lang") || "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
