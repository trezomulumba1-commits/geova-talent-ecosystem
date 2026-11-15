# GEOVA Talent Ecosystem 🌐

> **Decentralized Career Readiness, Engineering Collaboration & Verified Talent Marketplace**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141+-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy_2.0-003B57.svg)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Quick Links to Documentation

* 📚 **[Comprehensive System Documentation (DOCUMENTATION.md)](./DOCUMENTATION.md)** — Complete architectural specification, all 13 database tables, full API catalog, and module breakdowns.
* 🛠️ **[Prerequisites & Installation Guide (SETUP_AND_PREREQUISITES.md)](./SETUP_AND_PREREQUISITES.md)** — Complete list of all software to download, environment setup, and step-by-step launch commands.

---

## 🌟 Key Features

* **Zero Mock Data Architecture:** 100% of candidate profiles, company listings, opportunities, forum posts, squad backlogs, and study resources are served from a persistent relational database (SQLite via FastAPI).
* **Strict Role-Based Portal Isolation (RBAC):** Server-enforced JWT authentication separating Candidates, Corporate Partners, and Academic Educators into dedicated workspaces.
* **Technical Interview & System Design Prep Hub:**
  * **Practice Arena:** Real-time speech/text pacing and algorithmic interview simulation.
  * **System Architect Sandbox:** Interactive drag-and-drop distributed systems canvas (Caches, Load Balancers, Partitioned DBs).
  * **Curated Resource Library:** Complete with persistent completion tracking and dynamic readiness scoring.
* **Agile Project Squads:** Live sprint task tracking (`todo` ➔ `in-progress` ➔ `completed`) with automated progress percentage recalculation.
* **Community Q&A Forum:** Technical discussions, interview debriefs, and real-time upvoting persisted to the database.
* **Theme-Aware UI:** Consistent light and dark mode built on Tailwind CSS v4 design tokens.

---

## 🚀 Quick Start (2 Minutes)

### Prerequisites
Make sure you have:
1. **Node.js 20+** installed ([nodejs.org](https://nodejs.org/))
2. **Python 3.11+** installed ([python.org](https://www.python.org/))
3. **uv** (recommended) or standard `pip` ([astral.sh/uv](https://docs.astral.sh/uv/))

### 1. Start the Backend Server (Terminal 1)
```powershell
cd backend
uv run uvicorn app.main:app --reload --port 8000
```
*(On first boot, the backend automatically initializes and seeds all 13 tables into `backend/geova.db`)*

### 2. Start the Frontend Dev Server (Terminal 2)
```powershell
npm install
npm run dev
```

### 3. Open the App
Visit 👉 **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔑 Seeded Demo Credentials

Use any of these pre-seeded accounts to test portal isolation and role-specific features:

| Role | Email | Password | Portal View |
|---|---|---|---|
| **Candidate (Student)** | `student@geova.ai` | `student123` | Candidate Portal |
| **Corporate Partner (Employer)** | `recruiter@geova.ai` | `company123` | Partner Portal |
| **Educator (Faculty)** | `faculty@geova.ai` | `school123` | Educator Portal |
| **Administrator** | `admin@geova.ai` | `admin123` | Admin Portal |

---

## 🏛️ System Architecture

```
React 19 + TypeScript + Vite 6 (Port 5173)
           │
           │ HTTP Proxy (/api/*)
           ▼
FastAPI + SQLAlchemy 2.0 (Port 8000)
           │
           │ SQLAlchemy ORM
           ▼
SQLite Relational Database (backend/geova.db)
[13 Tables: users, student_profiles, companies, opportunities,
connections, collab_posts, collab_interests, projects,
applications, forum_posts, project_squads, prep_sessions, library_resources]
```

---

## 📄 License
This project is open-source under the MIT License.
