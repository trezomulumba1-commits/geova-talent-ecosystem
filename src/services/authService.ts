// src/services/authService.ts
// Handles all API calls for login / register / profile with resilient offline/demo fallback

export type PortalRole = 'student' | 'employer' | 'provider' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: PortalRole;
  name: string;
  institution?: string;
  title?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const DEMO_USERS: Record<PortalRole, AuthUser> = {
  student: {
    id: "usr-student-001",
    email: "student@geova.ai",
    role: "student",
    name: "Alex Mwansa",
    title: "Full-Stack Engineer",
    institution: "Stanford University",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    bio: "Building distributed systems and open-source tools.",
    skills: ["TypeScript", "React", "Node.js", "Python", "System Design"],
    createdAt: new Date().toISOString(),
  },
  employer: {
    id: "usr-company-001",
    email: "recruiter@geova.ai",
    role: "employer",
    name: "Elena Rostova",
    title: "Head of University Talent",
    institution: "Nebula AI Labs",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Scouting top 1% engineering talent for foundation models.",
    skills: ["Talent Acquisition", "Technical Sourcing"],
    createdAt: new Date().toISOString(),
  },
  provider: {
    id: "usr-school-001",
    email: "faculty@geova.ai",
    role: "provider",
    name: "Dr. Kwesi Mensah",
    title: "Dean of Computing & Systems",
    institution: "Covenant Tech Institute",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    bio: "Spearheading verified applied-learning capstone projects.",
    skills: ["Curriculum Architecture", "Assessment"],
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: "usr-admin-001",
    email: "admin@geova.ai",
    role: "admin",
    name: "Platform Admin",
    title: "System Administrator",
    institution: "GEOVA Global",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "GEOVA platform administration.",
    skills: ["Platform Management"],
    createdAt: new Date().toISOString(),
  }
};

function createDemoSession(portal: PortalRole, email?: string, name?: string, institution?: string, title?: string): AuthResponse {
  const seed = DEMO_USERS[portal] || DEMO_USERS.student;
  const user: AuthUser = {
    ...seed,
    email: email && email.includes('@') ? email : seed.email,
    name: name && name.trim() ? name.trim() : seed.name,
    institution: institution || seed.institution,
    title: title || seed.title,
  };
  const token = `geova-demo-token-${portal}-${Date.now()}`;
  localStorage.setItem('geova_auth_token', token);
  localStorage.setItem('geova_auth_user', JSON.stringify(user));
  return { token, user };
}

const BASE = '/api/auth';

function getToken(): string | null {
  return localStorage.getItem('geova_auth_token');
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string, portal: PortalRole): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, portal }),
  });
  const data = await handleResponse<AuthResponse>(res);
  localStorage.setItem('geova_auth_token', data.token);
  localStorage.setItem('geova_auth_user', JSON.stringify(data.user));
  return data;
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function register(
  email: string,
  password: string,
  name: string,
  portal: PortalRole,
  institution?: string,
  title?: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, portal, institution, title }),
  });
  const data = await handleResponse<AuthResponse>(res);
  localStorage.setItem('geova_auth_token', data.token);
  localStorage.setItem('geova_auth_user', JSON.stringify(data.user));
  return data;
}

// ─── Quick Demo Login ─────────────────────────────────────────────────────────
export function quickDemoLogin(portal: PortalRole): AuthResponse {
  return createDemoSession(portal);
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  // Demo tokens are not real JWTs — skip the network call and return cached user
  if (token.startsWith('geova-demo-token-')) return getCachedUser();
  try {
    const res = await fetch(`${BASE}/me`, { headers: authHeaders() });
    if (!res.ok) { logout(); return null; }
    const data = await res.json();
    // FastAPI /me returns the user object directly (not wrapped in { user: ... })
    const user = (data.user ?? data) as AuthUser;
    localStorage.setItem('geova_auth_user', JSON.stringify(user));
    return user;
  } catch {
    return getCachedUser();
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export function logout(): void {
  localStorage.removeItem('geova_auth_token');
  localStorage.removeItem('geova_auth_user');
}

// ─── Get cached user (no network) ─────────────────────────────────────────────
export function getCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('geova_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Update Profile ───────────────────────────────────────────────────────────
export async function updateProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
  try {
    const res = await fetch(`${BASE}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<{ user: AuthUser }>(res);
    localStorage.setItem('geova_auth_user', JSON.stringify(data.user));
    return data.user;
  } catch (err: any) {
    console.warn('[authService] Backend unreachable, updating local cache:', err?.message);
    const cached = getCachedUser() || DEMO_USERS.student;
    const updated = { ...cached, ...updates };
    localStorage.setItem('geova_auth_user', JSON.stringify(updated));
    return updated;
  }
}
