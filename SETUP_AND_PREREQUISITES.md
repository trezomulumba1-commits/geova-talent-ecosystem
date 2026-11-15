# GEOVA Talent Ecosystem — Prerequisites & Installation Guide

This document lists **every single software dependency, runtime, tool, and command** required to set up, build, and run the GEOVA Talent Ecosystem on a fresh computer (Windows, macOS, or Linux).

---

## 1. Required Software & Downloads

Before touching the code, download and install the following core software:

### 1.1 Node.js (JavaScript Runtime)
* **Required Version:** Node.js `v20.x LTS` or `v22.x LTS` (includes `npm v10+`)
* **Download URL:** [https://nodejs.org/en/download](https://nodejs.org/en/download)
* **Verification Command:**
  ```bash
  node -v
  npm -v
  ```
  *(Expected: `v20.x` or `v22.x` and `10.x`)*

---

### 1.2 Python (Backend Runtime)
* **Required Version:** Python `3.11.x` or `3.12.x` (64-bit)
* **Download URL:** [https://www.python.org/downloads/](https://www.python.org/downloads/)
* **Crucial for Windows:** During installation, check the box **"Add python.exe to PATH"** on the very first screen.
* **Verification Command:**
  ```bash
  python --version
  ```
  *(Expected: `Python 3.11.x` or `Python 3.12.x`)*

---

### 1.3 `uv` (Fast Python Package & Environment Manager)
The project backend uses Astral's `uv` for lightning-fast virtual environment management and dependency locking.
* **Official Website:** [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)
* **Installation:**
  * **Windows (PowerShell):**
    ```powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```
  * **macOS / Linux (Terminal):**
    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```
* **Verification Command:**
  ```bash
  uv --version
  ```
*(Note: If you do not wish to use `uv`, standard Python `pip` and `venv` are also supported as explained in section 3).*

---

### 1.4 Git (Version Control)
* **Required Version:** `v2.40+`
* **Download URL:** [https://git-scm.com/downloads](https://git-scm.com/downloads)
* **Verification Command:**
  ```bash
  git --version
  ```

---

### 1.5 Recommended Code Editor & Extensions
* **Editor:** [Visual Studio Code](https://code.visualstudio.com/)
* **Recommended Extensions:**
  * *Tailwind CSS IntelliSense* (`bradlc.vscode-tailwindcss`)
  * *Python* (`ms-python.python`)
  * *ESLint* (`dbaeumer.vscode-eslint`)
  * *SQLite Viewer* (`qwtel.sqlite-viewer`) — *optional, for viewing `geova.db` tables directly in VS Code.*

---

## 2. Quick-Start Setup (Using `uv`)

Follow these steps in order to get the entire ecosystem up and running locally.

### Step 1: Clone the Repository
Open your terminal or PowerShell and run:
```bash
git clone https://github.com/trezomulumba1-commits/geova-talent-ecosystem.git
cd geova-talent-ecosystem
```

---

### Step 2: Install Frontend Dependencies
From the project root directory (`geova-talent-ecosystem`):
```bash
npm install
```
This installs all client dependencies:
* `react` & `react-dom` (v19)
* `vite` (v6)
* `tailwindcss` (v4) & `@tailwindcss/vite`
* `lucide-react` (icons)
* `motion` (animations)
* `canvas-confetti`

---

### Step 3: Install Backend Dependencies
Navigate into the `backend/` folder:
```bash
cd backend
uv sync
cd ..
```
`uv sync` will automatically create an isolated Python virtual environment (`.venv`) and install all required packages specified in `pyproject.toml`:
* `fastapi` & `uvicorn` (ASGI web framework & server)
* `sqlalchemy` & `aiosqlite` (database ORM & SQLite driver)
* `pyjwt` & `bcrypt` (authentication & password hashing)
* `pydantic-settings` & `pydantic` (data validation)
* `google-genai` (optional Gemini AI integration)

---

### Step 4: Configure Environment Variables (Optional)
The backend works out-of-the-box with sensible defaults. However, you can create a `backend/.env` file if you want to customize settings:
```env
APP_NAME="GEOVA Backend"
ENVIRONMENT="development"
PORT=8000
DATABASE_URL="sqlite+aiosqlite:///./geova.db"
PERSISTENCE="db"
JWT_SECRET="your-custom-jwt-secret-key-2026"
JWT_EXPIRES_DAYS=7
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
GEMINI_API_KEY=""
```

---

### Step 5: Run the Backend & Frontend Servers

You need **two terminal tabs/windows**:

#### Terminal 1 — Start Backend Server
```powershell
# From the project root:
cd backend
uv run uvicorn app.main:app --reload --port 8000
```
*(On Windows PowerShell, ensure `C:\Users\<User>\.local\bin` is in your `$env:Path`)*

**Expected output:**
```
INFO:     Started reloader process using WatchFiles
INFO:     Uvicorn running on http://127.0.0.1:8000
Seeding note: (seeds 13 tables on initial boot)
```

#### Terminal 2 — Start Frontend Dev Server
```powershell
# From the project root:
npm run dev
```

**Expected output:**
```
  VITE v6.4.3  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 6: Open the Application
Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

The frontend automatically proxies all `/api/*` network requests to `http://localhost:8000`.

---

## 3. Alternative Setup (Without `uv` — Standard `pip`)

If you cannot or prefer not to install `uv`, you can use standard Python `venv`:

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# 4. Install backend dependencies
pip install fastapi "uvicorn[standard]" "sqlalchemy[asyncio]" aiosqlite pyjwt bcrypt pydantic-settings pydantic google-genai python-multipart email-validator

# 5. Start backend
uvicorn app.main:app --reload --port 8000
```

---

## 4. Test Accounts for Instant Verification

The SQLite database (`backend/geova.db`) is automatically initialized and seeded on the backend's first startup. Use any of these accounts to log in:

| Role / Persona | Portal View | Email | Password |
|---|---|---|---|
| **Student (Candidate)** | Candidate Portal | `student@geova.ai` | `student123` |
| **Employer (Corporate)** | Partner Portal | `recruiter@geova.ai` | `company123` |
| **Educator (Faculty)** | Educator Portal | `faculty@geova.ai` | `school123` |
| **Administrator** | Administrative Portal | `admin@geova.ai` | `admin123` |

> *Tip: You can also register a brand new account with any valid role on the registration tab.*

---

## 5. System Health Check & Verification Commands

To confirm that all components and tables are active and operational:

```powershell
# Test backend health
curl http://localhost:8000/api/health
# Response: {"status":"ok","hasApiKey":false,"authEnabled":true,...}

# Test projects table
curl http://localhost:8000/api/projects

# Test forum posts table
curl http://localhost:8000/api/forum/posts

# Test squads table
curl http://localhost:8000/api/squads

# Test interview prep sessions
curl http://localhost:8000/api/prep/sessions

# Test study resources
curl http://localhost:8000/api/prep/resources
```

---

## 6. Troubleshooting & FAQs

### Q1: `uv` is not recognized as an internal or external command
* **Cause:** The `uv` binary was installed to `~/.local/bin` which might not be in your current shell's PATH.
* **Fix (PowerShell):**
  ```powershell
  $env:Path = "$HOME\.local\bin;$env:Path"
  ```
  To make it permanent, add `C:\Users\<YourUsername>\.local\bin` to your Windows Environment Variables under `Path`.

### Q2: Port 8000 or Port 5173 is already in use
* **Find and kill process on port 8000 (Windows):**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```
* **Or change port:** Run uvicorn on another port e.g. `--port 8001`, and update the proxy target in `vite.config.ts`.

### Q3: `Execution of scripts is disabled on this system` (PowerShell error)
* **Fix:** Open PowerShell as Administrator and run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Q4: How do I completely reset the database to clean seed data?
* Stop the backend server.
* Delete the file `backend/geova.db`.
* Restart the backend server. The startup hook will recreate all 13 tables and reseed initial data automatically.
