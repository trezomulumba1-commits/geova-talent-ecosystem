from fastapi import APIRouter, Depends, Query, Response

from app.admin_schemas import AdminAnalytics, AdminUserOut, AdminUserUpdate, SkillCount
from app.dependencies import require_roles
from app.errors import ApiError
from app.network import collab_store, connection_store
from app.opportunities import opportunity_store
from app.opportunity_schemas import (
    OPPORTUNITY_STATUSES,
    OpportunityOut,
    OpportunityStatusUpdate,
)
from app.profile_schemas import Page
from app.profiles import paginate, profile_store
from app.schemas import VALID_ROLES
from app.store import UserRecord, user_store

router = APIRouter(prefix="/api/admin", tags=["admin"])

ADMIN = require_roles("admin")


def _find_user(user_id: str) -> UserRecord:
    user = user_store.get_by_id(user_id)
    if not user:
        raise ApiError(404, "User not found.")
    return user


def _admin_user(user: UserRecord) -> AdminUserOut:
    found = profile_store.get_for_user(user.id)
    profile_id = found[1]["id"] if found else None
    record = found[1] if found else {}
    return AdminUserOut(
        id=user.id,
        email=user.email,
        role=user.role,
        name=user.name,
        institution=user.institution,
        title=user.title,
        avatar=user.avatar,
        createdAt=user.createdAt,
        profileId=profile_id,
        verified=record.get("verified"),
        available=record.get("available"),
    )


@router.get("/users", response_model=Page[AdminUserOut])
async def list_users(
    q: str | None = Query(default=None, description="Matches name or email"),
    role: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    _: UserRecord = Depends(ADMIN),
) -> Page[AdminUserOut]:
    if role and role not in VALID_ROLES:
        raise ApiError(400, f"role must be one of: {', '.join(VALID_ROLES)}.")
    users = user_store.list_all()
    if role:
        users = [u for u in users if u.role == role]
    if q:
        needle = q.lower()
        users = [
            u for u in users if needle in u.name.lower() or needle in u.email.lower()
        ]
    users.sort(key=lambda u: u.createdAt, reverse=True)
    items, total = paginate(users, page, page_size)
    return Page[AdminUserOut](
        items=[_admin_user(u) for u in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/users/{user_id}", response_model=AdminUserOut)
async def get_user(
    user_id: str,
    _: UserRecord = Depends(ADMIN),
) -> AdminUserOut:
    return _admin_user(_find_user(user_id))


@router.patch("/users/{user_id}", response_model=AdminUserOut)
async def update_user(
    user_id: str,
    body: AdminUserUpdate,
    admin: UserRecord = Depends(ADMIN),
) -> AdminUserOut:
    target = _find_user(user_id)

    if body.role is not None:
        if body.role not in VALID_ROLES:
            raise ApiError(400, f"role must be one of: {', '.join(VALID_ROLES)}.")
        if target.id == admin.id and body.role != "admin":
            raise ApiError(400, "You cannot remove your own admin role.")
        target.role = body.role
        user_store.upsert(target)

    if body.verified is not None or body.available is not None:
        _, profile = profile_store.ensure_own(target)
        profile_store.set_flags(
            profile["id"],
            verified=body.verified,
            available=body.available,
        )

    return _admin_user(target)


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: str,
    admin: UserRecord = Depends(ADMIN),
) -> Response:
    target = _find_user(user_id)
    if target.id == admin.id:
        raise ApiError(400, "You cannot delete your own account.")
    if (
        target.role == "admin"
        and len([u for u in user_store.list_all() if u.role == "admin"]) <= 1
    ):
        raise ApiError(400, "Cannot delete the last admin.")

    profile_store.delete_for_user(target.id)
    user_store.delete(target.email)
    return Response(status_code=204)


@router.get("/opportunities", response_model=Page[OpportunityOut])
async def list_all_opportunities(
    q: str | None = Query(
        default=None, description="Matches title, overview, company or tags"
    ),
    status: str | None = Query(
        default="all", description="all | draft | published | closed"
    ),
    companyId: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    _: UserRecord = Depends(ADMIN),
) -> Page[OpportunityOut]:
    if status and status != "all" and status not in OPPORTUNITY_STATUSES:
        raise ApiError(
            400, f"status must be one of: all, {', '.join(OPPORTUNITY_STATUSES)}."
        )
    found = opportunity_store.search(
        q=q,
        company_id=companyId,
        status=None if status in (None, "all") else status,
    )
    items, total = paginate(found, page, page_size)
    return Page[OpportunityOut](
        items=[OpportunityOut.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("/opportunities/{opportunity_id}/moderate", response_model=OpportunityOut)
async def moderate_opportunity(
    opportunity_id: str,
    body: OpportunityStatusUpdate,
    _: UserRecord = Depends(ADMIN),
) -> OpportunityOut:
    if body.status not in OPPORTUNITY_STATUSES:
        raise ApiError(
            400, f"status must be one of: {', '.join(OPPORTUNITY_STATUSES)}."
        )
    record = opportunity_store.get(opportunity_id)
    if not record:
        raise ApiError(404, "Opportunity not found.")
    return OpportunityOut.model_validate(
        opportunity_store.set_status(record, body.status)
    )


@router.get("/analytics", response_model=AdminAnalytics)
async def analytics(_: UserRecord = Depends(ADMIN)) -> AdminAnalytics:
    users = user_store.list_all()
    students = profile_store.search_students()
    companies = profile_store.search_companies()
    opportunities = opportunity_store.search(status=None)
    connections = connection_store.all()
    collabs = collab_store.search()

    by_role = {role: sum(1 for u in users if u.role == role) for role in VALID_ROLES}
    skill_counts: dict[str, int] = {}
    for student in students:
        for skill in student.get("skills", []):
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
    top_skills = sorted(skill_counts.items(), key=lambda kv: (-kv[1], kv[0]))[:10]
    recent = sorted(users, key=lambda u: u.createdAt, reverse=True)[:5]

    return AdminAnalytics(
        totalUsers=len(users),
        totalStudents=by_role.get("student", 0),
        totalEmployers=by_role.get("employer", 0),
        totalProviders=by_role.get("provider", 0),
        totalAdmins=by_role.get("admin", 0),
        totalProfiles=len(students) + len(companies),
        totalCompanies=len(companies),
        totalOpportunities=len(opportunities),
        publishedOpportunities=sum(
            1 for o in opportunities if o.get("status") == "published"
        ),
        draftOpportunities=sum(1 for o in opportunities if o.get("status") == "draft"),
        closedOpportunities=sum(
            1 for o in opportunities if o.get("status") == "closed"
        ),
        totalConnections=len(connections),
        pendingConnections=sum(1 for c in connections if c["status"] == "pending"),
        totalCollabs=len(collabs),
        totalInterests=sum(len(c["interests"]) for c in collabs),
        topSkills=[SkillCount(skill=skill, count=count) for skill, count in top_skills],
        recentUsers=[_admin_user(u) for u in recent],
    )
