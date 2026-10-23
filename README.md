# Vantage Technologies

An editorial-style Vite website for Vantage Technologies with a small Express API for project inquiries. The backend is intentionally scoped to the current product: it stores and validates inquiries. There is no user account or admin dashboard, so private inquiry reads and updates are not exposed without a future authenticated operator surface.

## Architecture

```text
src/main.js                       Vite frontend and client-side routes
backend/config.js                 environment/config parsing
backend/app.js                    Express application composition
backend/routes/                   HTTP route wiring
backend/controllers/              request/response handlers
backend/services/                 business rules
backend/repositories/             database access
backend/validation/               request validation and allowed values
backend/middleware.js             request IDs, CORS, rate limiting, errors, headers
backend/db/migrations/            ordered SQLite migrations
backend/db/database.js            connection, migration runner, legacy import
data/vantage.sqlite               runtime database (ignored by Git)
```

SQLite is the appropriate first database for this small single-instance inquiry service. It gives durable local persistence, constraints, indexes, and transactional migrations without adding a separate database server. Move to a managed PostgreSQL-compatible service before running multiple application instances or requiring managed backups/replication.

## Run locally

Install dependencies:

```bash
npm install
```

Initialize the database and import the existing legacy inquiry file:

```bash
npm run db:migrate
```

Start the backend separately:

```bash
npm run backend       # http://localhost:4174
```

Start the frontend in another terminal:

```bash
npm run dev           # http://localhost:5173
```

Vite proxies `/api` requests to `http://localhost:4174` by default. Override it with `BACKEND_URL` when needed.

## Production-style single server

```bash
npm run db:migrate
npm run build
npm start             # frontend + API at http://localhost:4173
```

The combined server:

- Serves the built frontend.
- Mounts the same backend application.
- Injects route-specific metadata into initial HTML.
- Returns a real `404` for unknown page routes.
- Returns JSON errors for unknown `/api` routes.

## Environment variables

Copy `.env.example` into the environment used by the process manager. The application does not load `.env` files automatically; use your host's secret/environment configuration or export variables before starting the process.

```env
VITE_API_URL=
BACKEND_URL=http://localhost:4174
BACKEND_PORT=4174
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_PATH=data/vantage.sqlite
LEGACY_INQUIRY_STORE_PATH=data/inquiries.ndjson
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1
```

For separate deployment, build the frontend with the public API origin:

```bash
VITE_API_URL=https://api.example.com npm run build
```

Run the backend with the actual frontend origin:

```bash
FRONTEND_ORIGIN=https://www.example.com npm run backend
```

Use comma-separated values for multiple allowed frontend origins. Set `TRUST_PROXY=true` only when the service is behind a trusted reverse proxy that correctly sets client IP headers.

## API

### `GET /health`

Liveness check. Does not expose database records.

### `GET /ready` or `GET /api/ready`

Readiness check. Verifies that SQLite can execute a query.

### `POST /api/inquiry`

Requires `Content-Type: application/json`.

Request:

```json
{
  "name": "Client name",
  "email": "client@example.com",
  "company": "Optional company",
  "service": "Software & web applications",
  "budget": "Prefer to discuss",
  "description": "At least twenty characters describing the project."
}
```

Accepted service values are defined once in `backend/validation/inquiry.js` and mirrored by the frontend content. Successful requests return `201` with an inquiry ID and request ID. Errors use this shape:

```json
{
  "ok": false,
  "error": "Please correct the highlighted fields.",
  "code": "VALIDATION_ERROR",
  "requestId": "...",
  "fields": {
    "email": "Please enter a valid business email."
  }
}
```

The public API intentionally only creates inquiries. Listing, status updates, and deletion exist at the repository layer for a future authenticated operator surface; they are not exposed publicly because inquiry data is private.

## Database and migration behavior

`npm run db:migrate` creates:

- `schema_migrations`
- `inquiries`
- Created-at, status, and email indexes

The first startup/migration imports valid records from the legacy `data/inquiries.ndjson` file with `INSERT OR IGNORE`, preserving existing IDs and leaving the original file untouched as a backup. SQLite uses WAL mode, foreign keys, and a busy timeout. Runtime database files are ignored by Git.

The current database stores:

- Name
- Email
- Company
- Service
- Budget
- Description
- Status (`new`, `contacted`, `in_progress`, `closed`)
- Source
- Created/updated timestamps

Back up `DATABASE_PATH` plus its SQLite WAL/SHM files safely using a database-aware backup process or a stopped-process copy. Do not commit the database to source control.

## Testing and build

```bash
npm test
npm run build
npm audit --omit=dev
```

The backend tests cover health/readiness, JSON/content validation, persistence across restart, legacy migration, repository filtering/status/deletion, honeypot protection, malformed JSON, CORS, unknown API routes, and rate limiting.

## Inquiry notifications

Email delivery is not configured. Accepted inquiries are stored in SQLite but are not automatically sent to `hello@vantagetechnologies.in`. Before launch, connect a verified email provider such as Resend, Postmark, SendGrid, SES, or SMTP entirely from the backend, and add a failure-aware notification flow. Never put provider credentials in `VITE_*` variables or the frontend bundle.

## Deployment checklist

1. Use a supported Node.js runtime for `better-sqlite3` and lock the runtime version in the hosting environment.
2. Set `DATABASE_PATH` to durable persistent storage.
3. Run `npm run db:migrate` during deployment.
4. Configure HTTPS at the reverse proxy or hosting platform.
5. Set `FRONTEND_ORIGIN` to the exact production frontend origin.
6. Set `TRUST_PROXY=true` only behind a trusted proxy.
7. Configure database backups and restore testing.
8. Configure email notifications before promising inquiry follow-up.
9. Run `GET /ready` after deployment.
10. Confirm browser console/network output and submit a real controlled inquiry from the deployed domain.

## Content updates

Service content lives in the `services` array in `src/main.js`. Demonstration work is intentionally labelled as such; client projects should only be added to the projects page once the work and any outcomes are verified and approved for publication.
