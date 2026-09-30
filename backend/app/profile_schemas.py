from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int


class ProfileLinks(BaseModel):
    github: str | None = None
    linkedin: str | None = None
    website: str | None = None


class ProjectSummaryOut(BaseModel):
    id: str
    title: str
    description: str
    type: str
    image: str


class StudentProfile(BaseModel):
    """Mirrors the frontend `Student` type (src/types.ts)."""

    id: str
    name: str
    role: str
    title: str
    avatar: str
    verified: bool = False
    available: bool = False
    statusText: str | None = None
    about: str = ""
    skills: list[str] = []
    university: str | None = None
    year: str | None = None
    projectsCount: int = 0
    projects: list[ProjectSummaryOut] | None = None
    links: ProfileLinks | None = None
    userId: str | None = None


class CompanyProfile(BaseModel):
    """Mirrors the frontend `Company` type (src/types.ts)."""

    id: str
    name: str
    logo: str
    industry: str
    location: str
    verified: bool = False
    activeRolesCount: int = 0
    founded: str | None = None
    companySize: str | None = None
    about: str = ""
    website: str | None = None
    ownerUserId: str | None = None


class OwnProfile(BaseModel):
    id: str
    role: str
    name: str
    email: str
    title: str | None = None
    institution: str | None = None
    avatar: str | None = None
    about: str = ""
    skills: list[str] = []
    verified: bool = False
    available: bool | None = None
    statusText: str | None = None
    university: str | None = None
    year: str | None = None
    links: ProfileLinks | None = None
    company: CompanyProfile | None = None


class OwnProfileUpdate(BaseModel):
    name: str | None = None
    title: str | None = None
    institution: str | None = None
    about: str | None = None
    skills: list[str] | None = None
    avatar: str | None = None
    available: bool | None = None
    statusText: str | None = None
    university: str | None = None
    year: str | None = None
    links: ProfileLinks | None = None