"""Admin schemas (Stage 8)."""

from pydantic import BaseModel


class AdminUserOut(BaseModel):
    id: str
    email: str
    role: str
    name: str = ""
    institution: str | None = None
    title: str | None = None
    avatar: str | None = None
    createdAt: str = ""
    profileId: str | None = None
    verified: bool | None = None
    available: bool | None = None


class AdminUserUpdate(BaseModel):
    role: str | None = None
    verified: bool | None = None
    available: bool | None = None


class SkillCount(BaseModel):
    skill: str
    count: int


class AdminAnalytics(BaseModel):
    totalUsers: int
    totalStudents: int
    totalEmployers: int
    totalProviders: int
    totalAdmins: int
    totalProfiles: int
    totalCompanies: int
    totalOpportunities: int
    publishedOpportunities: int
    draftOpportunities: int
    closedOpportunities: int
    totalConnections: int
    pendingConnections: int
    totalCollabs: int
    totalInterests: int
    topSkills: list[SkillCount]
    recentUsers: list[AdminUserOut]
