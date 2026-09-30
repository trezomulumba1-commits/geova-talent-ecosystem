from fastapi import APIRouter, Depends

from app.profile_schemas import OwnProfile, OwnProfileUpdate
from app.profiles import profile_store
from app.store import UserRecord
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.get("/me", response_model=OwnProfile)
async def read_own_profile(user: UserRecord = Depends(get_current_user)) -> OwnProfile:
    return profile_store.own_profile(user)


@router.patch("/me", response_model=OwnProfile)
async def update_own_profile(
    body: OwnProfileUpdate,
    user: UserRecord = Depends(get_current_user),
) -> OwnProfile:
    profile_store.update_own(user, body.model_dump(exclude_none=True))
    return profile_store.own_profile(user)