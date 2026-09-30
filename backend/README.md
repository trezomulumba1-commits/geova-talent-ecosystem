# GEOVA Backend

FastAPI backend for the GEOVA Talent Ecosystem — Education, Skills & Employment
Networking Platform. Connects the existing React frontend (see parent `README.md`)
to a persistent database and business logic.

## Stack

| Layer     | Choice                                   |
|-----------|------------------------------------------|
| Runtime   | Python 3.12 + FastAPI + uvicorn          |
| Tooling   | `uv` (venv + deps, see `uv.lock`)        |
| ORM       | SQLAlchemy 2.0 (async)                   |
| Migrations| Alembic                                 |
| Database  | SQLite (`aiosqlite`) for dev; Supabase PostgreSQL (`asyncpg`) later |
| Auth      | PyJWT + bcrypt (self-managed, matches the existing `/api/auth/*` contract) |
| Validation| Pydantic v2 + auto OpenAPI docs          |
| AI        | google-genai (proxy to existing `/api/gemini/*`) |
| Tests     | pytest + httpx AsyncClient               |
| Deploy    | Render (serves built frontend + API)     |

## Run (dev)

Two terminals:

```bash
# terminal 1 — frontend (Vite, proxies /api -> :8000)
npm run dev

# terminal 2 — backend (FastAPI)
npm run backend:dev        # or: cd backend && uv run uvicorn app.main:app --reload
```

- Frontend: http://localhost:5173
- API health:  http://localhost:8000/api/health
- Swagger:     http://localhost:8000/docs

The legacy Node dev server is still available as `npm run dev:legacy` and remains
the production entrypoint (`npm start`) until the deployment stage (Stage 12).

### Demo accounts

| Role     | Email              | Password    |
|----------|--------------------|-------------|
| student  | student@geova.ai   | student123  |
| employer | recruiter@geova.ai | company123  |
| provider | faculty@geova.ai   | school123   |
| admin    | admin@geova.ai     | admin123    |

## Tests

```bash
uv run pytest
```

## Env

```
DATABASE_URL=sqlite+aiosqlite:///./geova.db   # later: postgresql+asyncpg://...
JWT_SECRET=change-me
JWT_EXPIRES_DAYS=7
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
```

## Decision log

- **Roles**: `student | employer | provider | admin`. Frontend portals map:
  `student` → student (job seekers register here), `company` → employer,
  `school` → provider (educational institutions + training providers).
  `admin` is new and has no frontend UI yet (added in Stage 8).
- **Identifiers**: friendly slug ids (e.g. `alex-mwansa`, `nebula-ai`) to match
  the existing frontend mock-data lookups. Revisit UUIDs later if requirements
  change.
- **FastAPI** over Django/Flask: typed API + Pydantic validation + auto Swagger docs;
  smallest gap between the frontend's existing `/api/*` contract and a new backend.
- **Self-managed JWT** (PyJWT + bcrypt) rather than Supabase Auth: keeps the
  existing `authService.ts` contract (login/register/me/profile/logout) intact.
  Supabase is used only as a PostgreSQL host, wired up at deployment stage.
- **Dev DB = SQLite**, production DB = Supabase Postgres. Schemas/migrations are
  Postgres-compatible (Alembic handles both); only `DATABASE_URL` changes.
- **Scope = "goal"**: admin, opportunity management and analytics on the backend,
  plus a minimal "post opportunity" modal in the frontend. Forum and squads stay
  frontend-only for now.
- **Contract-first**: every endpoint is defined as Pydantic schemas before
  implementation; responses match what the frontend views already expect.

## Module roadmap

0. Preparation (this doc) ✅
1. Project setup (FastAPI skeleton, health, CORS, Vite proxy) ✅
2. Database architecture (SQLAlchemy models, Alembic, seed) — on hold; the
   in-memory `app/store.py` is the active backend and keeps the same interface
3. Authentication (bcrypt + JWT, register/login/me/logout/profile, role guards) ✅
   AI endpoints (`/api/gemini/*`) ported to FastAPI ✅
4. User/profile system + discover search/filter ✅
   `GET /api/users/students` · `GET /api/users/employers` · `GET /api/users/{id}`
   `GET|PATCH /api/profiles/me` (paginated, q/skills/industry/location/available/verified)
5. Opportunities (CRUD, publish/close, my-list) ✅
   `GET /api/opportunities` (paginated, q/type/location/companyId/tag/status)
   `GET /api/opportunities/{id}` · `POST` · `PATCH` · `DELETE` · `POST /{id}/status`
   `GET /api/opportunities/mine` (employer + admin only; drafts hidden from public)
6. Search/filtering + pagination across discover endpoints
7. Networking (connections, collabs + interest)
8. Administration (user management, moderation, analytics)
9. Frontend ↔ API integration (swap mock state, post-opportunity modal)
10. Validation & security hardening
11. Testing & coverage
12. Deployment (Render + Supabase Postgres)
13. Final documentation