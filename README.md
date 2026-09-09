# AISTATS

A production-ready full-stack starter application.

- **Frontend:** React + Vite + TypeScript dashboard with live data, loading and error states, ESLint, and type checking.
- **Backend:** Python FastAPI service with CORS, a health check, example REST endpoints, and pytest tests.

The frontend fetches live data from the backend and renders it on a dashboard.

```
.
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # App factory, CORS, router wiring
│   │   ├── config.py        # Env-driven settings (pydantic-settings)
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── services.py      # Sample data providers
│   │   └── routers/api.py   # /api routes: health, stats, activities, echo
│   ├── tests/test_api.py    # pytest suite (TestClient)
│   ├── requirements.txt
│   ├── pytest.ini
│   └── .env.example
├── frontend/                # React + Vite + TypeScript app
│   ├── src/
│   │   ├── api.ts           # Typed API client with error handling
│   │   ├── App.tsx          # Dashboard page
│   │   ├── components/      # MetricCard, ActivityFeed, StatusPanel, EchoCard
│   │   └── hooks/useAsync.ts
│   ├── package.json
│   ├── eslint.config.js
│   ├── tsconfig*.json
│   ├── vite.config.ts
│   └── .env.example
├── scripts/install.sh       # Idempotent install for both apps
├── .cursor/environment.json # Reproducible Cursor Cloud environment
└── .gitignore
```

## Prerequisites

- **Python** 3.11+ (tested on 3.12)
- **Node.js** 18+ (tested on 22) and npm

## Quick start

Clone the repo, then install and run both apps.

### 1. Install dependencies

Either run the helper script (sets up a Python virtualenv and installs npm packages):

```bash
bash scripts/install.sh
```

…or set each app up manually (see below).

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The defaults work out of the box for local development.

### 3. Run the backend

```bash
cd backend
python3 -m venv .venv          # first time only
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API root: <http://localhost:8000/>
- Interactive docs (Swagger UI): <http://localhost:8000/docs>
- Health check: <http://localhost:8000/api/health>

### 4. Run the frontend

In a second terminal:

```bash
cd frontend
npm install                    # first time only
npm run dev
```

Open <http://localhost:5173>. The dashboard shows a live "Backend: Connected"
status, metric cards, a recent-activity feed, and an interactive form that
calls the backend.

## API endpoints

| Method | Path              | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| GET    | `/`               | Service info (links to docs and health)      |
| GET    | `/api/health`     | Health check (status, version, environment)  |
| GET    | `/api/stats`      | Dashboard metrics                            |
| GET    | `/api/activities` | Recent activity feed (`?limit=1..50`)        |
| POST   | `/api/echo`       | Echo a `{ "message": "..." }` payload back   |

## Testing

### Backend tests (pytest)

```bash
cd backend
source .venv/bin/activate
pytest
```

### Frontend lint & type checking

```bash
cd frontend
npm run lint          # ESLint
npm run typecheck     # tsc -b --noEmit
```

### Frontend production build

```bash
cd frontend
npm run build         # type-checks then builds to dist/
npm run preview       # serve the production build locally
```

## Environment variables

### Backend (`backend/.env`)

| Variable       | Default                                             | Purpose                              |
| -------------- | --------------------------------------------------- | ------------------------------------ |
| `APP_NAME`     | `AISTATS API`                                       | Service name in responses            |
| `ENVIRONMENT`  | `development`                                       | Deployment environment label         |
| `DEBUG`        | `true`                                              | Debug flag                           |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173`       | Comma-separated allowed CORS origins |

### Frontend (`frontend/.env`)

| Variable            | Default                 | Purpose                         |
| ------------------- | ----------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL of the FastAPI backend |

## Deployment

- **Backend:** run under a production ASGI server, e.g.
  `uvicorn app.main:app --host 0.0.0.0 --port 8000` (add `--workers N` or run
  behind Gunicorn with `uvicorn.workers.UvicornWorker`). Set `ENVIRONMENT=production`,
  `DEBUG=false`, and `CORS_ORIGINS` to your deployed frontend origin.
- **Frontend:** `npm run build` produces static assets in `frontend/dist/`,
  which can be served by any static host or CDN. Set `VITE_API_BASE_URL` to the
  deployed backend URL at build time.

## Cursor Cloud environment

`.cursor/environment.json` makes the project reproducible in Cursor Cloud
Agents: it installs both apps via `scripts/install.sh` and launches the backend
and frontend dev servers as named terminals on ports 8000 and 5173.
