import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, ArrowLeft, CalendarCheck, CheckCircle2, Clock3, Globe2, LogOut, Save, Settings2, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { getAutomationSettings, getBookings, saveAutomationSettings, updateBookingStatus, type AutomationSettings, type Booking } from "../lib/automation";
import { getAdminSession, loginAdmin, logoutAdmin } from "../lib/admin-auth";

export const Route = createFileRoute("/admin")({ component: AdminPage });


function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<AutomationSettings>(getAutomationSettings());
  const [saved, setSaved] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    getAdminSession().then((result) => setAuthenticated(result.authenticated)).catch(() => setAuthenticated(false));
    setBookings(getBookings());
  }, []);

  // Keep all hooks above the conditional login render.
  // This prevents React from changing the hook order when authentication changes.
  const stats = {
    total: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
  };

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (loggingIn) return;
          setLoginError("");
          setLoggingIn(true);
          try {
            const result = await loginAdmin({ data: { password } });
            if (result.ok) {
              setAuthenticated(true);
              setPassword("");
            } else {
              setLoginError("Incorrect admin password.");
            }
          } catch (error) {
            console.error("Admin login failed", error);
            setLoginError(error instanceof Error ? error.message : "Unable to sign in. Check the server configuration.");
          } finally {
            setLoggingIn(false);
          }
        }} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <ShieldCheck className="h-10 w-10 text-cyan-300" />
          <h1 className="mt-5 text-3xl font-black">Rabat Surf Club Admin</h1>
          <p className="mt-2 text-sm text-white/60">Manage bookings and automation from one place.</p>
          <input value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(""); }} type="password" placeholder="Admin password" autoComplete="current-password" required className="mt-7 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-cyan-400" />
          {loginError && <p role="alert" className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{loginError}</p>}
          <button type="submit" disabled={loggingIn || !password} className="mt-3 w-full cursor-pointer rounded-xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50">{loggingIn ? "Signing in…" : "Sign in"}</button>
          <p className="mt-4 text-xs text-white/40">Admin access is protected by a server-side password and an HTTP-only session cookie.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
        </form>
      </main>
    );
  }

  const refresh = () => setBookings(getBookings());
  const toggle = (key: keyof AutomationSettings) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Control center</p><h1 className="mt-1 text-2xl font-black">Rabat Surf Club</h1></div>
          <div className="flex items-center gap-3"><Link to="/" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">View site</Link><button onClick={async () => { await logoutAdmin(); setAuthenticated(false); }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"><LogOut className="h-4 w-4" /> Logout</button></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Stat icon={CalendarCheck} label="Total bookings" value={stats.total} />
          <Stat icon={Clock3} label="New requests" value={stats.new} />
          <Stat icon={CheckCircle2} label="Confirmed" value={stats.confirmed} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Automation</p><h2 className="mt-1 text-2xl font-black">Hands-off operations</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">These controls define the automations your production backend should run on schedule.</p></div><Sparkles className="h-8 w-8 text-sky-600" /></div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {([['surfForecast','Automatic surf forecast refresh','Fetch and publish fresh Oudayas conditions.'],['bookingNotifications','New booking notifications','Notify the team when a customer submits a booking.'],['reminder24h','24-hour booking reminders','Automatically remind customers before their lesson.'],['reviewFollowup','Post-lesson review follow-up','Ask completed bookings for a review.'],['translationSync','Translation synchronization','Generate and validate every localized string.'],['socialDrafts','Automatic social drafts','Create social content from good surf days.']] as const).map(([key,title,description]) => (
              <button key={key} onClick={() => toggle(key)} className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-sky-300">
                <div className={`mt-1 h-5 w-9 rounded-full p-0.5 ${settings[key] ? 'bg-sky-600' : 'bg-slate-300'}`}><div className={`h-4 w-4 rounded-full bg-white transition ${settings[key] ? 'translate-x-4' : ''}`} /></div>
                <div><p className="font-bold">{title}</p><p className="mt-1 text-sm text-slate-500">{description}</p></div>
              </button>
            ))}
          </div>
          <button onClick={() => { saveAutomationSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 1800); }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-bold text-white"><Save className="h-4 w-4" /> {saved ? 'Saved' : 'Save automation settings'}</button>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Bookings</p><h2 className="mt-1 text-2xl font-black">Customer requests</h2></div><button onClick={refresh} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Refresh</button></div>
          {bookings.length === 0 ? <div className="py-14 text-center text-sm text-slate-500">No bookings yet. The public booking form will appear here once connected.</div> : <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="p-3">Customer</th><th className="p-3">Package</th><th className="p-3">Date</th><th className="p-3">Guests</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-b border-slate-100"><td className="p-3"><p className="font-bold">{booking.name}</p><p className="text-xs text-slate-500">{booking.phone} · {booking.email}</p></td><td className="p-3">{booking.packageName}</td><td className="p-3">{booking.date}</td><td className="p-3">{booking.guests}</td><td className="p-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{booking.status}</span></td><td className="p-3"><div className="flex gap-2"><button onClick={() => { updateBookingStatus(booking.id,'confirmed'); refresh(); }} className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><CheckCircle2 className="h-4 w-4" /></button><button onClick={() => { updateBookingStatus(booking.id,'cancelled'); refresh(); }} className="rounded-lg bg-rose-100 p-2 text-rose-700"><XCircle className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Info icon={Activity} title="Live data" text="Surf and weather data already refreshes automatically on the public site." />
          <Info icon={Globe2} title="Global languages" text="The translation layer is ready for localized content and RTL Arabic." />
          <Info icon={Settings2} title="Production step" text="Connect a real database, authentication, email/WhatsApp provider and scheduler for true 24/7 automation." />
        </section>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof CalendarCheck; label: string; value: number }) { return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><Icon className="h-7 w-7 text-sky-700" /><p className="mt-5 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-4xl font-black">{value}</p></div>; }
function Info({ icon: Icon, title, text }: { icon: typeof Activity; title: string; text: string }) { return <div className="rounded-3xl bg-slate-900 p-6 text-white"><Icon className="h-6 w-6 text-cyan-300" /><p className="mt-4 font-black">{title}</p><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>; }
