# Rabat Surf Club

Website for Rabat Surf Club — surf lessons on Plage des Oudayas, Rabat, led by Coach Jalal.

## About

Rabat Surf Club offers beginner and intermediate surf lessons at Plage des Oudayas, with all equipment (board, leash, wetsuit) included.

- **Location**: Rabat Surf Club (Club N°1), Plage des Oudayas, Rabat
- **Contact**: +212 6 91 29 12 34 / +212 6 61 65 43 62 (WhatsApp / Phone)
- **Group size**: 1 coach per 6 adults or 4 children max

## Pricing

| Package | Price |
|---|---|
| Single 2-hour lesson | 150 DHS |
| 6-lesson package (1.5h each) | 500 DHS |
| 10-lesson package (1.5h each) | 700 DHS |

## Development

Requires Node.js.

```sh
npm i
npm run dev
```

## Build

```sh
npm run build
```

## Production configuration

The admin area uses a server-side password and an HTTP-only session cookie. Before deployment, set `SESSION_SECRET` (32+ random characters) and `ADMIN_PASSWORD` as server environment variables. Do not prefix either variable with `VITE_`.

The public site uses live Open-Meteo forecast requests. Booking records and automation settings in this version are still browser-local; connect them to a production database before relying on them for real bookings.

### Validation

- `npm install`
- `npm run build`
- `npm run preview`
- `npm run lint`

This environment cannot perform the dependency install because external npm DNS/network access is unavailable, so the production bundle must be confirmed on a machine with registry access.
