# Rabat Surf Club automation architecture

The project contains the public multilingual website and an `/admin` control center.

## Production-safe foundation already in the project

- Live surf/weather forecast refresh from Open-Meteo.
- Localized date formatting for all supported languages.
- 13-language UI with Arabic RTL support.
- No English fallback for non-English public locales.
- Server-side admin password verification.
- HTTP-only admin session cookie.
- CSRF middleware for TanStack Start server functions.
- Booking and automation data model ready to move to a database.

## What remains for full 24/7 autonomous operations

Browser `localStorage` is currently a development fallback for bookings and automation settings. It must be replaced by a production database before accepting real bookings.

Recommended production services:

1. **Database:** Supabase/Postgres for bookings, customers, availability, content, translations and audit logs.
2. **Authentication:** server-side session auth or a managed provider; never localStorage-based credentials.
3. **Scheduled jobs:** cron/edge scheduler for forecast refresh, reminders, follow-ups and content workflows.
4. **Email:** transactional email provider for confirmations and reminders.
5. **WhatsApp:** WhatsApp Business Cloud API or approved provider for automated customer messaging.
6. **Translation:** translation/LLM API with a validation job that blocks missing locale keys instead of falling back to English.
7. **Payments:** Stripe or an appropriate Moroccan payment provider if deposits are enabled.
8. **Calendar:** Google Calendar integration for staff availability and lesson scheduling.
9. **Social:** Meta/Instagram APIs for approved publishing workflows.

## Autonomous workflow

Booking received → validate availability → reserve capacity → notify admin → send localized confirmation → create calendar event → 24h reminder → lesson completed → review request → reporting.

The admin remains the human override and can confirm/cancel bookings, disable an automation, edit content, or take over a customer conversation at any time.
