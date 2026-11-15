// src/services/apiService.ts
// Direct integration with FastAPI SQLite/Postgres backend

import { Student, Company, Opportunity, CollabPost, Project, ProjectSquad, PrepSession, LibraryResource } from '../types';

function getToken(): string | null {
  return localStorage.getItem('geova_auth_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Students ─────────────────────────────────────────────────────────────────
export async function fetchStudents(): Promise<Student[]> {
  const res = await fetch('/api/users/students?page=1&page_size=50');
  if (!res.ok) throw new Error('Failed to load students');
  const data = await res.json();
  return (data.items || []) as Student[];
}

// ─── Companies ────────────────────────────────────────────────────────────────
export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/users/employers?page=1&page_size=50');
  if (!res.ok) throw new Error('Failed to load employers');
  const data = await res.json();
  return (data.items || []) as Company[];
}

// ─── Opportunities ────────────────────────────────────────────────────────────
export async function fetchOpportunities(): Promise<Opportunity[]> {
  const res = await fetch('/api/opportunities?page=1&page_size=50');
  if (!res.ok) throw new Error('Failed to load opportunities');
  const data = await res.json();
  return (data.items || []) as Opportunity[];
}

export async function createOpportunity(opp: {
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: string;
  location?: string;
  duration?: string;
  stipend?: string;
  tags?: string[];
  overview?: string;
}): Promise<Opportunity> {
  const res = await fetch('/api/opportunities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({
      companyId: opp.companyId,
      companyName: opp.companyName,
      companyLogo: opp.companyLogo,
      title: opp.title,
      type: opp.type,
      location: opp.location || 'Remote',
      duration: opp.duration || '3 Months',
      stipend: opp.stipend || 'Competitive',
      tags: opp.tags || [],
      overview: opp.overview || '',
      requirements: { techStack: opp.tags || [], coreCompetencies: ['Problem Solving'] },
      processSteps: [
        { step: 1, title: 'Applied', subtitle: 'Application review' },
        { step: 2, title: 'Interview', subtitle: 'Technical evaluation' },
        { step: 3, title: 'Offer', subtitle: 'Final decision' },
      ],
      benefits: [
        { icon: 'payments', title: 'Stipend', description: opp.stipend || 'Competitive' },
        { icon: 'schedule', title: 'Flexible', description: 'Hybrid / Remote' },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create opportunity');
  }
  return (await res.json()) as Opportunity;
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function fetchProjects(category?: string): Promise<Project[]> {
  const url = category && category !== 'All' ? `/api/projects?category=${encodeURIComponent(category)}` : '/api/projects';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load projects');
  return (await res.json()) as Project[];
}

export async function createProject(project: Partial<Project>): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create project');
  }
  return (await res.json()) as Project;
}

// ─── Collaborations ───────────────────────────────────────────────────────────
export async function fetchCollabs(): Promise<CollabPost[]> {
  const res = await fetch('/api/collabs?page=1&page_size=50', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load collabs');
  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    id: item.id,
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    phase: item.phase,
    title: item.title,
    description: item.description,
    tags: item.tags || [],
    interestedCount: item.interestedCount || 0,
    userInterested: !!item.userInterested,
  })) as CollabPost[];
}

export async function createCollabPost(post: {
  title: string;
  phase: string;
  description: string;
  tags: string[];
}): Promise<CollabPost> {
  const res = await fetch('/api/collabs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to publish collaboration post');
  }
  const item = await res.json();
  return {
    id: item.id,
    authorName: item.authorName,
    authorAvatar: item.authorAvatar,
    phase: item.phase,
    title: item.title,
    description: item.description,
    tags: item.tags || [],
    interestedCount: item.interestedCount || 0,
    userInterested: !!item.userInterested,
  };
}

export async function toggleCollabInterest(collabId: string): Promise<{ interested: boolean; count: number }> {
  const res = await fetch(`/api/collabs/${collabId}/interest`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to record interest');
  }
  const data = await res.json();
  return {
    interested: !!data.userInterested,
    count: data.interestedCount || 0,
  };
}

// ─── Connections / Networking ─────────────────────────────────────────────────
export async function sendConnectionRequest(recipientId: string, message: string = ''): Promise<any> {
  const res = await fetch('/api/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ recipientId, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send connection request');
  }
  return await res.json();
}

// ─── Applications ─────────────────────────────────────────────────────────────
export async function applyToOpportunity(data: {
  opportunityId: string;
  portfolioLink?: string;
  githubLink?: string;
  coverNote?: string;
  includeVerifiedScore?: boolean;
}): Promise<any> {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit application');
  }
  return await res.json();
}

// ─── Community Forum ──────────────────────────────────────────────────────────
export async function fetchForumPosts(category?: string): Promise<any[]> {
  const url = category && category !== 'All' ? `/api/forum/posts?category=${encodeURIComponent(category)}` : '/api/forum/posts';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load forum posts');
  return await res.json();
}

export async function createForumPost(post: {
  title: string;
  content: string;
  author?: string;
  category: string;
  tags: string[];
}): Promise<any> {
  const res = await fetch('/api/forum/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to publish forum post');
  }
  return await res.json();
}

export async function upvoteForumPost(postId: string): Promise<number> {
  const res = await fetch(`/api/forum/posts/${postId}/upvote`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.upvotes || 0;
}

// ─── Project Squads ───────────────────────────────────────────────────────────
export async function fetchProjectSquads(): Promise<ProjectSquad[]> {
  const res = await fetch('/api/squads');
  if (!res.ok) throw new Error('Failed to load squads');
  return (await res.json()) as ProjectSquad[];
}

export async function updateSquadTaskStatus(squadId: string, taskId: string, status: string): Promise<any> {
  const res = await fetch(`/api/squads/${squadId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function addSquadTask(squadId: string, task: { title: string; assigneeName?: string; assigneeAvatar?: string; priority?: string }): Promise<any> {
  const res = await fetch(`/api/squads/${squadId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) return null;
  return await res.json();
}

// ─── Prep Sessions & Resources ────────────────────────────────────────────────
export async function fetchPrepSessions(): Promise<PrepSession[]> {
  const res = await fetch('/api/prep/sessions');
  if (!res.ok) throw new Error('Failed to load prep sessions');
  return (await res.json()) as PrepSession[];
}

export async function fetchLibraryResources(section?: string): Promise<LibraryResource[]> {
  const url = section ? `/api/prep/resources?section=${encodeURIComponent(section)}` : '/api/prep/resources';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load library resources');
  return (await res.json()) as LibraryResource[];
}

export async function toggleLibraryResourceComplete(resourceId: string): Promise<any> {
  const res = await fetch(`/api/prep/resources/${resourceId}/toggle`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  return await res.json();
}
