from fastapi import APIRouter, Depends, Query, Response

from app.dependencies import get_current_user
from app.errors import ApiError
from app.network import CONNECTION_STATUSES, connection_store, profile_id_for
from app.network_schemas import ConnectionCreate, ConnectionOut, ConnectionStatusUpdate
from app.profile_schemas import Page
from app.profiles import paginate
from app.store import UserRecord

router = APIRouter(prefix="/api/connections", tags=["networking"])


def _record_or_404(connection_id: str) -> dict:
    record = connection_store.get(connection_id)
    if not record:
        raise ApiError(404, "Connection not found.")
    return record


@router.get("", response_model=Page[ConnectionOut])
@router.get("/", response_model=Page[ConnectionOut], include_in_schema=False)
async def list_connections(
    direction: str = Query(default="all", description="all | incoming | outgoing"),
    status: str | None = Query(
        default=None, description="pending | accepted | declined"
    ),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    user: UserRecord = Depends(get_current_user),
) -> Page[ConnectionOut]:
    if direction not in ("all", "incoming", "outgoing"):
        raise ApiError(400, "direction must be all, incoming or outgoing.")
    if status and status not in CONNECTION_STATUSES:
        raise ApiError(400, f"status must be one of: {', '.join(CONNECTION_STATUSES)}.")
    found = connection_store.list_for(user, direction=direction, status=status)
    items, total = paginate(found, page, page_size)
    return Page[ConnectionOut](
        items=[ConnectionOut.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=ConnectionOut, status_code=201)
@router.post(
    "/", response_model=ConnectionOut, status_code=201, include_in_schema=False
)
async def create_connection(
    body: ConnectionCreate,
    user: UserRecord = Depends(get_current_user),
) -> ConnectionOut:
    return ConnectionOut.model_validate(
        connection_store.create(user, body.recipientId, body.message)
    )


@router.get("/{connection_id}", response_model=ConnectionOut)
async def get_connection(
    connection_id: str,
    user: UserRecord = Depends(get_current_user),
) -> ConnectionOut:
    record = _record_or_404(connection_id)
    if profile_id_for(user) not in (record["requesterId"], record["recipientId"]):
        raise ApiError(403, "Not authorized to view this connection.")
    return ConnectionOut.model_validate(record)


@router.post("/{connection_id}/respond", response_model=ConnectionOut)
async def respond_connection(
    connection_id: str,
    body: ConnectionStatusUpdate,
    user: UserRecord = Depends(get_current_user),
) -> ConnectionOut:
    return ConnectionOut.model_validate(
        connection_store.respond(connection_id, user, body.status)
    )


@router.delete("/{connection_id}", status_code=204)
async def delete_connection(
    connection_id: str,
    user: UserRecord = Depends(get_current_user),
) -> Response:
    connection_store.delete(connection_id, user)
    return Response(status_code=204)
