from fastapi import APIRouter, Query

from app.errors import ApiError
from app.profile_schemas import CompanyProfile, Page, StudentProfile
from app.profiles import paginate, profile_store

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/students", response_model=Page[StudentProfile])
async def list_students(
    q: str | None = Query(default=None, description="Matches name, title, about or skills"),
    skills: str | None = Query(default=None, description="Comma-separated; matches any listed skill"),
    available: bool | None = None,
    verified: bool | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
) -> Page[StudentProfile]:
    found = profile_store.search_students(q=q, skills=skills, available=available, verified=verified)
    items, total = paginate(found, page, page_size)
    return Page[StudentProfile](
        items=[StudentProfile.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/employers", response_model=Page[CompanyProfile])
async def list_employers(
    q: str | None = Query(default=None, description="Matches name, industry or about"),
    industry: str | None = None,
    location: str | None = None,
    verified: bool | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
) -> Page[CompanyProfile]:
    found = profile_store.search_companies(q=q, industry=industry, location=location, verified=verified)
    items, total = paginate(found, page, page_size)
    return Page[CompanyProfile](
        items=[CompanyProfile.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{profile_id}")
async def get_profile(profile_id: str) -> dict:
    record = profile_store.get(profile_id)
    if not record:
        raise ApiError(404, "Profile not found.")
    if record.get("userId") is not None or "skills" in record:
        return StudentProfile.model_validate(record).model_dump()
    return CompanyProfile.model_validate(record).model_dump()