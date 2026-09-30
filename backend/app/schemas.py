from pydantic import BaseModel, ConfigDict, Field

from app.store import ROLES


class LoginRequest(BaseModel):
    email: str | None = None
    password: str | None = None
    portal: str | None = None


class RegisterRequest(BaseModel):
    email: str | None = None
    password: str | None = None
    name: str | None = None
    portal: str | None = None
    institution: str | None = None
    title: str | None = None


class ProfileUpdate(BaseModel):
    name: str | None = None
    title: str | None = None
    institution: str | None = None
    bio: str | None = None
    skills: list[str] | None = None
    avatar: str | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    role: str
    name: str
    institution: str | None = None
    title: str | None = None
    avatar: str | None = None
    bio: str = ""
    skills: list[str] = Field(default_factory=list)
    createdAt: str


class AuthResponse(BaseModel):
    token: str
    user: UserOut


class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    error: str


def role_label(role: str) -> str:
    """Human label used in the 'Please use the X portal' message."""
    labels = {
        "student": "student",
        "employer": "employer",
        "provider": "provider",
        "admin": "admin",
    }
    return labels.get(role, role)


VALID_ROLES = ROLES