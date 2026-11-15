# GEOVA Talent Ecosystem — Comprehensive System Documentation

> **Platform Version:** 2.0.0-PROD  
> **Repository:** [`trezomulumba1-commits/geova-talent-ecosystem`](https://github.com/trezomulumba1-commits/geova-talent-ecosystem)  
> **Branch:** `master`  
> **Status:** Fully Operational (Zero Mock Data, Real Database Persistence, Strict RBAC)  
> **Date:** November 2026

---

## Table of Contents
1. [Executive Summary & Core Objectives](#1-executive-summary--core-objectives)
2. [High-Level Architecture & Technology Stack](#2-high-level-architecture--technology-stack)
3. [Role-Based Access Control (RBAC) & Portal Isolation](#3-role-based-access-control-rbac--portal-isolation)
4. [Complete Database Schema (All 13 Tables)](#4-complete-database-schema-all-13-tables)
5. [Complete API Catalog & Network Endpoints](#5-complete-api-catalog--network-endpoints)
6. [Frontend Architecture & Module Breakdown](#6-frontend-architecture--module-breakdown)
   - 6.1 [Candidate Portal Modules](#61-candidate-portal-modules)
   - 6.2 [Technical Interview & System Design Prep Hub](#62-technical-interview--system-design-prep-hub)
   - 6.3 [Corporate Partner (Employer) Portal](#63-corporate-partner-employer-portal)
   - 6.4 [Educator (Faculty) Portal](#64-educator-faculty-portal)
   - 6.5 [Interactive Modals & Action Workflows](#65-interactive-modals--action-workflows)
7. [Zero Mock Data Architecture & Data Flow](#7-zero-mock-data-architecture--data-flow)
8. [Design System, Theme Tokens & Accessibility](#8-design-system-theme-tokens--accessibility)
9. [Deployment & Production Architecture](#9-deployment--production-architecture)
10. [Test Accounts & Verification Guide](#10-test-accounts--verification-guide)

---

## 1. Executive Summary & Core Objectives

The **GEOVA Talent Ecosystem** is an integrated career readiness, collaborative engineering, and verified hiring platform designed to bridge the structural gap between university engineering talent, faculty mentors, and tier-1 corporate tech employers.

Unlike static job boards or unverified resume portals, GEOVA grounds candidate profiles in **demonstrated, machine-verified technical artifacts**:
* **Architectural Artifacts:** Students publish real microservice architectures, system diagrams, and audited Git repositories.
* **Squad Collaborations:** Students organize into agile squads with sprint backlogs, live task assignment, and delivery metrics.
* **Interactive Interview Simulation:** An integrated practice arena featuring voice/text pacing, system design rubrics, and dynamic readiness gauges.
* **Strict Role-Isolated Portals:** Students, corporate hiring partners, and academic faculty interact through dedicated, non-overlapping workflows backed by authenticated JSON Web Tokens (JWT).
* **100% Real Live Database:** Zero synthetic/hardcoded mockup arrays in runtime — all profile items, forum discussions, squad tasks, application pipelines, and preparation modules are read from and written to a persistent relational database.

---

## 2. High-Level Architecture & Technology Stack

The platform is designed around a modern decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 19 + TypeScript + Vite 6 + Tailwind CSS v4          │
│  - Lucide Icons   - Motion Animations   - Canvas Confetti  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API (JWT Bearer)
                               │ Vite Reverse Proxy: /api/* -> 8000
┌──────────────────────────────▼──────────────────────────────┐
│                      Server Layer                           │
│  FastAPI (Python 3.12) ASGI + Uvicorn                      │
│  - Dependency Injection (Auth, User Context, DB Sessions)  │
│  - PyJWT & Passlib/Bcrypt Security                         │
│  - Pydantic v2 Input/Output Validation & Schemas           │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLAlchemy 2.0 ORM (Async/Sync)
┌──────────────────────────────▼──────────────────────────────┐
│                    Persistence Layer                        │
│  SQLite Database (backend/geova.db)                        │
│  - 13 Relational Tables with JSON-Column Substructures      │
│  - Auto-Migration & Startup Seeder (db_seeder.py)           │
└─────────────────────────────────────────────────────────────┘
```

### Stack Components
* **Frontend:**
  * **Framework:** React 19 (`react`, `react-dom`)
  * **Language:** TypeScript 5.8 with strict type checking (`tsc --noEmit` clean)
  * **Build Tool:** Vite 6 (`vite`, `@vitejs/plugin-react`)
  * **Styling & Theming:** Tailwind CSS v4 (`@tailwindcss/vite`), standard dark mode via HTML class strategy
  * **Icons & Animation:** `lucide-react`, `motion` (Motion v12), `canvas-confetti`
* **Backend:**
  * **Framework:** FastAPI 0.141+
  * **Server:** Uvicorn 0.54+ with WatchFiles reloader
  * **ORM & Database:** SQLAlchemy 2.1+ with `aiosqlite` / SQLite (compatible with PostgreSQL via asyncpg)
  * **Authentication:** PyJWT (HS256) + Passlib/Bcrypt password hashing
  * **Validation:** Pydantic v2 (`pydantic`, `pydantic-settings`)
  * **Package Management:** Astral `uv` / standard `pip`

---

## 3. Role-Based Access Control (RBAC) & Portal Isolation

GEOVA implements server-enforced role-based access control. Permissions are embedded inside signed JWT tokens and strictly checked on both client navigation guards and backend endpoints.

### Supported Roles

| Role Key | Display Name | Associated Portal | Access Scope |
|---|---|---|---|
| `student` | Candidate | **Candidate Portal** | Discover, Project Detail, Squads Progress, Prep Hub, Practice Arena, System Architect, Resource Library, Community Forum, Application Submission. Restricted from Employer & Faculty pipelines. |
| `employer` | Corporate Partner | **Partner Portal** | Candidate Search, Technical Portfolio Review, Verified Score Inspection, Job/Internship Posting (`PostOpportunityModal`), Applicant Tracking. |
| `provider` | Academic Faculty | **Educator Portal** | Cohort Monitoring, Student Readiness Metrics, Interview Simulation Review, Verification Badge Endorsement. |
| `admin` | Administrator | **Admin Portal** | System-wide entity moderation, user management, global analytics. |

### Security Implementation Highlights
1. **No Fake Demo Logins:** All login attempts execute a real `POST /api/auth/login` request against the database. Invalid credentials reject with `401 Unauthorized`.
2. **Automatic Workspace Routing:** Upon login, `App.tsx` reads the decoded user record and automatically routes the interface into the user's authorized workspace (`mappedRole`).
3. **Portal Tamper Prevention:** The top header displays an immutable badge indicating the active portal session (`Candidate Portal`, `Partner Portal`, etc.). Unprivileged role switching is disabled.

---

## 4. Complete Database Schema (All 13 Tables)

All data is stored in relational tables managed via SQLAlchemy models in `backend/app/db_models.py`. Complex hierarchical fields (tags, lists, nested objects) utilize native `JSON` columns to ensure high-performance serialization directly matching the frontend contracts.

```
                      ┌──────────────────────┐
                      │        users         │
                      └──────────┬───────────┘
                                 │
         ┌───────────────────────┼────────────────────────┐
         │                       │                        │
         ▼                       ▼                        ▼
┌──────────────────┐   ┌──────────────────┐     ┌──────────────────┐
│ student_profiles │   │    companies     │     │   applications   │
└────────┬─────────┘   └─────────┬────────┘     └──────────────────┘
         │                       │                        ▲
         │                       ▼                        │
         │             ┌──────────────────┐               │
         │             │  opportunities   ├───────────────┘
         │             └──────────────────┘
         ▼
┌──────────────────┐   ┌──────────────────┐     ┌──────────────────┐
│   connections    │   │   collab_posts   │     │ collab_interests │
└──────────────────┘   └──────────────────┘     └──────────────────┘

┌──────────────────┐   ┌──────────────────┐     ┌──────────────────┐
│     projects     │   │   forum_posts    │     │  project_squads  │
└──────────────────┘   └──────────────────┘     └──────────────────┘

┌──────────────────┐   ┌──────────────────┐
│  prep_sessions   │   │library_resources │
└──────────────────┘   └──────────────────┘
```

### Table 1: `users`
Core user identity, hashed passwords, roles, and profiles.
* `id` (`String`, Primary Key): e.g. `usr-student-001`
* `email` (`String`, Unique, Indexed): User login email
* `password_hash` (`String`): Bcrypt salted hash
* `role` (`String`): `student`, `employer`, `provider`, or `admin`
* `name` (`String`): Full name
* `institution` (`String`, Nullable): University or organization
* `title` (`String`, Nullable): Professional headline / major
* `avatar` (`String`, Nullable): URL to avatar image
* `bio` (`Text`): Extended biography
* `skills` (`JSON`): List of string skill tags
* `created_at` (`String`): ISO 8601 timestamp

### Table 2: `student_profiles`
Detailed candidate portfolios for the discover and profile views.
* `id` (`String`, Primary Key): e.g. `alex-mwansa`
* `user_id` (`String`, Indexed): Foreign link to `users.id`
* `name` (`String`), `role` (`String`), `title` (`String`), `avatar` (`String`)
* `verified` (`Boolean`): Whether profile passed verification
* `available` (`Boolean`): Actively looking for internships/roles
* `status_text` (`String`): e.g. "Available for Summer 2027"
* `about` (`Text`): Long-form introduction
* `skills` (`JSON`): Array of verified skills
* `university` (`String`), `year` (`String`)
* `projects_count` (`Integer`)
* `projects` (`JSON`): Embedded project summary objects
* `links` (`JSON`): URLs for GitHub, LinkedIn, Website, Resume

### Table 3: `companies`
Registered employer partner accounts.
* `id` (`String`, Primary Key): e.g. `comp-nebula-ai`
* `owner_user_id` (`String`, Indexed): Owner user account
* `name` (`String`), `logo` (`String`), `industry` (`String`), `location` (`String`)
* `verified` (`Boolean`): Verified partner badge
* `active_roles_count` (`Integer`)
* `founded` (`String`), `company_size` (`String`), `about` (`Text`), `website` (`String`)

### Table 4: `opportunities`
Active internships, apprenticeships, and new graduate engineering roles.
* `id` (`String`, Primary Key): e.g. `opp-1`
* `company_id` (`String`, Indexed): Associated company identifier
* `company_name` (`String`), `company_logo` (`String`)
* `title` (`String`): e.g. "Distributed Systems Engineering Intern"
* `type` (`String`): `Internship`, `Full-time`, `Contract`
* `location` (`String`): e.g. "San Francisco, CA (Hybrid)"
* `duration` (`String`), `stipend` (`String`)
* `tags` (`JSON`): Skills filter array
* `overview` (`Text`): Detailed role narrative
* `requirements` (`JSON`): Must-haves and nice-to-haves
* `process_steps` (`JSON`): Timeline (Resume Review -> Arena Code Round -> Offer)
* `benefits` (`JSON`): Health, mentorship, compute stipends
* `hiring_manager` (`JSON`): Name, title, avatar
* `status` (`String`): `published`, `draft`, `closed`
* `applicant_count` (`Integer`)
* `posted_at` (`String`), `owner_user_id` (`String`)

### Table 5: `connections`
Networking and peer connection requests between students and recruiters.
* `id` (`String`, Primary Key): e.g. `conn-1731665421`
* `requester_id` (`String`, Indexed)
* `requester_name` (`String`), `requester_avatar` (`String`)
* `recipient_id` (`String`, Indexed)
* `recipient_name` (`String`), `recipient_avatar` (`String`)
* `message` (`Text`): Note attached to connection request
* `status` (`String`): `pending`, `accepted`, `rejected`
* `created_at` (`String`), `updated_at` (`String`)

### Table 6: `collab_posts`
Open-source and student capstone collaboration requests.
* `id` (`String`, Primary Key): e.g. `collab-1`
* `author_id` (`String`, Indexed), `author_name` (`String`), `author_avatar` (`String`)
* `phase` (`String`): `Ideation Phase`, `Prototyping`, `MVP Testing`
* `title` (`String`), `description` (`Text`)
* `tags` (`JSON`): Technology tags
* `created_at` (`String`), `updated_at` (`String`)

### Table 7: `collab_interests`
Tracks students who joined or expressed interest in a collaboration post.
* `post_id` (`String`, Primary Key)
* `profile_id` (`String`, Primary Key)
* `created_at` (`String`)

### Table 8: `projects`
Deep-dive project showcases with architecture and verified problem/solution breakdowns.
* `id` (`String`, Primary Key): e.g. `visionary-crm`
* `title` (`String`), `tagline` (`String`), `category` (`String`), `status` (`String`)
* `image` (`String`), `creator` (`JSON`), `tags` (`JSON`)
* `problem` (`Text`), `solution` (`Text`)
* `key_features` (`JSON`): Bulleted highlights
* `contribution` (`String`): Candidate's explicit contribution
* `technologies` (`JSON`), `gallery` (`JSON`)
* `live_demo_url` (`String`, Nullable), `github_url` (`String`, Nullable)
* `created_at` (`String`)

### Table 9: `applications`
Live candidate opportunity applications.
* `id` (`String`, Primary Key): e.g. `app-1731665999`
* `opportunity_id` (`String`, Indexed)
* `applicant_id` (`String`, Indexed)
* `applicant_name` (`String`), `applicant_avatar` (`String`), `applicant_role` (`String`)
* `portfolio_link` (`String`, Nullable), `github_link` (`String`, Nullable)
* `cover_note` (`Text`)
* `include_verified_score` (`Boolean`)
* `status` (`String`): `Under Review`, `Shortlisted`, `Arena Round`, `Rejected`
* `created_at` (`String`)

### Table 10: `forum_posts`
Community engineering discussions, system design Q&A, and interview debriefs.
* `id` (`String`, Primary Key): e.g. `p-1`
* `author_id` (`String`, Indexed), `author` (`String`), `author_avatar` (`String`), `role` (`String`)
* `category` (`String`): `System Design`, `Interview Debrief`, `Career Advice`, `Project Feedback`
* `title` (`String`), `content` (`Text`)
* `tags` (`JSON`)
* `upvotes` (`Integer`): Incremented live on user vote
* `replies_count` (`Integer`)
* `time_ago` (`String`), `created_at` (`String`)

### Table 11: `project_squads`
Active engineering teams working on production-grade systems.
* `id` (`String`, Primary Key): e.g. `squad-distributed-db`
* `name` (`String`), `tagline` (`String`), `icon` (`String`), `color` (`String`)
* `current_sprint` (`String`): e.g. "Sprint 4: Consensus Failover"
* `progress_percentage` (`Integer`): Dynamic calculation of completed tasks
* `members` (`JSON`): List of member profile objects
* `tasks` (`JSON`): List of task items with `id`, `title`, `status`, `priority`, `assignee`
* `created_at` (`String`)

### Table 12: `prep_sessions`
Scheduled 1-on-1 and mock technical interview rounds.
* `id` (`String`, Primary Key): e.g. `session-1`
* `date_month` (`String`), `date_day` (`String`), `title` (`String`), `time_range` (`String`)
* `type` (`String`): `technical` or `behavioral`
* `link_available` (`Boolean`)
* `created_at` (`String`)

### Table 13: `library_resources`
Structured study rubrics, masterclasses, and system design breakdown guides.
* `id` (`String`, Primary Key): e.g. `res-1`
* `section` (`String`): `technical`, `behavioral`, or `company`
* `category` (`String`): e.g. "System Architecture", "STAR Framework"
* `title` (`String`), `duration` (`String`), `image` (`String`, Nullable)
* `completed` (`Boolean`): Toggled live by candidates to increase their readiness score
* `created_at` (`String`)

---

## 5. Complete API Catalog & Network Endpoints

All endpoints are hosted at `/api/*` and return JSON. Authenticated endpoints require the header `Authorization: Bearer <token>`.

### Authentication & User Endpoints (`routers/auth.py`, `routers/users.py`)
* `POST /api/auth/login` — Authenticate credentials (`email`, `password`, `portal`). Returns JWT + user record.
* `POST /api/auth/register` — Create new account (`email`, `password`, `name`, `portal`, `institution`, `title`).
* `GET /api/auth/me` — Retrieve the currently authenticated user's session profile.
* `POST /api/auth/logout` — Revoke client session.
* `PATCH /api/auth/profile` — Update current user's profile information.
* `GET /api/users` — Admin view of all registered accounts.

### Ecosystem Core Endpoints (`routers/profiles.py`, `routers/opportunities.py`, `routers/collabs.py`, `routers/connections.py`)
* `GET /api/students` — Retrieve candidate directory.
* `GET /api/companies` — Retrieve verified corporate partner directory.
* `GET /api/opportunities` — Retrieve published opportunities with optional search filters.
* `POST /api/opportunities` — Create a new opportunity (restricted to Employer accounts).
* `GET /api/collabs` — Retrieve all collaboration project posts.
* `POST /api/collabs` — Publish a new collaboration post.
* `POST /api/collabs/{id}/interest` — Toggle candidate interest in a collaboration post.
* `POST /api/connections` — Dispatch a networking connection request with a custom message.

### Extra Features & Persistence Endpoints (`routers/ecosystem_extra.py`)
* `GET /api/projects` — Fetch all showcased projects (supports `category` and `status` query filters).
* `POST /api/projects` — Publish a new project showcase with problem, solution, technologies, and Git URLs.
* `GET /api/applications` — Fetch user applications (candidates see their own; employers see all applicants for their roles).
* `POST /api/applications` — Submit an application for an opportunity.
* `GET /api/forum/posts` — Fetch community forum discussions (ordered newest first).
* `POST /api/forum/posts` — Publish a new discussion thread.
* `POST /api/forum/posts/{post_id}/upvote` — Increment upvote count for a forum post.
* `GET /api/squads` — Retrieve all active project squads and sprint tasks.
* `POST /api/squads/{squad_id}/tasks` — Add a new sprint task to a squad.
* `PATCH /api/squads/{squad_id}/tasks/{task_id}` — Update task status (`todo`, `in-progress`, `completed`). Recalculates squad progress percentage automatically.
* `GET /api/prep/sessions` — Fetch upcoming interview sessions.
* `GET /api/prep/resources` — Fetch study guides and rubrics.
* `POST /api/prep/resources/{resource_id}/toggle` — Mark resource as completed or incomplete.

---

## 6. Frontend Architecture & Module Breakdown

The client application is organized into modular view components located in `src/components/`:

### 6.1 Candidate Portal Modules
* **Home Dashboard (`HomeDashboardView.tsx`):**
  * **Dynamic Readiness Bento Card:** Displays candidate's calculated readiness score with an animated SVG circular progress gauge.
  * **Interactive Action Items:** Direct shortcut actions to launch the arena, review sprint backlogs, or view code reviews.
  * **Application Pipeline Tracker:** Step-by-step progress visualizer tracking submitted applications across *Technical Prep*, *Recruiter Review*, *Code Evaluation*, and *Final Round*.
* **Discover Hub (`DiscoverView.tsx`):**
  * Unified search & filter across four key entities: Candidates, Projects, Companies, and Opportunities.
  * Tag filters (e.g. *Frontend*, *AI/ML*, *Validated*, *Remote*).
* **Project Showcase & Detail (`ProjectDetailView.tsx`):**
  * Displays architectural breakdowns: Problem Statement, Technical Solution, Key Features, and Candidate Contribution.
  * Embedded direct links to live demo deployments and GitHub source code.
* **Collaboration & Squad Hub (`CollabView.tsx` & `TeamSquadsProgressView.tsx`):**
  * Interactive sprint backlog tracking Raft consensus and enterprise workflow engines.
  * Live status progression buttons to advance tasks from `todo` to `in-progress` to `completed`.
  * Form modal to propose new collaboration initiatives.
* **Community Forum (`CommunityForumView.tsx`):**
  * Real-time technical discussions categorized by *System Design*, *Interview Debrief*, *Career Advice*, and *Project Feedback*.
  * Live upvoting backed by SQLite database calls.
  * Full modal form to draft and publish new community threads.
* **Global Analytics Hub (`GlobalAnalyticsView.tsx`):**
  * Benchmark visualizations comparing candidate competency against cohort percentiles.

### 6.2 Technical Interview & System Design Prep Hub
* **Prep Hub Dashboard (`PrepHubView.tsx`):**
  * Central landing for mock interview prep, scheduled sessions, and curated reading tracks.
* **Practice Arena (`PracticeArenaView.tsx`):**
  * Interactive coding and behavioral interview simulator.
  * Real-time audio pacing feedback, keyword hit tracker, and scenario prompts.
* **System Architect Sandbox (`SystemArchitectView.tsx`):**
  * Interactive drag-and-drop architectural node canvas (Load Balancers, Redis Caches, Microservices, Partitioned Databases).
  * System throughput simulation with latency and failure-injection testing.
* **Study Resource Library (`ResourceLibraryView.tsx`):**
  * Curated guides covering Concurrency, Consistent Hashing, and the STAR framework.
  * Interactive "Mark Completed" buttons that persist progress to the database and update readiness scores.
* **Performance Review (`PerformanceReviewView.tsx`):**
  * Post-session debriefs with score breakdowns and actionable feedback.

### 6.3 Corporate Partner (Employer) Portal
* **TeacherCompanyPortalView (`TeacherCompanyPortalView.tsx`):**
  * Displays candidate pipelines, applicant review feeds, and portfolio drill-downs.
  * Includes the **Post Opportunity Modal** trigger for recruiters to publish new roles directly to the database.

### 6.4 Educator (Faculty) Portal
* Cohort readiness overviews, student verification badge approvals, and curriculum alignment tracking.

### 6.5 Interactive Modals & Action Workflows
* **`ApplyModal.tsx`:** Full application modal supporting portfolio link, GitHub link, cover note, and verified score inclusion.
* **`ConnectModal.tsx`:** Networking modal with personalized messaging.
* **`PostOpportunityModal.tsx`:** Recruiter form to create job/internship listings with stipend, duration, and requirements.
* **`CreateCollabModal.tsx`:** Initiative creation modal.
* **`SettingsModal.tsx` & `UserProfileModal.tsx`:** User profile editing and preference management.

---

## 7. Zero Mock Data Architecture & Data Flow

To ensure the system behaves as a production-grade enterprise application, all synthetic in-memory mockup fallbacks have been replaced with live database operations:

1. **Root Synchronized Fetch (`App.tsx`):**
   On application mount, a parallel batch of asynchronous requests is dispatched via `apiService.ts`:
   ```typescript
   Promise.all([
     fetchStudents(),
     fetchCompanies(),
     fetchOpportunities(),
     fetchCollabs(),
     fetchProjects(),
     fetchProjectSquads(),
     fetchPrepSessions(),
     fetchLibraryResources()
   ])
   ```
2. **Optimistic Updates with Server Reconciliation:**
   For interactions such as task status toggling, resource completion, or forum upvoting, the UI applies an optimistic state transition immediately for zero latency, while simultaneously issuing a background HTTP PATCH/POST request to persist the change in `geova.db`.

---

## 8. Design System, Theme Tokens & Accessibility

### Theme Consistency & Strict Neutral Palette
The application utilizes Tailwind CSS v4 configured with modern neutral color tokens:
* **Light Mode:** Crisp, high-contrast white card surfaces (`bg-white`), neutral zinc borders (`border-zinc-200`), dark gray typography (`text-zinc-900`, `text-zinc-600`), and subtle indigo accents.
* **Dark Mode:** Deep zinc background (`bg-[#09090b]`), elevated card surfaces (`bg-zinc-900`), soft borders (`border-zinc-800`), and bright typography (`text-zinc-100`, `text-zinc-400`).
* **Zero Hardcoded Colors:** All previous hardcoded dark hexes (e.g. `#0b1c30`, `#1e293b`) have been systematically replaced with standard Tailwind `dark:` variants, ensuring light mode renders properly across all screens.

### Desktop & Mobile Responsive Layout
* **Desktop:** Clean top navigation bar with user profile dropdown and static portal indicator badge.
* **Mobile:** Responsive bottom navigation bar (`BottomNav.tsx`) with quick-switch icons.
* **Layout Safeguard:** Bottom padding is constrained to the `<main>` element (`pb-24 md:pb-0`) to eliminate bottom content clipping on full desktop screens.

---

## 9. Deployment & Production Architecture

The application is fully containerized and production-ready for deployment on **Render**, **Railway**, or **Vercel + Supabase**:

* **Dual-Service `render.yaml`:**
  * **Backend Service:** Managed Python web service running Uvicorn on `$PORT`.
  * **Frontend Service:** Static site serving Vite production build (`dist/`).
* **Production Proxy (`server.ts`):**
  * Express server that serves static frontend assets and seamlessly forwards `/api/*` traffic to the backend service.
* **Database Scalability:**
  * Currently configured for high-performance local SQLite via `aiosqlite`.
  * The backend architecture utilizes SQLAlchemy 2.0 ORM; migrating to hosted PostgreSQL (e.g. Supabase or AWS RDS) requires only setting `DATABASE_URL="postgresql+asyncpg://..."` in the environment configuration.

---

## 10. Test Accounts & Verification Guide

For live evaluations, demonstrations, or lecturer review, use these pre-seeded accounts:

| Email | Password | Role | Persona Description |
|---|---|---|---|
| `student@geova.ai` | `student123` | `student` | Alex Mwansa — Distributed Systems Lead (Candidate Portal) |
| `recruiter@geova.ai` | `company123` | `employer` | Sarah Lin — Talent Acquisition at Nebula AI (Partner Portal) |
| `faculty@geova.ai` | `school123` | `provider` | Dr. Marcus Vance — Department of Computer Science (Educator Portal) |
| `admin@geova.ai` | `admin123` | `admin` | System Administrator (Global Governance) |

---

*GEOVA Talent Ecosystem Documentation © 2026. All rights reserved.*
