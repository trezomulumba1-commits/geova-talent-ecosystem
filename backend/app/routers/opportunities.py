from fastapi import APIRouter, Depends, Query, Response

from app.dependencies import get_current_user, get_optional_user, require_roles
from app.errors import ApiError
from app.opportunities import opportunity_store
from app.opportunity_schemas import (
    OPPORTUNITY_STATUSES,
    OPPORTUNITY_TYPES,
    OpportunityCreate,
    OpportunityOut,
    OpportunityStatusUpdate,
    OpportunityUpdate,
)
from app.profile_schemas import Page
from app.profiles import paginate
from app.store import UserRecord

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

MANAGER = require_roles("employer", "admin")


def _record_or_404(opportunity_id: str) -> dict:
    record = opportunity_store.get(opportunity_id)
    if not record:
        raise ApiError(404, "Opportunity not found.")
    return record


def _out(record: dict) -> OpportunityOut:
    return OpportunityOut.model_validate(record)


@router.get("", response_model=Page[OpportunityOut])
@router.get("/", response_model=Page[OpportunityOut], include_in_schema=False)
async def list_opportunities(
    q: str | None = Query(default=None, description="Matches title, overview, company or tags"),
    type: str | None = Query(default=None, description="Internship | Full-time | Freelance | Part-time"),
    location: str | None = None,
    companyId: str | None = None,
    tag: str | None = None,
    status: str | None = Query(default="published"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
) -> Page[OpportunityOut]:
    if type and type not in OPPORTUNITY_TYPES:
        raise ApiError(400, f"type must be one of: {', '.join(OPPORTUNITY_TYPES)}.")
    if status and status != "all" and status not in OPPORTUNITY_STATUSES:
        raise ApiError(400, f"status must be one of: {', '.join(OPPORTUNITY_STATUSES)}.")

    found = opportunity_store.search(q=q, type=type, location=location, company_id=companyId, tag=tag, status=None if status == "all" else status)
    items, total = paginate(found, page, page_size)
    return Page[OpportunityOut](
        items=[_out(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/mine", response_model=Page[OpportunityOut])
async def list_my_opportunities(
    status: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    user: UserRecord = Depends(MANAGER),
) -> Page[OpportunityOut]:
    if status and status not in OPPORTUNITY_STATUSES:
        raise ApiError(400, f"status must be one of: {', '.join(OPPORTUNITY_STATUSES)}.")
    found = opportunity_store.for_owner(user)
    if status:
        found = [o for o in found if o.get("status") == status]
    items, total = paginate(found, page, page_size)
    return Page[OpportunityOut](
        items=[_out(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=OpportunityOut, status_code=201)
@router.post("/", response_model=OpportunityOut, status_code=201, include_in_schema=False)
async def create_opportunity(
    body: OpportunityCreate,
    user: UserRecord = Depends(MANAGER),
) -> OpportunityOut:
    if not body.title.strip():
        raise ApiError(400, "title is required.")
    payload = body.model_dump()
    payload["processSteps"] = [s.model_dump() for s in body.processSteps]
    payload["benefits"] = [b.model_dump() for b in body.benefits]
    payload["hiringManager"] = (body.hiringManager.model_dump() if body.hiringManager else {"name": user.name, "role": user.title or "Recruiter", "avatar": user.avatar or ""})
    return _out(opportunity_store.create(user, payload))


@router.get("/{opportunity_id}", response_model=OpportunityOut)
async def get_opportunity(
    opportunity_id: str,
    viewer: UserRecord | None = Depends(get_optional_user),
) -> OpportunityOut:
    record = _record_or_404(opportunity_id)
    if record.get("status") != "published" and not (viewer and opportunity_store.can_manage(viewer, record)):
        raise ApiError(404, "Opportunity not found.")
    return _out(record)


@router.patch("/{opportunity_id}", response_model=OpportunityOut)
async def update_opportunity(
    opportunity_id: str,
    body: OpportunityUpdate,
    user: UserRecord = Depends(MANAGER),
) -> OpportunityOut:
    record = _record_or_404(opportunity_id)
    if not opportunity_store.can_manage(user, record):
        raise ApiError(403, "You can only edit opportunities posted by your company.")
    updates = body.model_dump(exclude_none=True)
    if "requirements" in updates:
        updates["requirements"] = body.requirements.model_dump() if body.requirements else None
    if "hiringManager" in updates:
        updates["hiringManager"] = body.hiringManager.model_dump() if body.hiringManager else None
    if "processSteps" in updates:
        updates["processSteps"] = [s.model_dump() for s in body.processSteps] if body.processSteps else None
    if "benefits" in updates:
        updates["benefits"] = [b.model_dump() for b in body.benefits] if body.benefits else None
    return _out(opportunity_store.update(record, updates))


@router.post("/{opportunity_id}/status", response_model=OpportunityOut)
async def set_opportunity_status(
    opportunity_id: str,
    body: OpportunityStatusUpdate,
    user: UserRecord = Depends(MANAGER),
) -> OpportunityOut:
    if body.status not in OPPORTUNITY_STATUSES:
        raise ApiError(400, f"status must be one of: {', '.join(OPPORTUNITY_STATUSES)}.")
    record = _record_or_404(opportunity_id)
    if not opportunity_store.can_manage(user, record):
        raise ApiError(403, "You can only change opportunities posted by your company.")
    return _out(opportunity_store.set_status(record, body.status))


@router.delete("/{opportunity_id}", status_code=204)
async def delete_opportunity(
    opportunity_id: str,
    user: UserRecord = Depends(MANAGER),
) -> Response:
    record = _record_or_404(opportunity_id)
    if not opportunity_store.can_manage(user, record):
        raise ApiError(403, "You can only delete opportunities posted by your company.")
    opportunity_store.delete(opportunity_id)
    return Response(status_code=204)
