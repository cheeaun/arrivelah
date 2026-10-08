# AGENTS.md

Fast, minimal proxy to LTA DataMall Bus Arrival API. Single active endpoint: `GET /?id=<5-digit-bus-stop-code>` → `{ services: [...] }`.

## Layout

- `api/arrival.js` — **active code** (Vercel serverless function, ESM). `vercel.json` rewrites `/` → `/api/arrival`.
- `vercel.json` — `maxDuration: 10` for `api/arrival.js`, plus the `/` rewrite.
- `package.json` — Node `24.x`, sole runtime dep `undici`. `npm start` = `vercel dev`.
- `server.js`, `service.js` — **legacy / reference only** (old `got` + `agentkeepalive` implementations, `dotenv`, `NOW_REGION`/`VERCEL_REGION` checks). Do not update unless explicitly asked.
- `experiment/`, `tests/` — git-ignored scratch work, not shipped.
- `README.md` — public API contract + acronyms (`operator`/`load`/`feature`/`type`).

## Run locally

1. `cp .env.example .env` and set `accountKeys` (space-separated LTA DataMall keys).
2. `npm install`
3. `npm start` (requires Vercel CLI: `npm i -g vercel`)
4. `curl 'http://localhost:3000/?id=83139'`

No tests, linter, or build step. Verify manually with curl and check cache/CORS headers.

## Environment

- `accountKeys` (required, space-separated) — random key per request via `crypto.randomBytes`. Log only first 4 chars.
- Never commit `.env`. `.env.example` is the template.

## Implementation details (`api/arrival.js`) — preserve these

- **Upstream:** `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=<id>` with `AccountKey` header, via `undici` `request` + shared `Agent`.
- **Networking:** IPv4-only DNS (`dualStack: false, affinity: 4`, 1h TTL) — Vercel `sin1` can't reach some IPv6 routes. `headersTimeout`/`bodyTimeout` 4s. Retry once (`maxRetries: 1`, 500ms→2s) on `500,502,503,504` only; never retry `429`; `throwOnError: false` so 5xx responses are handled, not thrown.
- **Validation:** `id` from `req.query.id` (first element if array) with URL fallback; `trim()`; must match `/^\d{5}$/`. Missing → info JSON (`cache 300s`); malformed → `{ error, statusCode: 400 }`.
- **Response shape:** per service `{ no, operator, next, subsequent, next2, next3 }` where `subsequent` is a legacy alias of `next2`. Each arrival: `{ time, duration_ms (vs `Date.now()`), lat/lng (rounded to 6dp, ~0.1m), load, feature, type, visit_number (+coerced), origin_code, destination_code, monitored }`; return `null` when `EstimatedArrival` is empty.
- **Rounding:** `Math.round(n * 1e6) / 1e6`; preserve non-finite values as-is.
- **Headers:** `access-control-allow-origin: *`, `allow-headers: *`, `allow-credentials: true`; `content-type: application/json`. `cache-control`: default `s-maxage=5, max-age=5` (errors); success `15s`; missing-id `300s`; `OPTIONS` `204` with `86400s` + `access-control-max-age`.
- Upstream non-200 → `{ error: body.message || body.error || fallback, statusCode }`. Network throw → generic unavailable message (don't leak internals).

## Conventions

- Match file style: 2-space indent, single quotes, semicolons, ESM `import`/`export default` in `api/`.
- Keep the function dependency-free beyond `undici` + Node stdlib unless there's a strong reason.
- Keep payloads small and fast: no extra fields, no extra upstream calls, stay well under `maxDuration: 10`.
- Update `README.md` example output if the response shape changes.

## Do not

- Don't add frameworks, dotenv, or `got`/`agentkeepalive` to the active path.
- Don't change cache durations, retry/timeout policy, DNS affinity, or CORS headers without asking — they encode prod incident fixes.
- Don't log full account keys or commit secrets.
- Don't touch `server.js` / `service.js` / `experiment/` / `tests/` for active-path work.
