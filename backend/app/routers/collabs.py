from fastapi import APIRouter, Depends, Query, Response

from app.dependencies import get_current_user, get_optional_user
from app.errors import ApiError
from app.network import collab_store, profile_id_for
from app.network_schemas import (
    COLLAB_PHASES,
    CollabCreate,
    CollabInterestOut,
    CollabOut,
    CollabUpdate,
)
from app.profile_schemas import Page
from app.profiles import paginate
from app.store import UserRecord

router = APIRouter(prefix="/api/collabs", tags=["networking"])


def _out(record: dict, viewer: UserRecord | None) -> CollabOut:
    profile_id = profile_id_for(viewer) if viewer else None
    return CollabOut(
        id=record["id"],
        authorId=record["authorId"],
        authorName=record["authorName"],
        authorAvatar=record["authorAvatar"],
        phase=record["phase"],
        title=record["title"],
        description=record["description"],
        tags=list(record["tags"]),
        interestedCount=len(record["interests"]),
        userInterested=bool(profile_id and profile_id in record["interests"]),
        createdAt=record["createdAt"],
        updatedAt=record["updatedAt"],
    )


def _record_or_404(collab_id: str) -> dict:
    record = collab_store.get(collab_id)
    if not record:
        raise ApiError(404, "Collaboration post not found.")
    return record


@router.get("", response_model=Page[CollabOut])
@router.get("/", response_model=Page[CollabOut], include_in_schema=False)
async def list_collabs(
    q: str | None = Query(
        default=None, description="Matches title, description or tags"
    ),
    phase: str | None = None,
    tag: str | None = None,
    authorId: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    viewer: UserRecord | None = Depends(get_optional_user),
) -> Page[CollabOut]:
    if phase and phase not in COLLAB_PHASES:
        raise ApiError(400, f"phase must be one of: {', '.join(COLLAB_PHASES)}.")
    found = collab_store.search(q=q, phase=phase, tag=tag, author_id=authorId)
    items, total = paginate(found, page, page_size)
    return Page[CollabOut](
        items=[_out(i, viewer) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=CollabOut, status_code=201)
@router.post("/", response_model=CollabOut, status_code=201, include_in_schema=False)
async def create_collab(
    body: CollabCreate,
    user: UserRecord = Depends(get_current_user),
) -> CollabOut:
    if not body.title.strip():
        raise ApiError(400, "title is required.")
    if body.phase not in COLLAB_PHASES:
        raise ApiError(400, f"phase must be one of: {', '.join(COLLAB_PHASES)}.")
    record = collab_store.create(user, body.model_dump())
    return _out(record, user)


@router.get("/{collab_id}", response_model=CollabOut)
async def get_collab(
    collab_id: str,
    viewer: UserRecord | None = Depends(get_optional_user),
) -> CollabOut:
    return _out(_record_or_404(collab_id), viewer)


@router.patch("/{collab_id}", response_model=CollabOut)
async def update_collab(
    collab_id: str,
    body: CollabUpdate,
    user: UserRecord = Depends(get_current_user),
) -> CollabOut:
    record = _record_or_404(collab_id)
    updates = body.model_dump(exclude_none=True)
    if "phase" in updates and updates["phase"] not in COLLAB_PHASES:
        raise ApiError(400, f"phase must be one of: {', '.join(COLLAB_PHASES)}.")
    return _out(collab_store.update(record, updates, user), user)


@router.delete("/{collab_id}", status_code=204)
async def delete_collab(
    collab_id: str,
    user: UserRecord = Depends(get_current_user),
) -> Response:
    collab_store.delete(_record_or_404(collab_id), user)
    return Response(status_code=204)


@router.post("/{collab_id}/interest", response_model=CollabOut)
async def toggle_interest(
    collab_id: str,
    user: UserRecord = Depends(get_current_user),
) -> CollabOut:
    record = _record_or_404(collab_id)
    collab_store.toggle_interest(record, user)
    record = collab_store.get(collab_id) or record
    return _out(record, user)


@router.get("/{collab_id}/interests", response_model=list[CollabInterestOut])
async def list_interests(
    collab_id: str,
    user: UserRecord = Depends(get_current_user),
) -> list[CollabInterestOut]:
    record = _record_or_404(collab_id)
    return [CollabInterestOut.model_validate(i) for i in collab_store.interests(record)]
