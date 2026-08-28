export type BookingStatus = "new" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  date: string;
  guests: number;
  language: string;
  status: BookingStatus;
  notes?: string;
};

export type AutomationSettings = {
  surfForecast: boolean;
  bookingNotifications: boolean;
  reminder24h: boolean;
  reviewFollowup: boolean;
  translationSync: boolean;
  socialDrafts: boolean;
};

const BOOKINGS_KEY = "rsc-bookings-v1";
const SETTINGS_KEY = "rsc-automation-settings-v1";
const DEFAULT_SETTINGS: AutomationSettings = {
  surfForecast: true,
  bookingNotifications: true,
  reminder24h: true,
  reviewFollowup: true,
  translationSync: true,
  socialDrafts: false,
};

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]"); } catch { return []; }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window !== "undefined") localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function addBooking(input: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const booking: Booking = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new" };
  saveBookings([booking, ...getBookings()]);
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  saveBookings(getBookings().map((booking) => booking.id === id ? { ...booking, status } : booking));
}

export function getAutomationSettings(): AutomationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; } catch { return DEFAULT_SETTINGS; }
}

export function saveAutomationSettings(settings: AutomationSettings) {
  if (typeof window !== "undefined") localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function createWhatsAppBookingUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
