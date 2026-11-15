"""SQLAlchemy models (Stage 2).

String (slug) primary keys intentionally mirror the API contract; complex
nested payloads are stored as JSON so the repositories can return the exact
shapes the frontend already consumes.
"""

from sqlalchemy import JSON, Boolean, Column, Integer, String, Text

from app.db import Base


class UserRow(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")
    name = Column(String, nullable=False, default="")
    institution = Column(String)
    title = Column(String)
    avatar = Column(String)
    bio = Column(Text, nullable=False, default="")
    skills = Column(JSON, nullable=False, default=list)
    created_at = Column(String, nullable=False, default="")

    @property
    def createdAt(self) -> str:
        return self.created_at

    @createdAt.setter
    def createdAt(self, value: str) -> None:
        self.created_at = value

    def safe(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "name": self.name,
            "institution": self.institution,
            "title": self.title,
            "avatar": self.avatar,
            "bio": self.bio or "",
            "skills": list(self.skills or []),
            "createdAt": self.created_at,
        }


class StudentProfileRow(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    name = Column(String, nullable=False, default="")
    role = Column(String, nullable=False, default="")
    title = Column(String, nullable=False, default="")
    avatar = Column(String, nullable=False, default="")
    verified = Column(Boolean, nullable=False, default=False)
    available = Column(Boolean, nullable=False, default=True)
    status_text = Column(String)
    about = Column(Text, nullable=False, default="")
    skills = Column(JSON, nullable=False, default=list)
    university = Column(String)
    year = Column(String)
    projects_count = Column(Integer, nullable=False, default=0)
    projects = Column(JSON, nullable=False, default=list)
    links = Column(JSON)


class CompanyRow(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True)
    owner_user_id = Column(String, index=True)
    name = Column(String, nullable=False)
    logo = Column(String, nullable=False, default="")
    industry = Column(String, nullable=False, default="")
    location = Column(String, nullable=False, default="")
    verified = Column(Boolean, nullable=False, default=False)
    active_roles_count = Column(Integer, nullable=False, default=0)
    founded = Column(String)
    company_size = Column(String)
    about = Column(Text, nullable=False, default="")
    website = Column(String)


class OpportunityRow(Base):
    __tablename__ = "opportunities"

    id = Column(String, primary_key=True)
    company_id = Column(String, nullable=False, index=True)
    company_name = Column(String, nullable=False, default="")
    company_logo = Column(String, nullable=False, default="")
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    location = Column(String, nullable=False, default="Remote")
    duration = Column(String, nullable=False, default="")
    stipend = Column(String, nullable=False, default="")
    tags = Column(JSON, nullable=False, default=list)
    overview = Column(Text, nullable=False, default="")
    requirements = Column(JSON, nullable=False, default=dict)
    process_steps = Column(JSON, nullable=False, default=list)
    benefits = Column(JSON, nullable=False, default=list)
    hiring_manager = Column(JSON, nullable=False, default=dict)
    status = Column(String, nullable=False, default="published")
    applicant_count = Column(Integer, nullable=False, default=0)
    posted_at = Column(String, nullable=False, default="")
    owner_user_id = Column(String)


class ConnectionRow(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True)
    requester_id = Column(String, nullable=False, index=True)
    requester_name = Column(String, nullable=False, default="")
    requester_avatar = Column(String, nullable=False, default="")
    recipient_id = Column(String, nullable=False, index=True)
    recipient_name = Column(String, nullable=False, default="")
    recipient_avatar = Column(String, nullable=False, default="")
    message = Column(Text, nullable=False, default="")
    status = Column(String, nullable=False, default="pending")
    created_at = Column(String, nullable=False, default="")
    updated_at = Column(String, nullable=False, default="")


class CollabPostRow(Base):
    __tablename__ = "collab_posts"

    id = Column(String, primary_key=True)
    author_id = Column(String, nullable=False, index=True)
    author_name = Column(String, nullable=False, default="")
    author_avatar = Column(String, nullable=False, default="")
    phase = Column(String, nullable=False, default="Ideation Phase")
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False, default="")
    tags = Column(JSON, nullable=False, default=list)
    created_at = Column(String, nullable=False, default="")
    updated_at = Column(String, nullable=False, default="")


class CollabInterestRow(Base):
    __tablename__ = "collab_interests"

    post_id = Column(String, primary_key=True)
    profile_id = Column(String, primary_key=True)
    created_at = Column(String, nullable=False, default="")


class ProjectRow(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    tagline = Column(String, nullable=False, default="")
    category = Column(String, nullable=False, default="Web")
    status = Column(String, nullable=False, default="Validated")
    image = Column(String, nullable=False, default="")
    creator = Column(JSON, nullable=False, default=dict)
    tags = Column(JSON, nullable=False, default=list)
    problem = Column(Text, nullable=False, default="")
    solution = Column(Text, nullable=False, default="")
    key_features = Column(JSON, nullable=False, default=list)
    contribution = Column(String, nullable=False, default="")
    technologies = Column(JSON, nullable=False, default=list)
    gallery = Column(JSON, nullable=False, default=list)
    live_demo_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "tagline": self.tagline,
            "category": self.category,
            "status": self.status,
            "image": self.image,
            "creator": self.creator or {},
            "tags": list(self.tags or []),
            "problem": self.problem or "",
            "solution": self.solution or "",
            "keyFeatures": list(self.key_features or []),
            "contribution": self.contribution or "",
            "technologies": list(self.technologies or []),
            "gallery": list(self.gallery or []),
            "liveDemoUrl": self.live_demo_url,
            "githubUrl": self.github_url,
        }


class ApplicationRow(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True)
    opportunity_id = Column(String, nullable=False, index=True)
    applicant_id = Column(String, nullable=False, index=True)
    applicant_name = Column(String, nullable=False, default="")
    applicant_avatar = Column(String, nullable=False, default="")
    applicant_role = Column(String, nullable=False, default="")
    portfolio_link = Column(String, nullable=True)
    github_link = Column(String, nullable=True)
    cover_note = Column(Text, nullable=False, default="")
    include_verified_score = Column(Boolean, nullable=False, default=True)
    status = Column(String, nullable=False, default="Pending Review")
    created_at = Column(String, nullable=False, default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "opportunityId": self.opportunity_id,
            "applicantId": self.applicant_id,
            "applicantName": self.applicant_name,
            "applicantAvatar": self.applicant_avatar,
            "applicantRole": self.applicant_role,
            "portfolioLink": self.portfolio_link,
            "githubLink": self.github_link,
            "coverNote": self.cover_note,
            "includeVerifiedScore": self.include_verified_score,
            "status": self.status,
            "createdAt": self.created_at,
        }


class ForumPostRow(Base):
    __tablename__ = "forum_posts"

    id = Column(String, primary_key=True)
    author_id = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False, default="")
    author_avatar = Column(String, nullable=False, default="")
    role = Column(String, nullable=False, default="Student")
    category = Column(String, nullable=False, default="System Design")
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False, default="")
    tags = Column(JSON, nullable=False, default=list)
    upvotes = Column(Integer, nullable=False, default=0)
    replies_count = Column(Integer, nullable=False, default=0)
    time_ago = Column(String, nullable=False, default="Just now")
    created_at = Column(String, nullable=False, default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "authorId": self.author_id,
            "author": self.author,
            "authorAvatar": self.author_avatar,
            "role": self.role,
            "category": self.category,
            "title": self.title,
            "content": self.content,
            "tags": list(self.tags or []),
            "upvotes": self.upvotes,
            "repliesCount": self.replies_count,
            "timeAgo": self.time_ago,
            "createdAt": self.created_at,
        }


class ProjectSquadRow(Base):
    __tablename__ = "project_squads"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    tagline = Column(String, nullable=False, default="")
    icon = Column(String, nullable=False, default="Layers")
    color = Column(String, nullable=False, default="indigo")
    current_sprint = Column(String, nullable=False, default="Sprint 1")
    progress_percentage = Column(Integer, nullable=False, default=0)
    members = Column(JSON, nullable=False, default=list)
    tasks = Column(JSON, nullable=False, default=list)
    created_at = Column(String, nullable=False, default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "tagline": self.tagline,
            "icon": self.icon,
            "color": self.color,
            "currentSprint": self.current_sprint,
            "progressPercentage": self.progress_percentage,
            "members": list(self.members or []),
            "tasks": list(self.tasks or []),
            "createdAt": self.created_at,
        }


class PrepSessionRow(Base):
    __tablename__ = "prep_sessions"

    id = Column(String, primary_key=True)
    date_month = Column(String, nullable=False, default="")
    date_day = Column(String, nullable=False, default="")
    title = Column(String, nullable=False)
    time_range = Column(String, nullable=False, default="")
    type = Column(String, nullable=False, default="technical")
    link_available = Column(Boolean, nullable=False, default=True)
    created_at = Column(String, nullable=False, default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "dateMonth": self.date_month,
            "dateDay": self.date_day,
            "title": self.title,
            "timeRange": self.time_range,
            "type": self.type,
            "linkAvailable": self.link_available,
            "createdAt": self.created_at,
        }


class LibraryResourceRow(Base):
    __tablename__ = "library_resources"

    id = Column(String, primary_key=True)
    section = Column(String, nullable=False, default="technical")
    category = Column(String, nullable=False, default="")
    title = Column(String, nullable=False)
    duration = Column(String, nullable=False, default="")
    completed = Column(Boolean, nullable=False, default=False)
    image = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default="")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "section": self.section,
            "category": self.category,
            "title": self.title,
            "duration": self.duration,
            "completed": self.completed,
            "image": self.image,
            "createdAt": self.created_at,
        }

