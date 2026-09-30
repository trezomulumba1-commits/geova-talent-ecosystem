"""Opportunity schemas (Stage 5).

Field names mirror the frontend `Opportunity` type in src/types.ts so the
discover and opportunity-detail screens need no reshaping.
"""

from typing import Literal

from pydantic import BaseModel, Field

OpportunityType = Literal["Internship", "Full-time", "Freelance", "Part-time"]
OpportunityStatus = Literal["draft", "published", "closed"]

OPPORTUNITY_TYPES = ["Internship", "Full-time", "Freelance", "Part-time"]
OPPORTUNITY_STATUSES = ["draft", "published", "closed"]


class OpportunityRequirements(BaseModel):
    techStack: list[str] = Field(default_factory=list)
    coreCompetencies: list[str] = Field(default_factory=list)


class OpportunityStep(BaseModel):
    step: int
    title: str
    subtitle: str = ""
    completed: bool = False
    current: bool = False


class OpportunityBenefit(BaseModel):
    icon: str = "bolt"
    title: str
    description: str = ""


class HiringManager(BaseModel):
    name: str
    role: str = ""
    avatar: str = ""


class OpportunityOut(BaseModel):
    id: str
    companyId: str
    companyName: str
    companyLogo: str = ""
    title: str
    type: OpportunityType
    location: str = "Remote"
    duration: str = ""
    stipend: str = ""
    tags: list[str] = Field(default_factory=list)
    overview: str = ""
    requirements: OpportunityRequirements = Field(default_factory=OpportunityRequirements)
    processSteps: list[OpportunityStep] = Field(default_factory=list)
    benefits: list[OpportunityBenefit] = Field(default_factory=list)
    hiringManager: HiringManager = Field(default_factory=lambda: HiringManager(name="Hiring Team"))
    status: OpportunityStatus = "published"
    applicantCount: int = 0
    postedAt: str = ""


class OpportunityCreate(BaseModel):
    title: str
    type: OpportunityType
    companyId: str | None = None
    location: str = "Remote"
    duration: str = ""
    stipend: str = ""
    tags: list[str] = Field(default_factory=list)
    overview: str = ""
    requirements: OpportunityRequirements = Field(default_factory=OpportunityRequirements)
    processSteps: list[OpportunityStep] = Field(default_factory=list)
    benefits: list[OpportunityBenefit] = Field(default_factory=list)
    hiringManager: HiringManager | None = None
    status: OpportunityStatus = "published"


class OpportunityUpdate(BaseModel):
    title: str | None = None
    type: OpportunityType | None = None
    location: str | None = None
    duration: str | None = None
    stipend: str | None = None
    tags: list[str] | None = None
    overview: str | None = None
    requirements: OpportunityRequirements | None = None
    processSteps: list[OpportunityStep] | None = None
    benefits: list[OpportunityBenefit] | None = None
    hiringManager: HiringManager | None = None


class OpportunityStatusUpdate(BaseModel):
    status: OpportunityStatus
