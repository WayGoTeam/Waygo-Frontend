# WayGo Frontend

A complete web dashboard for **WayGo-Backend** — Baku's live traffic map, route
planner, incident feed, analytics, transit network, weather, and an AI mobility
assistant. Built to match the WayGo product design and wired end-to-end to the
real Spring Boot API (no mock data).

React 19 · TypeScript · Vite · Tailwind CSS v4 · Leaflet · Socket.IO client · Recharts

## Quick start

```bash
npm install
cp .env.example .env.local   # defaults already match a local backend on :8080 / :8081
npm run dev
```

Open `http://localhost:5173`. In a separate terminal, run the backend as usual
(`./gradlew bootRun`, default port `8080`, Socket.IO on `8081`).

The dev server proxies `/api/**` to `http://localhost:8080` (see `vite.config.ts`),
so nothing else needs to be running or configured for local development —
just the backend, with a `.env` that has at least `DB_*` and `JWT_SECRET` set.
`TOMTOM_API_KEY` is optional but the map, search, routing, and traffic-flow
overlay all degrade gracefully without it (blank tiles / empty search results)
rather than breaking.

Admin login (approving/rejecting reports) uses the seeded credentials from
`SampleDataSeeder`: `admin` / `WayGo#2026!Admin`.

## Production build

```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview   # serve the production build locally
```

For a deployment where the frontend isn't served from the same origin as the
API, set `VITE_API_BASE_URL` to an absolute URL (see `.env.example`).

## How it's wired to the backend

Every network call lives under `src/api/*.ts`, one file per backend area
(`traffic.ts`, `weather.ts`, `maps.ts`, `auth.ts`, `chat.ts`, `transit.ts`,
`reports.ts`, `admin.ts`). Response shapes in `src/types/api.ts` mirror the
Java records field-for-field. A few things worth knowing if you're extending
either side:

- **Two ports.** The REST API and the Socket.IO server
  (`SocketIoConfiguration`) run on separate ports (`8080` / `8081` by
  default). `src/context/SocketContext.tsx` connects to `VITE_SOCKET_URL`
  independently of the REST base URL.
- **Cookies, not localStorage.** Auth uses the backend's HttpOnly JWT cookies
  (`AuthCookieWriter`) — every request goes through `credentials: 'include'`
  in `src/api/client.ts`. The frontend never reads or stores the token itself.
- **Smart ETA needs known segments.** `POST /smart-eta` only accepts the
  backend's existing `RoadSegment` objects (it reads `.id` server-side and
  404s on anything else) — it can't forecast an arbitrary TomTom route
  directly. `src/hooks/useRoutePlanner.ts` picks whichever seeded segments
  run closest to the computed route (`src/lib/geo.ts`), asks `/smart-eta` for
  their forecast curve, and applies that curve's *ratios* to the route's real
  TomTom baseline duration — so the "Trafik proqnozu" panel stays consistent
  with the headline ETA instead of showing a disconnected number.
- **"Aktiv" vs "Canlı" incidents.** `GetIncidentsUseCase` always sets
  `active: true` — there's currently no backend path that produces `false`,
  so an Active/All filter would be a no-op and isn't in the UI. Instead, the
  bottom status bar and the map's "Hadisələr" / "Canlı hadisələr" layer
  toggles split incidents by `source` (`USER_REPORT` vs `ANOMALY_DETECTION`),
  which is a real, meaningful distinction in the data.
- **Metro stations ↔ lines.** `MetroStationDto.line` is a bare color keyword
  (`"red"/"green"/"purple"`), while `MetroLineDto` only has a display name and
  hex color — there's no shared id. `src/lib/transit.ts` resolves the keyword
  to the matching hex to group stations under the right line.
- **Report submissions need a real UUID.** `SubmitReportRequest.userId` is a
  strict `UUID` server-side. Since there's no citizen-facing login, the
  report form (`ReportIncidentModal`) generates one UUID per browser via
  `crypto.randomUUID()`, stores it in `localStorage`, and reuses it.
- **Map tiles.** The base layer (street/satellite) uses the direct CDN URLs
  from `GET /map-config` (CartoDB Voyager / ArcGIS World Imagery — no key
  needed). Only the colored traffic-flow overlay goes through the backend's
  own TomTom-backed tile proxy, since that's the one that actually needs the
  key.

## Project structure

```
src/
  api/            One module per backend area — every fetch call lives here
  components/
    layout/       Sidebar, Topbar, global search, app shell
    map/          Live map, route planner, layer control, legend, status bar
    chat/         WayGo AI floating assistant
    incidents/    Incident row/icons, the report-an-incident modal
    weather/      Weather icon + sidebar mini card
    transit/      Metro/bus mini map
    admin/        Login form, pending-reports table
    common/       Cross-page primitives (buttons, states, modal, popover...)
  context/        Auth, Socket.IO, live incidents, map-layer toggles (shared app state)
  hooks/          Polling data hooks + the route-planning state machine
  i18n/           AZ/EN string tables (src/i18n/strings.ts) + locale context
  lib/            Congestion color bands, formatting, geo matching, map icons
  pages/          One file per sidebar route
  types/api.ts    TypeScript mirror of the backend's Java records
```

## Notes

- All UI chrome is bilingual (AZ default, EN via the topbar switcher); content
  that comes from the backend itself (segment names, descriptions) is shown
  as the backend returns it.
- Real-time: `incident:created` and `report:pending` events from Socket.IO
  merge live into the incident list and notification bell without a refresh.
- No `react-query`/SWR — polling hooks (`src/hooks/usePolling.ts`) are
  intentionally simple. If you add more pages that need the same data,
  consider lifting more of them into `IncidentsContext`-style shared contexts
  (already done for incidents, since Sidebar/Topbar/pages all need the same
  count) rather than each page polling independently.
