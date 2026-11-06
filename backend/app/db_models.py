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
