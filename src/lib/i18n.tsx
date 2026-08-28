import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang =
  | "en" | "fr" | "ar" | "es" | "de" | "it" | "pt"
  | "nl" | "tr" | "zh" | "ja" | "ko";

export const LANGUAGES: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "it", label: "Italiano", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
  { code: "nl", label: "Nederlands", dir: "ltr" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "ja", label: "日本語", dir: "ltr" },
  { code: "ko", label: "한국어", dir: "ltr" },
];

const STORAGE_KEY = "rsc-lang";

// --- Translation dictionary -------------------------------------------
// Every user-facing string on the page lives here, keyed by a dotted path.
// Arrays (packages, highlights, etc.) are indexed objects so each language
// can supply the same shape.

const baseDict = {
  en: {
    common: { club: "Our Club", instagramBook: "Book via Instagram", instagram: "Instagram", whatsappCard: "Pre-filled booking message", instagramCard: "See our vibes and message us by DM", rabatWay: "The Rabat Way", mapTitle: "Rabat Surf Club location at Plage des Oudayas", heroSlideshow: "Rabat Surf Club surf experience slideshow" },
    nav: { lessons: "Lessons", about: "About us", spot: "The Spot", conditions: "Conditions", agenda: "Agenda", contact: "Contact" },
    header: { bookShort: "Book", bookLong: "Book on WhatsApp", brand: "Rabat Surf Club" },
    hero: {
      location: "Plage des Oudayas, Rabat",
      title: "Catch your first wave with Coach Jalal",
      subtitle:
        "Friendly surf lessons at Rabat Surf Club for beginners and intermediate surfers. All equipment included, small groups, and personalized coaching on one of Morocco's most welcoming city beaches.",
      bookLesson: "Book a lesson",
      viewPackages: "View packages",
    },
    intro: {
      title: "Learn with an experienced local crew",
      text: "Coach Jalal heads the surf lessons at Rabat Surf Club, right on Plage des Oudayas. He and his team are known for their welcoming energy, great music, and clear feedback that helps both first-timers and intermediate surfers improve fast.",
      list: [
        "All essential gear included: surfboard, leash & wetsuit",
        "1 coach per 6 adults or 4 children",
        "Lessons tailored to your level and goals",
        "Safe, shallow take-off zone near the pier",
      ],
      highlights: [
        {
          title: "Small groups",
          text: "1 coach for up to 6 adults or 4 children — safety and attention come first.",
        },
        {
          title: "Great vibes",
          text: "Welcoming crew, good music, and a relaxed atmosphere on the sand.",
        },
        {
          title: "Tailored feedback",
          text: "Coaching adapted to absolute beginners and progressive intermediates.",
        },
        {
          title: "Ideal spot",
          text: "Gentle, consistent waves at Plage des Oudayas, protected by the pier.",
        },
      ],
    },
    about: {
      since: "Surfing in Rabat since",
      title: "A club built around the ocean, community and progression",
      text: "Rabat Surf Club started in 2008 at Plage des Oudayas, with a simple goal: make surfing accessible, welcoming and fun in Rabat. Today, the club keeps that local spirit at the heart of every session, from a first wave to the next step in your surfing journey.",
      location: "Plage des Oudayas, Rabat, Morocco",
      imageAlt: "Surfer riding a wave at Plage des Oudayas in Rabat",
      values: [
        { title: "Since 2008", text: "A long-standing local surf presence in Rabat." },
        { title: "Local spirit", text: "Learn directly on the beach from a crew that knows Oudayas." },
        { title: "Progress together", text: "Build confidence, technique and a real connection with the ocean." },
      ],
    },
    pricing: {
      title: "Lesson packages",
      subtitle: "Everything you need is included. Just show up ready to surf.",
      mostPopular: "Most popular",
      bookPackage: "Book this package",
      packages: [
        {
          name: "Single Lesson",
          duration: "2 hours",
          description: "Perfect for first-timers or visitors who want to try surfing in Rabat.",
          features: [
            "2-hour session",
            "All equipment included",
            "Beach safety briefing",
            "Personal feedback",
          ],
        },
        {
          name: "6-Lesson Package",
          duration: "1.5 hours / lesson",
          description: "Build solid foundations with a progressive six-lesson plan.",
          features: [
            "6 coached sessions",
            "Board, leash & wetsuit",
            "Small group ratio",
            "Technique drills",
          ],
        },
        {
          name: "10-Lesson Package",
          duration: "1.5 hours / lesson",
          description: "The best value for surfers committed to improving quickly.",
          features: [
            "10 coached sessions",
            "All equipment included",
            "Style & turn coaching",
            "Pop-up speed work",
          ],
        },
      ],
    },
    spot: {
      openInGoogleMaps: "Open in Google Maps",
      openInWaze: "Open in Waze",
      label: "Plage des Oudayas",
      title: "Why Oudayas is the perfect beginner spot",
      text: "Plage des Oudayas sits inside the shelter of Rabat's historic pier. The result is consistent, gentle waves that make it easy to paddle out, read the lineup, and focus on improving your style, turns, or pop-up speed.",
      stats: [
        { label: "Wave type", value: "Gentle beach break" },
        { label: "Best for", value: "Beginners & intermediates" },
        { label: "Water temp", value: "Wetsuit provided" },
        { label: "Vibe", value: "Relaxed & welcoming" },
      ],
    },
    conditions: {
      title: "This week's surf conditions",
      subtitle: "Live wave, wind and weather data for Plage des Oudayas, updated automatically.",
      loading: "Loading live forecast…",
      error: "Couldn't load the forecast right now. Please try again in a moment.",
      waveHeight: "Wave height",
      wavePeriod: "Wave period",
      wind: "Wind",
      airTemp: "Air temp",
      rating: { good: "Good", fair: "Fair", poor: "Choppy" },
      disclaimer:
        "Automated forecast from Open-Meteo — a helpful guide, not a guarantee. Always check conditions with the crew before paddling out.",
      today: "Today",
    },
    contact: {
      title: "Ready to surf?",
      text: "Message Coach Jalal directly on WhatsApp or book through Waverick Adventures. Walk-ins at the club are welcome too.",
      clubName: "Rabat Surf Club (Club N°1)",
      address: "Plage des Oudayas, Rabat, Morocco",
      alsoAvailable: "Also available: +212 6 61 65 43 62",
      whatsapp: "Book on WhatsApp",
      fastestReply: "Fastest reply",
      waverick: "Waverick Adventures",
      bookOnline: "Book online",
      facebook: "Facebook Page",
      sendMessage: "Send a message",
    },
    footer: {
      rights: "All rights reserved.",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      waverick: "Waverick",
    },
  },
  fr: {
    common: { club: "Notre Club", instagramBook: "Réserver via Instagram", instagram: "Instagram", whatsappCard: "Message pré-rempli pour réserver", instagramCard: "Voir nos vibes et nous écrire en DM", rabatWay: "La façon de Rabat", mapTitle: "Rabat Surf Club à la Plage des Oudayas", heroSlideshow: "Diaporama de l’expérience surf du Rabat Surf Club" },
    nav: { lessons: "Cours", about: "À propos", spot: "Le Spot", conditions: "Conditions", agenda: "Agenda", contact: "Contact" },
    header: { bookShort: "Réserver", bookLong: "Réserver sur WhatsApp", brand: "Rabat Surf Club" },
    hero: {
      location: "Plage des Oudayas, Rabat",
      title: "Prenez votre première vague avec Coach Jalal",
      subtitle:
        "Cours de surf conviviaux au Rabat Surf Club pour débutants et surfeurs intermédiaires. Équipement inclus, petits groupes et coaching personnalisé sur l'une des plages urbaines les plus accueillantes du Maroc.",
      bookLesson: "Réserver un cours",
      viewPackages: "Voir les formules",
    },
    intro: {
      title: "Apprenez avec une équipe locale expérimentée",
      text: "Coach Jalal dirige les cours de surf du Rabat Surf Club, directement sur la Plage des Oudayas. Lui et son équipe sont reconnus pour leur énergie chaleureuse, leur bonne ambiance musicale et des retours clairs qui aident aussi bien les débutants que les surfeurs intermédiaires à progresser rapidement.",
      list: [
        "Tout l'équipement essentiel inclus : planche, leash et combinaison",
        "1 coach pour 6 adultes ou 4 enfants",
        "Cours adaptés à votre niveau et à vos objectifs",
        "Zone de départ sûre et peu profonde près de la jetée",
      ],
      highlights: [
        {
          title: "Petits groupes",
          text: "1 coach pour 6 adultes ou 4 enfants maximum — la sécurité et l'attention avant tout.",
        },
        {
          title: "Bonne ambiance",
          text: "Équipe accueillante, bonne musique et atmosphère détendue sur le sable.",
        },
        {
          title: "Suivi personnalisé",
          text: "Un coaching adapté aux débutants absolus comme aux intermédiaires en progression.",
        },
        {
          title: "Spot idéal",
          text: "Vagues douces et régulières à la Plage des Oudayas, protégées par la jetée.",
        },
      ],
    },
    about: {
      since: "Le surf à Rabat depuis",
      title: "Un club construit autour de l’océan, du partage et de la progression",
      text: "Le Rabat Surf Club a commencé en 2008 sur la Plage des Oudayas, avec un objectif simple : rendre le surf accessible, convivial et amusant à Rabat. Aujourd’hui, le club garde cet esprit local au cœur de chaque séance, de la première vague à la prochaine étape de votre progression.",
      location: "Plage des Oudayas, Rabat, Maroc",
      imageAlt: "Surfeur sur une vague à la Plage des Oudayas à Rabat",
      values: [
        { title: "Depuis 2008", text: "Une présence surf locale de longue date à Rabat." },
        { title: "Esprit local", text: "Apprenez directement sur la plage avec une équipe qui connaît Oudayas." },
        { title: "Progresser ensemble", text: "Gagnez en confiance, en technique et en connexion avec l’océan." },
      ],
    },
    pricing: {
      title: "Formules de cours",
      subtitle: "Tout est inclus. Il ne vous reste qu'à venir surfer.",
      mostPopular: "Le plus populaire",
      bookPackage: "Réserver cette formule",
      packages: [
        {
          name: "Cours à l'unité",
          duration: "2 heures",
          description: "Idéal pour les débutants ou visiteurs qui veulent essayer le surf à Rabat.",
          features: [
            "Session de 2 heures",
            "Équipement inclus",
            "Briefing sécurité plage",
            "Retour personnalisé",
          ],
        },
        {
          name: "Formule 6 cours",
          duration: "1h30 / cours",
          description: "Construisez des bases solides avec un programme progressif de six cours.",
          features: [
            "6 séances coachées",
            "Planche, leash et combinaison",
            "Petits groupes",
            "Exercices techniques",
          ],
        },
        {
          name: "Formule 10 cours",
          duration: "1h30 / cours",
          description: "Le meilleur rapport qualité-prix pour progresser rapidement.",
          features: [
            "10 séances coachées",
            "Équipement inclus",
            "Coaching style et virages",
            "Travail du pop-up",
          ],
        },
      ],
    },
    spot: {
      openInGoogleMaps: "Ouvrir dans Google Maps",
      openInWaze: "Ouvrir dans Waze",
      label: "Plage des Oudayas",
      title: "Pourquoi Oudayas est le spot idéal pour débuter",
      text: "La Plage des Oudayas se trouve à l'abri de la jetée historique de Rabat. Résultat : des vagues douces et régulières qui facilitent la rame, la lecture du line-up et l'amélioration de votre style, de vos virages ou de la vitesse de votre pop-up.",
      stats: [
        { label: "Type de vague", value: "Beach break doux" },
        { label: "Idéal pour", value: "Débutants et intermédiaires" },
        { label: "Température de l'eau", value: "Combinaison fournie" },
        { label: "Ambiance", value: "Détendue et conviviale" },
      ],
    },
    conditions: {
      title: "Conditions de surf cette semaine",
      subtitle:
        "Données en direct sur les vagues, le vent et la météo à la Plage des Oudayas, mises à jour automatiquement.",
      loading: "Chargement des prévisions en direct…",
      error: "Impossible de charger les prévisions pour le moment. Réessayez dans un instant.",
      waveHeight: "Hauteur de vague",
      wavePeriod: "Période de vague",
      wind: "Vent",
      airTemp: "Température de l'air",
      rating: { good: "Bon", fair: "Correct", poor: "Agité" },
      disclaimer:
        "Prévisions automatiques d'Open-Meteo — un guide utile, sans garantie. Vérifiez toujours les conditions avec l'équipe avant de ramer.",
      today: "Aujourd'hui",
    },
    contact: {
      title: "Prêt à surfer ?",
      text: "Contactez directement Coach Jalal sur WhatsApp ou réservez via Waverick Adventures. Les visites sans réservation sont aussi les bienvenues.",
      clubName: "Rabat Surf Club (Club N°1)",
      address: "Plage des Oudayas, Rabat, Maroc",
      alsoAvailable: "Également disponible : +212 6 61 65 43 62",
      whatsapp: "Réserver sur WhatsApp",
      fastestReply: "Réponse la plus rapide",
      waverick: "Waverick Adventures",
      bookOnline: "Réserver en ligne",
      facebook: "Page Facebook",
      sendMessage: "Envoyer un message",
    },
    footer: {
      rights: "Tous droits réservés.",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      waverick: "Waverick",
    },
  },
  ar: {
    common: { club: "نادينا", instagramBook: "الحجز عبر إنستغرام", instagram: "إنستغرام", whatsappCard: "رسالة جاهزة للحجز", instagramCard: "شاهد أجواءنا وتواصل معنا عبر الرسائل", rabatWay: "أسلوب الرباط", mapTitle: "موقع Rabat Surf Club في شاطئ الأوداية", heroSlideshow: "عرض صور تجربة ركوب الأمواج في نادي الرباط" },
    nav: { lessons: "الدروس", about: "من نحن", spot: "الموقع", conditions: "أحوال الأمواج", agenda: "الأجندة", contact: "اتصل بنا" },
    header: { bookShort: "احجز", bookLong: "احجز عبر واتساب", brand: "نادي الرباط لركوب الأمواج" },
    hero: {
      location: "شاطئ الأوداية، الرباط",
      title: "استمتع بأول موجة لك مع المدرب جلال",
      subtitle:
        "دروس ركوب أمواج ودّية في نادي الرباط لركوب الأمواج للمبتدئين والمتوسطين. جميع المعدات مشمولة، مجموعات صغيرة، وتدريب شخصي على أحد أكثر شواطئ المدن ترحيباً في المغرب.",
      bookLesson: "احجز درساً",
      viewPackages: "عرض الباقات",
    },
    intro: {
      title: "تعلّم مع فريق محلي ذي خبرة",
      text: "يقود المدرب جلال دروس ركوب الأمواج في نادي الرباط لركوب الأمواج، مباشرة على شاطئ الأوداية. يُعرف هو وفريقه بأجوائهم الترحيبية وموسيقاهم الرائعة وملاحظاتهم الواضحة التي تساعد المبتدئين والمتوسطين على التقدم بسرعة.",
      list: [
        "جميع المعدات الأساسية مشمولة: لوح ركمجة، حبل ربط وبدلة غطس",
        "مدرب واحد لكل 6 بالغين أو 4 أطفال",
        "دروس مصممة حسب مستواك وأهدافك",
        "منطقة انطلاق آمنة وضحلة قرب الميناء",
      ],
      highlights: [
        {
          title: "مجموعات صغيرة",
          text: "مدرب واحد لما يصل إلى 6 بالغين أو 4 أطفال — السلامة والاهتمام أولاً.",
        },
        { title: "أجواء رائعة", text: "فريق مرحّب، موسيقى جميلة، وأجواء هادئة على الرمال." },
        { title: "ملاحظات مخصصة", text: "تدريب مُكيّف للمبتدئين المطلقين والمتوسطين المتقدمين." },
        {
          title: "موقع مثالي",
          text: "أمواج هادئة ومنتظمة في شاطئ الأوداية، محمية بواسطة الميناء.",
        },
      ],
    },
    about: {
      since: "ركوب الأمواج في الرباط منذ",
      title: "نادٍ بُني حول البحر وروح المجتمع والتطور",
      text: "بدأ نادي الرباط لركوب الأمواج سنة 2008 في شاطئ الأوداية، بهدف بسيط: جعل رياضة ركوب الأمواج متاحة وممتعة ومرحبة بالجميع في الرباط. واليوم يحافظ النادي على هذه الروح المحلية في قلب كل حصة، من أول موجة إلى الخطوة التالية في رحلتك مع ركوب الأمواج.",
      location: "شاطئ الأوداية، الرباط، المغرب",
      imageAlt: "راكب أمواج على موجة في شاطئ الأوداية بالرباط",
      values: [
        { title: "منذ 2008", text: "حضور محلي راسخ لرياضة ركوب الأمواج في الرباط." },
        { title: "روح محلية", text: "تعلّم مباشرة على الشاطئ مع فريق يعرف الأوداية جيداً." },
        { title: "نتطور معاً", text: "ابنِ الثقة والتقنية وعلاقة حقيقية مع البحر." },
      ],
    },
    pricing: {
      title: "باقات الدروس",
      subtitle: "كل ما تحتاجه مشمول. فقط احضر جاهزاً لركوب الأمواج.",
      mostPopular: "الأكثر طلباً",
      bookPackage: "احجز هذه الباقة",
      packages: [
        {
          name: "درس واحد",
          duration: "ساعتان",
          description: "مثالي للمبتدئين أو الزوار الراغبين في تجربة ركوب الأمواج في الرباط.",
          features: [
            "جلسة لمدة ساعتين",
            "جميع المعدات مشمولة",
            "إحاطة أمان الشاطئ",
            "ملاحظات شخصية",
          ],
        },
        {
          name: "باقة 6 دروس",
          duration: "ساعة ونصف / درس",
          description: "ابنِ أسساً متينة مع خطة تدريجية من ستة دروس.",
          features: ["6 جلسات مدرَّبة", "لوح، حبل ربط وبدلة غطس", "مجموعات صغيرة", "تمارين تقنية"],
        },
        {
          name: "باقة 10 دروس",
          duration: "ساعة ونصف / درس",
          description: "أفضل قيمة للراغبين في التقدم بسرعة.",
          features: [
            "10 جلسات مدرَّبة",
            "جميع المعدات مشمولة",
            "تدريب على الأسلوب والمناورات",
            "العمل على سرعة النهوض",
          ],
        },
      ],
    },
    spot: {
      openInGoogleMaps: "افتح في خرائط جوجل",
      openInWaze: "افتح في Waze",
      label: "شاطئ الأوداية",
      title: "لماذا الأوداية هو الموقع المثالي للمبتدئين",
      text: "يقع شاطئ الأوداية في مأمن من الميناء التاريخي للرباط، مما ينتج عنه أمواج هادئة ومنتظمة تسهّل التجديف والقراءة والتركيز على تحسين أسلوبك ومناوراتك وسرعة نهوضك.",
      stats: [
        { label: "نوع الموجة", value: "كسر شاطئي هادئ" },
        { label: "الأنسب لـ", value: "المبتدئين والمتوسطين" },
        { label: "حرارة الماء", value: "بدلة غطس متوفرة" },
        { label: "الأجواء", value: "هادئة وودّية" },
      ],
    },
    conditions: {
      title: "أحوال الأمواج هذا الأسبوع",
      subtitle: "بيانات حية عن الأمواج والرياح والطقس في شاطئ الأوداية، تُحدَّث تلقائياً.",
      loading: "جارٍ تحميل التوقعات الحية…",
      error: "تعذّر تحميل التوقعات حالياً. يرجى المحاولة مرة أخرى بعد قليل.",
      waveHeight: "ارتفاع الموجة",
      wavePeriod: "فترة الموجة",
      wind: "الرياح",
      airTemp: "حرارة الهواء",
      rating: { good: "جيد", fair: "متوسط", poor: "مضطرب" },
      disclaimer:
        "توقعات آلية من Open-Meteo — دليل مفيد وليس ضماناً. تحقق دائماً من الأحوال مع الفريق قبل التجديف.",
      today: "اليوم",
    },
    contact: {
      title: "مستعد لركوب الأمواج؟",
      text: "راسل المدرب جلال مباشرة عبر واتساب أو احجز عبر Waverick Adventures. الزيارات دون حجز مسبق مرحّب بها أيضاً.",
      clubName: "نادي الرباط لركوب الأمواج (النادي رقم 1)",
      address: "شاطئ الأوداية، الرباط، المغرب",
      alsoAvailable: "متوفر أيضاً: 34 12 65 91 6 212+",
      whatsapp: "احجز عبر واتساب",
      fastestReply: "أسرع رد",
      waverick: "Waverick Adventures",
      bookOnline: "احجز عبر الإنترنت",
      facebook: "صفحة فيسبوك",
      sendMessage: "أرسل رسالة",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      whatsapp: "واتساب",
      facebook: "فيسبوك",
      waverick: "Waverick",
    },
  },
} satisfies Record<"en" | "fr" | "ar", unknown>;

type Dict = typeof baseDict.en;

const extraTranslations: Partial<Record<Lang, Record<string, any>>> = {
  es: {
    header: { brand: "Rabat Surf Club" },
    hero: { title: "Surf. Aprende. Vive la forma de Rabat." },
    intro: { list: ["Todo el equipo esencial incluido: tabla, leash y neopreno", "1 entrenador por cada 6 adultos o 4 niños", "Clases adaptadas a tu nivel y objetivos", "Zona de salida segura y poco profunda cerca del muelle"], highlights: [
      { title: "Grupos pequeños", text: "1 entrenador para hasta 6 adultos o 4 niños: la seguridad y la atención son lo primero." },
      { title: "Buen ambiente", text: "Equipo acogedor, buena música y ambiente relajado sobre la arena." },
      { title: "Feedback personalizado", text: "Entrenamiento adaptado a principiantes absolutos y surfistas intermedios." },
      { title: "Spot ideal", text: "Olas suaves y constantes en la Playa de los Oudayas, protegidas por el muelle." }
    ]},
    pricing: { packages: [
      { name: "Clase individual", duration: "2 horas", description: "Perfecta para principiantes o visitantes que quieren probar el surf en Rabat.", features: ["Sesión de 2 horas", "Todo el equipo incluido", "Briefing de seguridad en la playa", "Feedback personalizado"] },
      { name: "Paquete de 6 clases", duration: "1,5 horas / clase", description: "Construye una base sólida con un plan progresivo de seis clases.", features: ["6 sesiones con entrenador", "Tabla, leash y neopreno", "Grupos pequeños", "Ejercicios técnicos"] },
      { name: "Paquete de 10 clases", duration: "1,5 horas / clase", description: "La mejor opción para quienes quieren mejorar rápidamente.", features: ["10 sesiones con entrenador", "Todo el equipo incluido", "Coaching de estilo y giros", "Trabajo de velocidad del pop-up"] }
    ]},
    spot: { stats: [{label:"Tipo de ola",value:"Beach break suave"},{label:"Ideal para",value:"Principiantes e intermedios"},{label:"Temperatura del agua",value:"Neopreno incluido"},{label:"Ambiente",value:"Relajado y acogedor"}] },
    conditions: { title:"Condiciones de surf de esta semana", subtitle:"Datos de olas, viento y tiempo en directo para la Playa de los Oudayas, actualizados automáticamente.", loading:"Cargando previsión en directo…", error:"No se puede cargar la previsión ahora. Inténtalo de nuevo en un momento.", waveHeight:"Altura de ola", wavePeriod:"Periodo de ola", wind:"Viento", airTemp:"Temperatura del aire", rating:{good:"Buena",fair:"Regular",poor:"Picada"}, disclaimer:"Previsión automática de Open-Meteo: una guía útil, no una garantía. Consulta siempre las condiciones con el equipo antes de entrar al agua.", today:"Hoy" },
    contact: { title:"¿Listo para surfear?", text:"Escribe directamente al equipo por WhatsApp o reserva online. También puedes venir al club sin reserva.", clubName:"Rabat Surf Club", address:"Playa de los Oudayas, Rabat, Marruecos", alsoAvailable:"También disponible: +212 6 61 65 43 62", whatsapp:"Reservar por WhatsApp", fastestReply:"Respuesta más rápida", waverick:"Waverick Adventures", bookOnline:"Reservar online", facebook:"Página de Facebook", sendMessage:"Enviar un mensaje" },
    footer:{rights:"Todos los derechos reservados.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},
  },
  de: {
    header:{brand:"Rabat Surf Club"}, hero:{title:"Surfen. Lernen. Den Rabat-Weg leben."},
    intro:{list:["Komplette Ausrüstung inklusive: Surfbrett, Leash & Neoprenanzug","1 Coach für bis zu 6 Erwachsene oder 4 Kinder","Unterricht passend zu deinem Level und deinen Zielen","Sicherer, flacher Take-off-Bereich nahe der Mole"],highlights:[{title:"Kleine Gruppen",text:"1 Coach für bis zu 6 Erwachsene oder 4 Kinder – Sicherheit und Aufmerksamkeit stehen an erster Stelle."},{title:"Gute Stimmung",text:"Herzliches Team, gute Musik und entspannte Atmosphäre am Strand."},{title:"Individuelles Feedback",text:"Coaching für absolute Anfänger und fortgeschrittene Einsteiger."},{title:"Idealer Spot",text:"Sanfte, konstante Wellen an der Plage des Oudayas, geschützt durch die Mole."}]},
    pricing:{packages:[{name:"Einzelstunde",duration:"2 Stunden",description:"Perfekt für Anfänger oder Besucher, die Surfen in Rabat ausprobieren möchten.",features:["2-Stunden-Session","Komplette Ausrüstung inklusive","Sicherheitsbriefing am Strand","Persönliches Feedback"]},{name:"6er-Paket",duration:"1,5 Stunden / Einheit",description:"Baue mit einem progressiven Plan aus sechs Einheiten solide Grundlagen auf.",features:["6 betreute Sessions","Board, Leash & Neoprenanzug","Kleine Gruppen","Technikübungen"]},{name:"10er-Paket",duration:"1,5 Stunden / Einheit",description:"Das beste Preis-Leistungs-Verhältnis für schnelle Fortschritte.",features:["10 betreute Sessions","Komplette Ausrüstung inklusive","Coaching für Stil & Turns","Pop-up-Geschwindigkeit"]}]},
    spot:{stats:[{label:"Wellentyp",value:"Sanfter Beach Break"},{label:"Ideal für",value:"Anfänger & Fortgeschrittene"},{label:"Wassertemperatur",value:"Neoprenanzug inklusive"},{label:"Atmosphäre",value:"Entspannt & herzlich"}]},
    conditions:{title:"Surfbedingungen dieser Woche",subtitle:"Live-Daten zu Wellen, Wind und Wetter an der Plage des Oudayas, automatisch aktualisiert.",loading:"Live-Prognose wird geladen…",error:"Die Prognose konnte gerade nicht geladen werden. Bitte versuche es gleich noch einmal.",waveHeight:"Wellenhöhe",wavePeriod:"Wellenperiode",wind:"Wind",airTemp:"Lufttemperatur",rating:{good:"Gut",fair:"Mittel",poor:"Kabbelig"},disclaimer:"Automatische Prognose von Open-Meteo – eine hilfreiche Orientierung, keine Garantie. Prüfe die Bedingungen immer mit dem Team, bevor du ins Wasser gehst.",today:"Heute"},
    contact:{title:"Bereit zum Surfen?",text:"Schreib dem Team direkt über WhatsApp oder buche online. Auch spontane Besuche im Club sind willkommen.",address:"Plage des Oudayas, Rabat, Marokko",whatsapp:"Über WhatsApp buchen",bookOnline:"Online buchen",sendMessage:"Nachricht senden"},
    footer:{rights:"Alle Rechte vorbehalten.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},
  },
  it: {
    header:{brand:"Rabat Surf Club"},hero:{title:"Surf. Impara. Vivi lo stile di Rabat."},
    intro:{list:["Tutta l'attrezzatura essenziale inclusa: tavola, leash e muta","1 coach per 6 adulti o 4 bambini","Lezioni adattate al tuo livello e ai tuoi obiettivi","Zona di partenza sicura e poco profonda vicino al molo"],highlights:[{title:"Piccoli gruppi",text:"1 coach per massimo 6 adulti o 4 bambini: sicurezza e attenzione prima di tutto."},{title:"Belle vibrazioni",text:"Team accogliente, buona musica e atmosfera rilassata sulla sabbia."},{title:"Feedback personalizzato",text:"Coaching pensato per principianti assoluti e intermedi in crescita."},{title:"Spot ideale",text:"Onde dolci e regolari alla Plage des Oudayas, protette dal molo."}]},
    pricing:{packages:[{name:"Lezione singola",duration:"2 ore",description:"Perfetta per principianti o visitatori che vogliono provare il surf a Rabat.",features:["Sessione di 2 ore","Tutta l'attrezzatura inclusa","Briefing sulla sicurezza","Feedback personale"]},{name:"Pacchetto 6 lezioni",duration:"1,5 ore / lezione",description:"Costruisci basi solide con un programma progressivo di sei lezioni.",features:["6 sessioni con coach","Tavola, leash e muta","Piccoli gruppi","Esercizi tecnici"]},{name:"Pacchetto 10 lezioni",duration:"1,5 ore / lezione",description:"Il miglior valore per chi vuole migliorare rapidamente.",features:["10 sessioni con coach","Tutta l'attrezzatura inclusa","Coaching su stile e curve","Lavoro sulla velocità del pop-up"]}]},
    spot:{stats:[{label:"Tipo di onda",value:"Beach break dolce"},{label:"Ideale per",value:"Principianti e intermedi"},{label:"Temperatura acqua",value:"Muta inclusa"},{label:"Atmosfera",value:"Rilassata e accogliente"}]},
    conditions:{title:"Condizioni di surf della settimana",subtitle:"Dati live su onde, vento e meteo per la Plage des Oudayas, aggiornati automaticamente.",loading:"Caricamento delle previsioni live…",error:"Impossibile caricare le previsioni in questo momento. Riprova tra poco.",waveHeight:"Altezza onda",wavePeriod:"Periodo onda",wind:"Vento",airTemp:"Temperatura aria",rating:{good:"Buona",fair:"Discreta",poor:"Mossa"},disclaimer:"Previsioni automatiche Open-Meteo: una guida utile, non una garanzia. Controlla sempre le condizioni con il team prima di entrare in acqua.",today:"Oggi"},
    contact:{title:"Pronto a surfare?",text:"Scrivi direttamente al team su WhatsApp o prenota online. Sono benvenute anche le visite senza prenotazione.",address:"Plage des Oudayas, Rabat, Marocco",whatsapp:"Prenota su WhatsApp",bookOnline:"Prenota online",sendMessage:"Invia un messaggio"},
    footer:{rights:"Tutti i diritti riservati.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"Il nostro club",instagramBook:"Prenota su Instagram",whatsappCard:"Messaggio pronto per la prenotazione",instagramCard:"Scopri le nostre vibes e scrivici in DM",rabatWay:"Lo stile di Rabat",mapTitle:"Rabat Surf Club alla Plage des Oudayas",heroSlideshow:"Presentazione dell’esperienza surf di Rabat Surf Club"}
  },
  pt: {
    header:{brand:"Rabat Surf Club"},hero:{title:"Surfa. Aprende. Vive o estilo de Rabat."},
    intro:{list:["Todo o equipamento essencial incluído: prancha, leash e fato de neoprene","1 treinador para até 6 adultos ou 4 crianças","Aulas adaptadas ao teu nível e objetivos","Zona de take-off segura e pouco profunda junto ao molhe"],highlights:[{title:"Grupos pequenos",text:"1 treinador para até 6 adultos ou 4 crianças — segurança e atenção em primeiro lugar."},{title:"Boas vibes",text:"Equipa acolhedora, boa música e ambiente descontraído na areia."},{title:"Feedback personalizado",text:"Coaching adaptado a iniciantes absolutos e surfistas intermédios."},{title:"Spot ideal",text:"Ondas suaves e consistentes na Praia dos Oudayas, protegidas pelo molhe."}]},
    pricing:{packages:[{name:"Aula única",duration:"2 horas",description:"Perfeita para iniciantes ou visitantes que querem experimentar surf em Rabat.",features:["Sessão de 2 horas","Todo o equipamento incluído","Briefing de segurança","Feedback personalizado"]},{name:"Pacote de 6 aulas",duration:"1,5 horas / aula",description:"Constrói bases sólidas com um plano progressivo de seis aulas.",features:["6 sessões com treinador","Prancha, leash e fato","Grupos pequenos","Exercícios técnicos"]},{name:"Pacote de 10 aulas",duration:"1,5 horas / aula",description:"A melhor opção para quem quer evoluir rapidamente.",features:["10 sessões com treinador","Todo o equipamento incluído","Coaching de estilo e curvas","Trabalho de velocidade do pop-up"]}]},
    spot:{stats:[{label:"Tipo de onda",value:"Beach break suave"},{label:"Ideal para",value:"Iniciantes e intermédios"},{label:"Temperatura da água",value:"Fato incluído"},{label:"Ambiente",value:"Descontraído e acolhedor"}]},
    conditions:{title:"Condições de surf desta semana",subtitle:"Dados ao vivo de ondas, vento e meteorologia para a Praia dos Oudayas, atualizados automaticamente.",loading:"A carregar previsão ao vivo…",error:"Não foi possível carregar a previsão agora. Tenta novamente daqui a pouco.",waveHeight:"Altura da onda",wavePeriod:"Período da onda",wind:"Vento",airTemp:"Temperatura do ar",rating:{good:"Boa",fair:"Razoável",poor:"Agitada"},disclaimer:"Previsão automática do Open-Meteo — um guia útil, não uma garantia. Confirma sempre as condições com a equipa antes de entrares na água.",today:"Hoje"},
    contact:{title:"Pronto para surfar?",text:"Envia uma mensagem à equipa pelo WhatsApp ou reserva online. Também recebemos visitantes sem reserva.",address:"Praia dos Oudayas, Rabat, Marrocos",whatsapp:"Reservar no WhatsApp",bookOnline:"Reservar online",sendMessage:"Enviar mensagem"},footer:{rights:"Todos os direitos reservados.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"O nosso clube",instagramBook:"Reservar pelo Instagram",whatsappCard:"Mensagem pronta para reservar",instagramCard:"Vê as nossas vibes e fala connosco por DM",rabatWay:"O estilo de Rabat",mapTitle:"Rabat Surf Club na Praia dos Oudayas"}
  },
  nl: {
    header:{brand:"Rabat Surf Club"},hero:{title:"Surf. Leer. Leef de Rabat-manier."},
    intro:{list:["Alle essentiële uitrusting inbegrepen: surfplank, leash en wetsuit","1 coach voor maximaal 6 volwassenen of 4 kinderen","Lessen afgestemd op jouw niveau en doelen","Veilige, ondiepe take-off zone bij de pier"],highlights:[{title:"Kleine groepen",text:"1 coach voor maximaal 6 volwassenen of 4 kinderen — veiligheid en aandacht staan voorop."},{title:"Goede vibes",text:"Gastvrij team, goede muziek en een ontspannen sfeer op het strand."},{title:"Persoonlijke feedback",text:"Coaching voor absolute beginners en groeiende intermediates."},{title:"Ideale spot",text:"Zachte, constante golven bij Plage des Oudayas, beschermd door de pier."}]},
    pricing:{packages:[{name:"Losse les",duration:"2 uur",description:"Perfect voor beginners of bezoekers die willen leren surfen in Rabat.",features:["Sessie van 2 uur","Alle uitrusting inbegrepen","Veiligheidsbriefing","Persoonlijke feedback"]},{name:"Pakket 6 lessen",duration:"1,5 uur / les",description:"Bouw sterke basisvaardigheden op met een progressief plan van zes lessen.",features:["6 begeleide sessies","Board, leash & wetsuit","Kleine groepen","Techniekoefeningen"]},{name:"Pakket 10 lessen",duration:"1,5 uur / les",description:"De beste keuze voor surfers die snel beter willen worden.",features:["10 begeleide sessies","Alle uitrusting inbegrepen","Coaching op stijl en turns","Pop-up snelheid oefenen"]}]},
    spot:{stats:[{label:"Type golf",value:"Zachte beach break"},{label:"Beste voor",value:"Beginners & intermediates"},{label:"Watertemperatuur",value:"Wetsuit inbegrepen"},{label:"Sfeer",value:"Relaxed & gastvrij"}]},
    conditions:{title:"Surfcondities van deze week",subtitle:"Live gegevens over golven, wind en weer voor Plage des Oudayas, automatisch bijgewerkt.",loading:"Live voorspelling laden…",error:"De voorspelling kon nu niet worden geladen. Probeer het zo opnieuw.",waveHeight:"Golfhoogte",wavePeriod:"Golfperiode",wind:"Wind",airTemp:"Luchttemperatuur",rating:{good:"Goed",fair:"Redelijk",poor:"Onrustig"},disclaimer:"Automatische voorspelling van Open-Meteo — een handige richtlijn, geen garantie. Controleer de omstandigheden altijd met het team voordat je het water op gaat.",today:"Vandaag"},
    contact:{title:"Klaar om te surfen?",text:"Stuur het team rechtstreeks een WhatsApp-bericht of boek online. Ook zonder reservering ben je welkom.",address:"Plage des Oudayas, Rabat, Marokko",whatsapp:"Boek via WhatsApp",bookOnline:"Online boeken",sendMessage:"Bericht sturen"},footer:{rights:"Alle rechten voorbehouden.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"Onze club",instagramBook:"Boek via Instagram",whatsappCard:"Voorbereid bericht om te boeken",instagramCard:"Bekijk onze vibes en stuur ons een DM",rabatWay:"De Rabat-manier",mapTitle:"Rabat Surf Club bij Plage des Oudayas",heroSlideshow:"Diavoorstelling van de surfervaring van Rabat Surf Club"}
  },
  tr: {
    header:{brand:"Rabat Surf Club"},hero:{title:"Sörf yap. Öğren. Rabat ruhunu yaşa."},
    intro:{list:["Tüm temel ekipman dahil: sörf tahtası, leash ve wetsuit","6 yetişkine veya 4 çocuğa 1 koç","Dersler seviyene ve hedeflerine göre uyarlanır","İskelenin yanında güvenli, sığ kalkış alanı"],highlights:[{title:"Küçük gruplar",text:"En fazla 6 yetişkin veya 4 çocuk için 1 koç — güvenlik ve ilgi önceliğimiz."},{title:"Harika atmosfer",text:"Samimi ekip, güzel müzik ve kumsalda rahat bir ortam."},{title:"Kişisel geri bildirim",text:"Tamamen yeni başlayanlara ve gelişen orta seviyeye uygun koçluk."},{title:"İdeal nokta",text:"İskele tarafından korunan Oudayas Plajı'nda yumuşak ve düzenli dalgalar."}]},
    pricing:{packages:[{name:"Tek ders",duration:"2 saat",description:"Yeni başlayanlar veya Rabat'ta sörfü denemek isteyen ziyaretçiler için ideal.",features:["2 saatlik seans","Tüm ekipman dahil","Plaj güvenlik bilgilendirmesi","Kişisel geri bildirim"]},{name:"6 Ders Paketi",duration:"Ders başına 1,5 saat",description:"Altı derslik ilerlemeli programla sağlam temeller oluştur.",features:["6 koçlu seans","Tahta, leash ve wetsuit","Küçük gruplar","Teknik çalışmalar"]},{name:"10 Ders Paketi",duration:"Ders başına 1,5 saat",description:"Hızlı gelişmek isteyenler için en iyi seçenek.",features:["10 koçlu seans","Tüm ekipman dahil","Stil ve dönüş koçluğu","Pop-up hız çalışması"]}]},
    spot:{stats:[{label:"Dalga türü",value:"Yumuşak beach break"},{label:"En uygun",value:"Başlangıç & orta seviye"},{label:"Su sıcaklığı",value:"Wetsuit dahil"},{label:"Atmosfer",value:"Rahat & samimi"}]},
    conditions:{title:"Bu haftanın sörf koşulları",subtitle:"Oudayas Plajı için canlı dalga, rüzgar ve hava durumu verileri otomatik güncellenir.",loading:"Canlı tahmin yükleniyor…",error:"Tahmin şu anda yüklenemedi. Lütfen biraz sonra tekrar dene.",waveHeight:"Dalga yüksekliği",wavePeriod:"Dalga periyodu",wind:"Rüzgar",airTemp:"Hava sıcaklığı",rating:{good:"İyi",fair:"Orta",poor:"Dalgalı"},disclaimer:"Open-Meteo otomatik tahmini — faydalı bir rehberdir, garanti değildir. Suya girmeden önce koşulları her zaman ekiple kontrol et.",today:"Bugün"},
    contact:{title:"Sörfe hazır mısın?",text:"Ekibe WhatsApp'tan doğrudan yaz veya online rezervasyon yap. Rezervasyonsuz ziyaretler de memnuniyetle karşılanır.",address:"Oudayas Plajı, Rabat, Fas",whatsapp:"WhatsApp'tan rezervasyon",bookOnline:"Online rezervasyon",sendMessage:"Mesaj gönder"},footer:{rights:"Tüm hakları saklıdır.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"Kulübümüz",instagramBook:"Instagram'dan rezervasyon",whatsappCard:"Rezervasyon için hazır mesaj",instagramCard:"Vibelerimizi gör ve DM'den yaz",rabatWay:"Rabat ruhu",mapTitle:"Oudayas Plajı'ndaki Rabat Surf Club"}
  },
  zh: {
    header:{brand:"Rabat Surf Club"},hero:{title:"冲浪、学习，感受拉巴特方式。"},
    intro:{list:["包含全部必要装备：冲浪板、脚绳和潜水服","每6名成人或4名儿童配1名教练","课程根据你的水平和目标定制","码头附近安全、浅水的起乘区域"],highlights:[{title:"小班教学",text:"最多6名成人或4名儿童配1名教练，安全和关注度优先。"},{title:"轻松氛围",text:"友好的团队、好音乐和沙滩上的轻松气氛。"},{title:"个性化反馈",text:"适合零基础初学者和正在进阶的中级冲浪者。"},{title:"理想冲浪点",text:"乌达雅斯海滩浪况温和稳定，并受到码头保护。"}]},
    pricing:{packages:[{name:"单次课程",duration:"2小时",description:"适合初学者或想在拉巴特体验冲浪的游客。",features:["2小时课程","全部装备包含","海滩安全说明","个性化反馈"]},{name:"6次课程套餐",duration:"每次1.5小时",description:"通过六次循序渐进的课程建立扎实基础。",features:["6次教练课程","冲浪板、脚绳和潜水服","小班教学","技术练习"]},{name:"10次课程套餐",duration:"每次1.5小时",description:"想快速提升水平的冲浪者的最佳选择。",features:["10次教练课程","全部装备包含","动作与转弯指导","起乘速度训练"]}]},
    spot:{stats:[{label:"浪型",value:"温和海滩浪"},{label:"适合",value:"初学者和中级"},{label:"水温",value:"提供潜水服"},{label:"氛围",value:"轻松友好"}]},
    conditions:{title:"本周冲浪海况",subtitle:"乌达雅斯海滩的实时浪况、风况和天气数据，自动更新。",loading:"正在加载实时预报…",error:"暂时无法加载预报，请稍后再试。",waveHeight:"浪高",wavePeriod:"浪周期",wind:"风力",airTemp:"气温",rating:{good:"良好",fair:"一般",poor:"浪大风乱"},disclaimer:"Open-Meteo 自动预报仅供参考，并非保证。下水前请务必与团队确认现场情况。",today:"今天"},
    contact:{title:"准备好冲浪了吗？",text:"直接通过 WhatsApp 联系团队或在线预订。没有预约也欢迎到俱乐部咨询。",address:"乌达雅斯海滩，拉巴特，摩洛哥",whatsapp:"通过 WhatsApp 预订",bookOnline:"在线预订",sendMessage:"发送消息"},footer:{rights:"版权所有。",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"我们的俱乐部",instagramBook:"通过 Instagram 预订",whatsappCard:"预填写的预订消息",instagramCard:"查看我们的动态并通过私信联系我们",rabatWay:"拉巴特方式",mapTitle:"乌达雅斯海滩 Rabat Surf Club 位置",heroSlideshow:"Rabat Surf Club 冲浪体验幻灯片"}
  },
  ja: {
    header:{brand:"Rabat Surf Club"},hero:{title:"サーフィン、学び、ラバトのスタイルを楽しもう。"},
    intro:{list:["必要な用具をすべて用意：ボード、リーシュ、ウェットスーツ","大人6名または子ども4名につきコーチ1名","レベルと目標に合わせたレッスン","桟橋近くの安全で浅いテイクオフゾーン"],highlights:[{title:"少人数制",text:"大人6名または子ども4名までにコーチ1名。安全と丁寧な指導を優先します。"},{title:"最高の雰囲気",text:"親しみやすいチーム、音楽、砂浜のリラックスした空気。"},{title:"個別フィードバック",text:"完全な初心者から中級者までレベルに合わせて指導します。"},{title:"理想的なスポット",text:"桟橋に守られたウダヤスビーチは穏やかで安定した波が特徴です。"}]},
    pricing:{packages:[{name:"単発レッスン",duration:"2時間",description:"初めての方やラバトでサーフィンを体験したい旅行者に最適。",features:["2時間セッション","用具一式込み","ビーチ安全説明","個別フィードバック"]},{name:"6回レッスンパック",duration:"1回1.5時間",description:"6回の段階的なレッスンで確かな基礎を身につけます。",features:["コーチ付き6セッション","ボード、リーシュ、ウェットスーツ","少人数制","テクニック練習"]},{name:"10回レッスンパック",duration:"1回1.5時間",description:"短期間で上達したい方に最もお得なパッケージ。",features:["コーチ付き10セッション","用具一式込み","スタイルとターンの指導","ポップアップ速度練習"]}]},
    spot:{stats:[{label:"波のタイプ",value:"穏やかなビーチブレイク"},{label:"おすすめ",value:"初心者・中級者"},{label:"水温",value:"ウェットスーツ完備"},{label:"雰囲気",value:"リラックス＆フレンドリー"}]},
    conditions:{title:"今週のサーフコンディション",subtitle:"ウダヤスビーチの波・風・天気のライブデータを自動更新します。",loading:"ライブ予報を読み込み中…",error:"現在予報を読み込めません。しばらくしてからもう一度お試しください。",waveHeight:"波高",wavePeriod:"波の周期",wind:"風",airTemp:"気温",rating:{good:"良好",fair:"普通",poor:"荒れ気味"},disclaimer:"Open-Meteoの自動予報です。目安であり保証ではありません。入水前には必ずチームに現地の状況を確認してください。",today:"今日"},
    contact:{title:"サーフィンの準備はできましたか？",text:"WhatsAppでチームに直接連絡するか、オンラインで予約できます。予約なしの来店も歓迎します。",address:"ウダヤスビーチ、ラバト、モロッコ",whatsapp:"WhatsAppで予約",bookOnline:"オンライン予約",sendMessage:"メッセージを送る"},footer:{rights:"すべての権利を保有しています。",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"私たちのクラブ",instagramBook:"Instagramで予約",whatsappCard:"予約用のメッセージ",instagramCard:"雰囲気を見てDMでお問い合わせ",rabatWay:"ラバトのスタイル",mapTitle:"ウダヤスビーチのRabat Surf Club所在地",heroSlideshow:"Rabat Surf Club サーフィン体験スライドショー"}
  },
  ko: {
    header:{brand:"Rabat Surf Club"},hero:{title:"서핑하고, 배우고, 라바트의 방식을 즐겨보세요."},
    intro:{list:["필수 장비 모두 포함: 서핑보드, 리쉬, 웨트수트","성인 6명 또는 어린이 4명당 코치 1명","레벨과 목표에 맞춘 맞춤 레슨","부두 근처의 안전하고 얕은 테이크오프 구역"],highlights:[{title:"소규모 그룹",text:"최대 성인 6명 또는 어린이 4명당 코치 1명으로 안전과 집중도를 높입니다."},{title:"좋은 분위기",text:"친절한 팀, 좋은 음악, 모래사장의 편안한 분위기."},{title:"맞춤 피드백",text:"완전 초보부터 성장 중인 중급자까지 수준에 맞춰 코칭합니다."},{title:"이상적인 스팟",text:"부두의 보호를 받는 우다야스 해변은 부드럽고 일정한 파도가 특징입니다."}]},
    pricing:{packages:[{name:"단일 레슨",duration:"2시간",description:"초보자 또는 라바트에서 서핑을 체험하고 싶은 방문객에게 완벽합니다.",features:["2시간 세션","모든 장비 포함","해변 안전 브리핑","개인 피드백"]},{name:"6회 레슨 패키지",duration:"레슨당 1.5시간",description:"6회 단계별 프로그램으로 탄탄한 기본기를 만들어보세요.",features:["코치와 함께하는 6회 세션","보드, 리쉬, 웨트수트","소규모 그룹","기술 훈련"]},{name:"10회 레슨 패키지",duration:"레슨당 1.5시간",description:"빠르게 실력을 향상시키고 싶은 서퍼에게 가장 좋은 선택입니다.",features:["코치와 함께하는 10회 세션","모든 장비 포함","스타일 및 턴 코칭","팝업 속도 훈련"]}]},
    spot:{stats:[{label:"파도 유형",value:"부드러운 비치 브레이크"},{label:"추천 대상",value:"초보자 및 중급자"},{label:"수온",value:"웨트수트 제공"},{label:"분위기",value:"편안하고 친근함"}]},
    conditions:{title:"이번 주 서핑 컨디션",subtitle:"우다야스 해변의 실시간 파도, 바람, 날씨 데이터를 자동으로 업데이트합니다.",loading:"실시간 예보를 불러오는 중…",error:"현재 예보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.",waveHeight:"파도 높이",wavePeriod:"파도 주기",wind:"바람",airTemp:"기온",rating:{good:"좋음",fair:"보통",poor:"거침"},disclaimer:"Open-Meteo 자동 예보는 참고용이며 보장되지 않습니다. 입수 전에는 항상 팀에게 현장 상황을 확인하세요.",today:"오늘"},
    contact:{title:"서핑할 준비가 되셨나요?",text:"WhatsApp으로 팀에 직접 연락하거나 온라인으로 예약하세요. 예약 없이 방문해도 환영합니다.",address:"우다야스 해변, 라바트, 모로코",whatsapp:"WhatsApp으로 예약",bookOnline:"온라인 예약",sendMessage:"메시지 보내기"},footer:{rights:"모든 권리 보유.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"우리 클럽",instagramBook:"Instagram으로 예약",whatsappCard:"예약용 메시지가 준비되어 있습니다",instagramCard:"우리 분위기를 보고 DM으로 문의하세요",rabatWay:"라바트의 방식",mapTitle:"우다야스 해변 Rabat Surf Club 위치"}
  },
};

function deepMerge<T>(base: T, override: Record<string, any>): T {
  if (!override) return base;
  const result: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value) && result[key] && typeof result[key] === "object") {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);


// Completion dictionaries contain every field that the public UI can render.
// They are deliberately separate from baseDict so no non-English locale can
// silently inherit English copy when a new key is introduced.
const localeCompletion: Record<Exclude<Lang, "en" | "fr" | "ar">, Record<string, any>> = {
  es: {
    nav:{lessons:"Clases",spot:"El spot",conditions:"Condiciones",agenda:"Agenda",contact:"Contacto"},
    header:{bookShort:"Reservar",bookLong:"Reservar por WhatsApp"},
    hero:{location:"Playa de los Oudayas, Rabat",subtitle:"Clases de surf cercanas en Rabat Surf Club para principiantes y surfistas intermedios. Todo el equipo incluido, grupos pequeños y coaching personalizado en una de las playas urbanas más acogedoras de Marruecos.",bookLesson:"Reservar una clase",viewPackages:"Ver paquetes"},
    intro:{title:"Aprende con un equipo local experimentado",text:"El entrenador Jalal dirige las clases de surf de Rabat Surf Club, directamente en la Playa de los Oudayas. Él y su equipo son conocidos por su energía acogedora, buena música y consejos claros que ayudan tanto a principiantes como a surfistas intermedios a progresar rápidamente."},
    pricing:{title:"Paquetes de clases",subtitle:"Todo lo que necesitas está incluido. Solo tienes que venir listo para surfear.",mostPopular:"Más popular",bookPackage:"Reservar este paquete"},
    spot:{openInGoogleMaps:"Abrir en Google Maps",openInWaze:"Abrir en Waze",label:"Playa de los Oudayas",title:"Por qué Oudayas es el spot perfecto para principiantes",text:"La Playa de los Oudayas está protegida por el histórico muelle de Rabat. El resultado son olas suaves y constantes que facilitan remar, leer el pico y concentrarse en mejorar el estilo, los giros o la velocidad del pop-up."},
    contact:{clubName:"Rabat Surf Club (Club N.º 1)",fastestReply:"Respuesta más rápida",waverick:"Waverick Adventures"}
  },
  de: {
    nav:{lessons:"Kurse",spot:"Der Spot",conditions:"Bedingungen",agenda:"Agenda",contact:"Kontakt"},
    header:{bookShort:"Buchen",bookLong:"Über WhatsApp buchen"},
    hero:{location:"Plage des Oudayas, Rabat",subtitle:"Freundliche Surfkurse im Rabat Surf Club für Anfänger und Fortgeschrittene. Komplette Ausrüstung, kleine Gruppen und individuelles Coaching an einem der einladendsten Stadtstrände Marokkos.",bookLesson:"Kurs buchen",viewPackages:"Pakete ansehen"},
    intro:{title:"Lerne mit einem erfahrenen lokalen Team",text:"Coach Jalal leitet die Surfkurse im Rabat Surf Club direkt an der Plage des Oudayas. Er und sein Team sind für ihre herzliche Art, gute Musik und klares Feedback bekannt, das Anfängern und fortgeschrittenen Surfern hilft, schnell Fortschritte zu machen."},
    pricing:{title:"Surfkurs-Pakete",subtitle:"Alles, was du brauchst, ist inklusive. Komm einfach bereit zum Surfen.",mostPopular:"Am beliebtesten",bookPackage:"Dieses Paket buchen"},
    spot:{openInGoogleMaps:"In Google Maps öffnen",openInWaze:"In Waze öffnen",label:"Plage des Oudayas",title:"Warum Oudayas der perfekte Spot für Anfänger ist",text:"Die Plage des Oudayas liegt geschützt hinter der historischen Mole von Rabat. Dadurch entstehen sanfte, konstante Wellen, ideal zum Paddeln, Lesen der Wellen und Verbessern von Stil, Turns oder Pop-up-Geschwindigkeit."},
    contact:{clubName:"Rabat Surf Club (Club Nr. 1)",fastestReply:"Schnellste Antwort",waverick:"Waverick Adventures"}
  },
  it: {
    nav:{lessons:"Lezioni",spot:"Lo spot",conditions:"Condizioni",agenda:"Agenda",contact:"Contatti"},header:{bookShort:"Prenota",bookLong:"Prenota su WhatsApp"},
    hero:{location:"Plage des Oudayas, Rabat",subtitle:"Lezioni di surf amichevoli al Rabat Surf Club per principianti e intermedi. Attrezzatura inclusa, piccoli gruppi e coaching personalizzato su una delle spiagge cittadine più accoglienti del Marocco.",bookLesson:"Prenota una lezione",viewPackages:"Vedi i pacchetti"},
    intro:{title:"Impara con un team locale esperto",text:"Coach Jalal guida le lezioni di surf del Rabat Surf Club direttamente alla Plage des Oudayas. Lui e il suo team sono conosciuti per l'energia accogliente, la buona musica e i consigli chiari che aiutano principianti e intermedi a migliorare rapidamente."},
    pricing:{title:"Pacchetti di lezioni",subtitle:"Tutto ciò che ti serve è incluso. Devi solo arrivare pronto a surfare.",mostPopular:"Più popolare",bookPackage:"Prenota questo pacchetto"},
    spot:{openInGoogleMaps:"Apri in Google Maps",openInWaze:"Apri in Waze",label:"Plage des Oudayas",title:"Perché Oudayas è lo spot perfetto per iniziare",text:"La Plage des Oudayas è riparata dal molo storico di Rabat. Il risultato sono onde dolci e costanti, perfette per imparare a remare, leggere il line-up e migliorare stile, curve e velocità del pop-up."},
    contact:{clubName:"Rabat Surf Club (Club N. 1)",fastestReply:"Risposta più rapida",waverick:"Waverick Adventures"},footer:{rights:"Tutti i diritti riservati.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"Il nostro club",instagramBook:"Prenota su Instagram",whatsappCard:"Messaggio pronto per la prenotazione",instagramCard:"Scopri le nostre vibes e scrivici in DM",rabatWay:"Lo stile di Rabat",mapTitle:"Rabat Surf Club alla Plage des Oudayas",heroSlideshow:"Presentazione dell’esperienza surf di Rabat Surf Club"}
  },
  pt: {
    nav:{lessons:"Aulas",spot:"O Spot",conditions:"Condições",agenda:"Agenda",contact:"Contacto"},header:{bookShort:"Reservar",bookLong:"Reservar pelo WhatsApp"},
    hero:{location:"Praia dos Oudayas, Rabat",subtitle:"Aulas de surf acolhedoras no Rabat Surf Club para iniciantes e surfistas intermédios. Todo o equipamento incluído, grupos pequenos e treino personalizado numa das praias urbanas mais acolhedoras de Marrocos.",bookLesson:"Reservar uma aula",viewPackages:"Ver pacotes"},
    intro:{title:"Aprende com uma equipa local experiente",text:"O treinador Jalal conduz as aulas de surf do Rabat Surf Club diretamente na Praia dos Oudayas. Ele e a sua equipa são conhecidos pela energia acolhedora, boa música e feedback claro que ajuda iniciantes e surfistas intermédios a evoluir rapidamente."},
    pricing:{title:"Pacotes de aulas",subtitle:"Tudo o que precisas está incluído. Basta apareceres pronto para surfar.",mostPopular:"Mais popular",bookPackage:"Reservar este pacote"},
    spot:{openInGoogleMaps:"Abrir no Google Maps",openInWaze:"Abrir no Waze",label:"Praia dos Oudayas",title:"Porque é que Oudayas é o spot perfeito para iniciantes",text:"A Praia dos Oudayas fica protegida pelo molhe histórico de Rabat. O resultado são ondas suaves e consistentes, ideais para remar, ler o line-up e melhorar o estilo, as curvas e a velocidade do pop-up."},
    contact:{clubName:"Rabat Surf Club (Clube N.º 1)",fastestReply:"Resposta mais rápida",waverick:"Waverick Adventures"},footer:{rights:"Todos os direitos reservados.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"O nosso clube",instagramBook:"Reservar pelo Instagram",whatsappCard:"Mensagem pronta para reserva",instagramCard:"Veja o nosso ambiente e envie-nos uma DM",rabatWay:"O estilo de Rabat",mapTitle:"Localização do Rabat Surf Club na Praia dos Oudayas",heroSlideshow:"Apresentação da experiência de surf do Rabat Surf Club"}
  },
  nl: {
    nav:{lessons:"Lessen",spot:"De spot",conditions:"Omstandigheden",agenda:"Agenda",contact:"Contact"},header:{bookShort:"Boeken",bookLong:"Boeken via WhatsApp"},
    hero:{location:"Plage des Oudayas, Rabat",subtitle:"Gezellige surflessen bij Rabat Surf Club voor beginners en halfgevorderde surfers. Alle uitrusting inbegrepen, kleine groepen en persoonlijke coaching aan een van de meest gastvrije stadsstranden van Marokko.",bookLesson:"Een les boeken",viewPackages:"Pakketten bekijken"},
    intro:{title:"Leer van een ervaren lokaal team",text:"Coach Jalal geeft de surflessen van Rabat Surf Club direct aan Plage des Oudayas. Hij en zijn team staan bekend om hun gastvrije energie, goede muziek en duidelijke feedback waarmee beginners en halfgevorderde surfers snel vooruitgaan."},
    pricing:{title:"Lespakketten",subtitle:"Alles wat je nodig hebt is inbegrepen. Kom gewoon klaar om te surfen.",mostPopular:"Meest populair",bookPackage:"Dit pakket boeken"},
    spot:{openInGoogleMaps:"Openen in Google Maps",openInWaze:"Openen in Waze",label:"Plage des Oudayas",title:"Waarom Oudayas de perfecte spot voor beginners is",text:"Plage des Oudayas ligt beschut achter de historische pier van Rabat. Daardoor zijn de golven zacht en constant, ideaal om te peddelen, de line-up te lezen en je stijl, bochten of pop-upsnelheid te verbeteren."},
    contact:{clubName:"Rabat Surf Club (Club nr. 1)",fastestReply:"Snelste antwoord",waverick:"Waverick Adventures"},footer:{rights:"Alle rechten voorbehouden.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"Onze club",instagramBook:"Boeken via Instagram",whatsappCard:"Voorbereid boekingsbericht",instagramCard:"Bekijk onze sfeer en stuur ons een DM",rabatWay:"De Rabat-manier",mapTitle:"Rabat Surf Club bij Plage des Oudayas",heroSlideshow:"Diavoorstelling van de surfervaring van Rabat Surf Club"}
  },
  tr: {
    nav:{lessons:"Dersler",spot:"Sörf noktası",conditions:"Koşullar",agenda:"Ajanda",contact:"İletişim"},header:{bookShort:"Rezervasyon",bookLong:"WhatsApp'tan rezervasyon"},
    hero:{location:"Oudayas Plajı, Rabat",subtitle:"Rabat Surf Club'da başlangıç ve orta seviye sörfçüler için samimi dersler. Tüm ekipman dahil, küçük gruplar ve Fas'ın en sıcak şehir plajlarından birinde kişisel koçluk.",bookLesson:"Ders rezervasyonu",viewPackages:"Paketleri gör"},
    intro:{title:"Deneyimli yerel ekiple öğren",text:"Koç Jalal, Rabat Surf Club'ın derslerini doğrudan Oudayas Plajı'nda yürütür. Kendisi ve ekibi sıcak enerjileri, iyi müzikleri ve hem yeni başlayanların hem de orta seviyedekilerin hızla gelişmesine yardımcı olan net geri bildirimleriyle tanınır."},
    pricing:{title:"Ders paketleri",subtitle:"İhtiyacın olan her şey dahil. Sadece sörfe hazır gel.",mostPopular:"En popüler",bookPackage:"Bu paketi rezerve et"},
    spot:{openInGoogleMaps:"Google Maps'te aç",openInWaze:"Waze'de aç",label:"Oudayas Plajı",title:"Oudayas neden başlangıç için mükemmel bir nokta",text:"Oudayas Plajı, Rabat'ın tarihi iskelesinin koruması altındadır. Sonuç olarak kürek çekmek, dalgaları okumak ve stil, dönüşler veya pop-up hızını geliştirmek için yumuşak ve düzenli dalgalar sunar."},
    contact:{clubName:"Rabat Surf Club (Kulüp No. 1)",fastestReply:"En hızlı yanıt",waverick:"Waverick Adventures"},footer:{rights:"Tüm hakları saklıdır.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"Kulübümüz",instagramBook:"Instagram'dan rezervasyon",whatsappCard:"Rezervasyon için hazır mesaj",instagramCard:"Atmosferimizi gör ve DM'den yaz",rabatWay:"Rabat ruhu",mapTitle:"Oudayas Plajı'ndaki Rabat Surf Club konumu",heroSlideshow:"Rabat Surf Club sörf deneyimi slayt gösterisi"}
  },
  zh: {
    nav:{lessons:"课程",spot:"冲浪点",conditions:"海况",agenda:"日程",contact:"联系"},header:{bookShort:"预订",bookLong:"通过 WhatsApp 预订"},
    hero:{location:"乌达雅斯海滩，拉巴特",subtitle:"Rabat Surf Club 为初学者和中级冲浪者提供友好的冲浪课程。包含全部装备、小班教学和个性化指导，地点位于摩洛哥最友好的城市海滩之一。",bookLesson:"预订课程",viewPackages:"查看套餐"},
    intro:{title:"跟随经验丰富的本地团队学习",text:"教练 Jalal 在乌达雅斯海滩的 Rabat Surf Club 负责冲浪课程。他和团队以友好的氛围、好音乐和清晰的反馈而闻名，帮助初学者和中级冲浪者快速进步。"},
    pricing:{title:"课程套餐",subtitle:"你需要的一切都已包含，只需准备好来冲浪。",mostPopular:"最受欢迎",bookPackage:"预订此套餐"},
    spot:{openInGoogleMaps:"在 Google 地图中打开",openInWaze:"在 Waze 中打开",label:"乌达雅斯海滩",title:"为什么乌达雅斯是初学者的理想冲浪点",text:"乌达雅斯海滩位于拉巴特历史码头的保护范围内，因此拥有温和而稳定的海浪，非常适合练习划水、判断浪况以及提升风格、转弯和起乘速度。"},
    contact:{clubName:"Rabat Surf Club（1号俱乐部）",fastestReply:"最快回复",waverick:"Waverick Adventures"},footer:{rights:"版权所有。",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"我们的俱乐部",instagramBook:"通过 Instagram 预订",whatsappCard:"预填写的预订消息",instagramCard:"查看我们的氛围并通过私信联系我们",rabatWay:"拉巴特方式",mapTitle:"乌达雅斯海滩 Rabat Surf Club 位置",heroSlideshow:"Rabat Surf Club 冲浪体验幻灯片"}
  },
  ja: {
    nav:{lessons:"レッスン",spot:"スポット",conditions:"コンディション",agenda:"アジェンダ",contact:"お問い合わせ"},header:{bookShort:"予約",bookLong:"WhatsAppで予約"},
    hero:{location:"ウダヤスビーチ、ラバト",subtitle:"Rabat Surf Clubでは初心者から中級者まで楽しめるサーフィンレッスンを提供しています。用具一式込み、少人数制、そしてモロッコで最も親しみやすい都市ビーチの一つで個別指導を行います。",bookLesson:"レッスンを予約",viewPackages:"パッケージを見る"},
    intro:{title:"経験豊富なローカルチームと学ぶ",text:"コーチのJalalはウダヤスビーチのRabat Surf Clubでサーフィンレッスンを担当しています。温かい雰囲気、音楽、そして初心者から中級者まで上達を支える分かりやすいフィードバックで知られています。"},
    pricing:{title:"レッスンパッケージ",subtitle:"必要なものはすべて含まれています。サーフィンの準備だけしてお越しください。",mostPopular:"一番人気",bookPackage:"このパッケージを予約"},
    spot:{openInGoogleMaps:"Google マップで開く",openInWaze:"Wazeで開く",label:"ウダヤスビーチ",title:"ウダヤスが初心者に最適な理由",text:"ウダヤスビーチはラバトの歴史ある桟橋に守られています。そのため波は穏やかで安定しており、パドル、波の読み方、スタイル、ターン、ポップアップの速さを集中して練習できます。"},
    contact:{clubName:"Rabat Surf Club（クラブ1番）",fastestReply:"最速の返信",waverick:"Waverick Adventures"},footer:{rights:"すべての権利を保有しています。",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"私たちのクラブ",instagramBook:"Instagramで予約",whatsappCard:"予約用メッセージ",instagramCard:"雰囲気を見てDMでお問い合わせ",rabatWay:"ラバトのスタイル",mapTitle:"ウダヤスビーチのRabat Surf Club所在地",heroSlideshow:"Rabat Surf Club サーフィン体験スライドショー"}
  },
  ko: {
    nav:{lessons:"레슨",spot:"서핑 포인트",conditions:"컨디션",agenda:"일정",contact:"문의"},header:{bookShort:"예약",bookLong:"WhatsApp으로 예약"},
    hero:{location:"우다야스 해변, 라바트",subtitle:"Rabat Surf Club은 초보자와 중급자를 위한 친근한 서핑 레슨을 제공합니다. 모든 장비 포함, 소규모 그룹, 그리고 모로코에서 가장 편안한 도시 해변 중 한 곳에서 맞춤 코칭을 받을 수 있습니다.",bookLesson:"레슨 예약",viewPackages:"패키지 보기"},
    intro:{title:"경험 많은 현지 팀과 함께 배우세요",text:"코치 Jalal은 우다야스 해변의 Rabat Surf Club에서 서핑 레슨을 진행합니다. 친근한 분위기, 좋은 음악, 그리고 초보자와 중급자가 빠르게 발전할 수 있도록 돕는 명확한 피드백으로 잘 알려져 있습니다."},
    pricing:{title:"레슨 패키지",subtitle:"필요한 모든 것이 포함되어 있습니다. 서핑할 준비만 하고 오세요.",mostPopular:"가장 인기",bookPackage:"이 패키지 예약"},
    spot:{openInGoogleMaps:"Google 지도에서 열기",openInWaze:"Waze에서 열기",label:"우다야스 해변",title:"우다야스가 초보자에게 완벽한 이유",text:"우다야스 해변은 라바트의 역사적인 부두가 파도를 보호해 줍니다. 그래서 부드럽고 일정한 파도가 형성되어 패들링, 파도 읽기, 스타일과 턴, 팝업 속도 향상에 집중하기 좋습니다."},
    contact:{clubName:"Rabat Surf Club (클럽 1번)",fastestReply:"가장 빠른 답변",waverick:"Waverick Adventures"},footer:{rights:"모든 권리 보유.",whatsapp:"WhatsApp",facebook:"Facebook",waverick:"Waverick"},common:{club:"우리 클럽",instagramBook:"Instagram으로 예약",whatsappCard:"예약용 메시지",instagramCard:"우리 분위기를 보고 DM으로 문의하세요",rabatWay:"라바트의 방식",mapTitle:"우다야스 해변의 Rabat Surf Club 위치",heroSlideshow:"Rabat Surf Club 서핑 경험 슬라이드쇼"}
  }
};

const aboutTranslations: Record<Lang, any> = {
  en: { nav: { about: "About us" }, about: { since: "Surfing in Rabat since", title: "A club built around the ocean, community and progression", text: "Rabat Surf Club started in 2008 at Plage des Oudayas, with a simple goal: make surfing accessible, welcoming and fun in Rabat. Today, the club keeps that local spirit at the heart of every session, from a first wave to the next step in your surfing journey.", location: "Plage des Oudayas, Rabat, Morocco", imageAlt: "Surfer riding a wave at Plage des Oudayas in Rabat", values: [{ title: "Since 2008", text: "A long-standing local surf presence in Rabat." }, { title: "Local spirit", text: "Learn directly on the beach from a crew that knows Oudayas." }, { title: "Progress together", text: "Build confidence, technique and a real connection with the ocean." }] } },
  fr: { nav: { about: "À propos" }, about: { since: "Le surf à Rabat depuis", title: "Un club construit autour de l’océan, du partage et de la progression", text: "Le Rabat Surf Club a commencé en 2008 sur la Plage des Oudayas, avec un objectif simple : rendre le surf accessible, convivial et amusant à Rabat. Aujourd’hui, le club garde cet esprit local au cœur de chaque séance, de la première vague à la prochaine étape de votre progression.", location: "Plage des Oudayas, Rabat, Maroc", imageAlt: "Surfeur sur une vague à la Plage des Oudayas à Rabat", values: [{ title: "Depuis 2008", text: "Une présence surf locale de longue date à Rabat." }, { title: "Esprit local", text: "Apprenez directement sur la plage avec une équipe qui connaît Oudayas." }, { title: "Progresser ensemble", text: "Gagnez en confiance, en technique et en connexion avec l’océan." }] } },
  ar: { nav: { about: "من نحن" }, about: { since: "ركوب الأمواج في الرباط منذ", title: "نادٍ بُني حول البحر وروح المجتمع والتطور", text: "بدأ نادي الرباط لركوب الأمواج سنة 2008 في شاطئ الأوداية، بهدف بسيط: جعل رياضة ركوب الأمواج متاحة وممتعة ومرحبة بالجميع في الرباط. واليوم يحافظ النادي على هذه الروح المحلية في قلب كل حصة، من أول موجة إلى الخطوة التالية في رحلتك مع ركوب الأمواج.", location: "شاطئ الأوداية، الرباط، المغرب", imageAlt: "راكب أمواج على موجة في شاطئ الأوداية بالرباط", values: [{ title: "منذ 2008", text: "حضور محلي راسخ لرياضة ركوب الأمواج في الرباط." }, { title: "روح محلية", text: "تعلّم مباشرة على الشاطئ مع فريق يعرف الأوداية جيداً." }, { title: "نتطور معاً", text: "ابنِ الثقة والتقنية وعلاقة حقيقية مع البحر." }] } },
  es: { nav: { about: "Sobre nosotros" }, about: { since: "Surf en Rabat desde", title: "Un club construido alrededor del océano, la comunidad y el progreso", text: "Rabat Surf Club comenzó en 2008 en la Playa de los Oudayas con un objetivo sencillo: hacer que el surf sea accesible, acogedor y divertido en Rabat. Hoy mantenemos ese espíritu local en el centro de cada sesión, desde la primera ola hasta el siguiente paso de tu evolución sobre la tabla.", location: "Playa de los Oudayas, Rabat, Marruecos", imageAlt: "Surfista surfeando una ola en la Playa de los Oudayas de Rabat", values: [{ title: "Desde 2008", text: "Una presencia local de surf consolidada en Rabat." }, { title: "Espíritu local", text: "Aprende en la playa con un equipo que conoce Oudayas." }, { title: "Progresamos juntos", text: "Gana confianza, técnica y una conexión real con el océano." }] } },
  de: { nav: { about: "Über uns" }, about: { since: "Surfen in Rabat seit", title: "Ein Club rund um Meer, Gemeinschaft und Fortschritt", text: "Rabat Surf Club wurde 2008 an der Plage des Oudayas gegründet, mit einem einfachen Ziel: Surfen in Rabat zugänglich, herzlich und unterhaltsam zu machen. Bis heute steht dieser lokale Geist im Mittelpunkt jeder Session – von der ersten Welle bis zum nächsten Schritt deiner Entwicklung.", location: "Plage des Oudayas, Rabat, Marokko", imageAlt: "Surfer auf einer Welle an der Plage des Oudayas in Rabat", values: [{ title: "Seit 2008", text: "Langjährige lokale Surfpräsenz in Rabat." }, { title: "Lokaler Geist", text: "Lerne direkt am Strand mit einem Team, das Oudayas kennt." }, { title: "Gemeinsam weiter", text: "Baue Selbstvertrauen, Technik und eine echte Verbindung zum Meer auf." }] } },
  it: { nav: { about: "Chi siamo" }, about: { since: "Surf a Rabat dal", title: "Un club costruito intorno all’oceano, alla comunità e alla crescita", text: "Rabat Surf Club è nato nel 2008 alla Plage des Oudayas con un obiettivo semplice: rendere il surf accessibile, accogliente e divertente a Rabat. Oggi lo stesso spirito locale è al centro di ogni sessione, dalla prima onda al prossimo passo nel tuo percorso di surf.", location: "Plage des Oudayas, Rabat, Marocco", imageAlt: "Surfista su un'onda alla Plage des Oudayas di Rabat", values: [{ title: "Dal 2008", text: "Una presenza surf locale di lunga esperienza a Rabat." }, { title: "Spirito locale", text: "Impara direttamente in spiaggia con un team che conosce Oudayas." }, { title: "Cresciamo insieme", text: "Sviluppa fiducia, tecnica e un vero legame con l’oceano." }] } },
  pt: { nav: { about: "Sobre nós" }, about: { since: "Surf em Rabat desde", title: "Um clube construído à volta do oceano, da comunidade e da evolução", text: "O Rabat Surf Club começou em 2008 na Praia dos Oudayas, com um objetivo simples: tornar o surf acessível, acolhedor e divertido em Rabat. Hoje, esse espírito local continua no centro de cada sessão, desde a primeira onda até ao próximo passo na tua evolução no surf.", location: "Praia dos Oudayas, Rabat, Marrocos", imageAlt: "Surfista numa onda na Praia dos Oudayas em Rabat", values: [{ title: "Desde 2008", text: "Uma presença local de surf de longa data em Rabat." }, { title: "Espírito local", text: "Aprende diretamente na praia com uma equipa que conhece Oudayas." }, { title: "Evoluir juntos", text: "Ganha confiança, técnica e uma ligação real ao oceano." }] } },
  nl: { nav: { about: "Over ons" }, about: { since: "Surfen in Rabat sinds", title: "Een club gebouwd rond de oceaan, gemeenschap en vooruitgang", text: "Rabat Surf Club begon in 2008 aan Plage des Oudayas met een eenvoudig doel: surfen in Rabat toegankelijk, gastvrij en leuk maken. Vandaag staat die lokale sfeer nog steeds centraal in elke sessie, van de eerste golf tot de volgende stap in je surfontwikkeling.", location: "Plage des Oudayas, Rabat, Marokko", imageAlt: "Surfer op een golf bij Plage des Oudayas in Rabat", values: [{ title: "Sinds 2008", text: "Een langdurige lokale surfaanwezigheid in Rabat." }, { title: "Lokale sfeer", text: "Leer direct op het strand van een team dat Oudayas kent." }, { title: "Samen vooruit", text: "Bouw vertrouwen, techniek en een echte band met de oceaan op." }] } },
  tr: { nav: { about: "Hakkımızda" }, about: { since: "Rabat'ta sörf", title: "Okyanus, topluluk ve gelişim etrafında kurulmuş bir kulüp", text: "Rabat Surf Club, Rabat'ta sörfü erişilebilir, samimi ve eğlenceli hale getirmek amacıyla 2008 yılında Oudayas Plajı'nda başladı. Bugün bu yerel ruh, ilk dalgadan sörf yolculuğundaki bir sonraki adıma kadar her dersin merkezinde olmaya devam ediyor.", location: "Oudayas Plajı, Rabat, Fas", imageAlt: "Rabat Oudayas Plajı'nda dalga süren sörfçü", values: [{ title: "2008'den beri", text: "Rabat'ta uzun yıllara dayanan yerel sörf deneyimi." }, { title: "Yerel ruh", text: "Oudayas'ı bilen bir ekiple doğrudan sahilde öğren." }, { title: "Birlikte gelişelim", text: "Özgüven, teknik ve okyanusla gerçek bir bağ geliştir." }] } },
  zh: { nav: { about: "关于我们" }, about: { since: "拉巴特冲浪始于", title: "一个围绕海洋、社区与成长而建立的俱乐部", text: "Rabat Surf Club 于 2008 年在乌达雅斯海滩开始运营，目标很简单：让拉巴特的冲浪更加容易接触、友好而有趣。如今，从第一道浪到冲浪旅程的下一步，这份本地精神依然贯穿每一次课程。", location: "乌达雅斯海滩，拉巴特，摩洛哥", imageAlt: "在拉巴特乌达雅斯海滩冲浪的冲浪者", values: [{ title: "始于 2008", text: "扎根拉巴特的长期本地冲浪体验。" }, { title: "本地精神", text: "与熟悉乌达雅斯的团队一起直接在海滩学习。" }, { title: "一起进步", text: "建立信心、技术以及与海洋的真实连接。" }] } },
  ja: { nav: { about: "私たちについて" }, about: { since: "ラバトでのサーフィンは", title: "海、コミュニティ、上達を大切にするクラブ", text: "Rabat Surf Clubは2008年にウダヤスビーチで始まりました。ラバトでサーフィンをもっと身近で、温かく、楽しいものにすることがシンプルな目標でした。今も、最初の波から次のステップまで、そのローカルな精神をすべてのセッションの中心にしています。", location: "ウダヤスビーチ、ラバト、モロッコ", imageAlt: "ラバトのウダヤスビーチで波に乗るサーファー", values: [{ title: "2008年から", text: "ラバトに根付いた長年のローカルサーフィン。" }, { title: "ローカルな精神", text: "ウダヤスを知るチームとビーチで直接学べます。" }, { title: "一緒に成長", text: "自信、技術、そして海との本当のつながりを育てます。" }] } },
  ko: { nav: { about: "소개" }, about: { since: "라바트 서핑은", title: "바다와 커뮤니티, 성장을 중심으로 만들어진 클럽", text: "Rabat Surf Club은 2008년 우다야스 해변에서 시작되었습니다. 라바트에서 서핑을 더 쉽게 접하고, 편안하고, 즐겁게 만드는 것이 목표였습니다. 오늘도 첫 파도부터 다음 단계까지 이 지역의 정신을 모든 세션의 중심에 두고 있습니다.", location: "우다야스 해변, 라바트, 모로코", imageAlt: "라바트 우다야스 해변에서 파도를 타는 서퍼", values: [{ title: "2008년부터", text: "라바트에 뿌리내린 오랜 지역 서핑 경험." }, { title: "현지의 정신", text: "우다야스를 잘 아는 팀과 해변에서 직접 배워보세요." }, { title: "함께 성장", text: "자신감, 기술, 그리고 바다와의 진정한 연결을 키워보세요." }] } },
};

function getLocaleDictionary(lang: Lang): Dict {
  if (lang === "en") return deepMerge(baseDict.en, aboutTranslations.en) as Dict;
  if (lang === "fr") return deepMerge(baseDict.fr, aboutTranslations.fr) as Dict;
  if (lang === "ar") return deepMerge(baseDict.ar, aboutTranslations.ar) as Dict;
  return deepMerge(
    deepMerge(localeCompletion[lang] ?? {}, extraTranslations[lang] ?? {}),
    aboutTranslations[lang] ?? {},
  ) as Dict;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Read persisted preference after mount (client-only; keeps SSR markup stable).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGUAGES.some((language) => language.code === stored)) {
      setLangState(stored);
    }
  }, []);

  const dir = useMemo<"ltr" | "rtl">(
    () => LANGUAGES.find((language) => language.code === lang)?.dir ?? "ltr",
    [lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: getLocaleDictionary(lang),
      dir,
    }),
    [lang, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
