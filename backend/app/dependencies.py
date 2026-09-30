from fastapi import Depends, Request

from app.errors import ApiError
from app.security import decode_token
from app.store import UserRecord, user_store


def get_current_user(request: Request) -> UserRecord:
    auth = request.headers.get("authorization")
    token = auth[7:] if auth and auth.startswith("Bearer ") else None
    if not token:
        raise ApiError(401, "Unauthorized. Login required.")
    payload = decode_token(token)
    if not payload:
        raise ApiError(401, "Token expired or invalid. Please log in again.")
    user = user_store.get(str(payload.get("email", "")))
    if not user:
        raise ApiError(404, "Account not found.")
    return user


def require_roles(*roles: str):
    def _dep(user: UserRecord = Depends(get_current_user)) -> UserRecord:
        if user.role not in roles:
            raise ApiError(403, "Not authorized for this resource.")
        return user

    return _dep


def get_optional_user(request: Request) -> UserRecord | None:
    """Viewer identity when a token is present, but never blocks the request."""
    auth = request.headers.get("authorization")
    token = auth[7:] if auth and auth.startswith("Bearer ") else None
    if not token:
        return None
    try:
        payload = decode_token(token)
    except ApiError:
        return None
    if not payload:
        return None
    return user_store.get(str(payload.get("email", "")))