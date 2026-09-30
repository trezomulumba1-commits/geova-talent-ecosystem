from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.errors import ApiError
from app.schemas import (
    AuthResponse,
    LoginRequest,
    MessageResponse,
    ProfileUpdate,
    RegisterRequest,
    UserOut,
    VALID_ROLES,
    role_label,
)
from app.security import create_token, verify_password
from app.store import UserRecord, user_store

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _auth_payload(user: UserRecord) -> dict:
    return {"sub": user.id, "email": user.email, "role": user.role, "name": user.name}


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest) -> AuthResponse:
    email = (body.email or "").strip()
    password = body.password or ""
    portal = body.portal or ""

    if not email or not password or not portal:
        raise ApiError(400, "email, password and portal are required.")

    if portal not in VALID_ROLES:
        raise ApiError(400, "email, password and portal are required.")

    user = user_store.get(email)
    if not user:
        raise ApiError(401, "No account found for that email address.")

    if not verify_password(password, user.password_hash):
        raise ApiError(401, "Incorrect password.")

    if user.role != portal:
        raise ApiError(403, f"This account is registered as a '{role_label(user.role)}'. Please use the {role_label(user.role)} portal to log in.")

    token = create_token(_auth_payload(user))
    return AuthResponse(token=token, user=UserOut.model_validate(user.safe()))


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(body: RegisterRequest) -> AuthResponse:
    email = (body.email or "").strip()
    password = body.password or ""
    name = (body.name or "").strip()
    portal = body.portal or ""

    if not email or not password or not name or not portal:
        raise ApiError(400, "email, password, name and portal are required.")

    if portal not in VALID_ROLES:
        raise ApiError(400, "email, password, name and portal are required.")

    if user_store.has(email):
        raise ApiError(409, "An account with this email already exists. Please log in.")

    if len(password) < 6:
        raise ApiError(400, "Password must be at least 6 characters.")

    user = user_store.create(email, password, portal, name, body.institution, body.title)
    token = create_token(_auth_payload(user))
    return AuthResponse(token=token, user=UserOut.model_validate(user.safe()))


@router.get("/me", response_model=UserOut)
async def me(user: UserRecord = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(user.safe())


@router.post("/logout", response_model=MessageResponse)
async def logout() -> MessageResponse:
    return MessageResponse(message="Logged out successfully.")


@router.patch("/profile", response_model=UserOut)
async def update_profile(
    body: ProfileUpdate,
    user: UserRecord = Depends(get_current_user),
) -> UserOut:
    if body.name is not None:
        user.name = body.name.strip()
    if body.title is not None:
        user.title = body.title.strip() or None
    if body.institution is not None:
        user.institution = body.institution.strip() or None
    if body.bio is not None:
        user.bio = body.bio.strip()
    if body.skills is not None:
        user.skills = body.skills
    if body.avatar is not None:
        user.avatar = body.avatar.strip() or None

    user_store.upsert(user)
    return UserOut.model_validate(user.safe())