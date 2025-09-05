# Data Atlas Frontend (React + Vite + TS)

A clean React SPA wired to your FastAPI backend.

## Quick start

1) **Install deps**
```bash
npm install
```

2) **Start dev server**
```bash
npm run dev
```
It runs at http://localhost:5173 and proxies API requests to http://localhost:8000 for these routes:
`/auth`, `/db`, `/ingest`, `/metadata` (see `vite.config.ts`).

3) **Backend**
Make sure your FastAPI is running locally:
```bash
uvicorn main:app --reload --port 8000
```

4) **Build**
```bash
npm run build && npm run preview
```

## Pages
- **/login** – Register or login (JWT is stored in localStorage).
- **/dashboard** – Overview.
- **/connect** – Create/list MongoDB connections (POST /db/connect, GET /db/list).
- **/ingest** – Run ingest for a selected connection (POST /ingest/mongodb/{connection_id}).
- **/metadata** – Update collection/field notes and run auto-PII.
- **/profile** – Shows `/auth/me` response.

> If your API payloads differ, tweak the body shapes in `src/pages/*` and `src/api/client.ts`.