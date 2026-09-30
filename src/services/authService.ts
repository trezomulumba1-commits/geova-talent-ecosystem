// src/services/authService.ts
// Handles all API calls for login / register / profile

export type PortalRole = 'student' | 'company' | 'school';

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

// ─── Get Current User ─────────────────────────────────────────────────────────
export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BASE}/me`, { headers: authHeaders() });
    if (!res.ok) { logout(); return null; }
    const data = await res.json();
    return data.user as AuthUser;
  } catch {
    return null;
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
  const res = await fetch(`${BASE}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  });
  const data = await handleResponse<{ user: AuthUser }>(res);
  localStorage.setItem('geova_auth_user', JSON.stringify(data.user));
  return data.user;
}
