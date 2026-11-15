from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.db import session, init_db
from app.db_models import ProjectRow, ApplicationRow, ForumPostRow, ProjectSquadRow, PrepSessionRow, LibraryResourceRow
from app.dependencies import get_current_user, get_optional_user
from app.store import UserRecord
import datetime

router = APIRouter(prefix="/api", tags=["core_ecosystem"])

# ─── PROJECTS ─────────────────────────────────────────────────────────────────
@router.get("/projects")
async def list_projects(category: str | None = None, status: str | None = None):
    init_db()
    s = session()
    q = s.query(ProjectRow)
    if category and category != "All":
        q = q.filter(ProjectRow.category == category)
    if status and status != "All":
        q = q.filter(ProjectRow.status == status)
    rows = q.all()
    return [r.to_dict() for r in rows]

class ProjectCreate(BaseModel):
    title: str
    tagline: str = ""
    category: str = "Web"
    status: str = "Validated"
    image: str = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
    tags: list[str] = []
    problem: str = ""
    solution: str = ""
    keyFeatures: list[str] = []
    contribution: str = ""
    technologies: list[str] = []
    gallery: list[str] = []
    liveDemoUrl: str | None = None
    githubUrl: str | None = None

@router.post("/projects", status_code=201)
async def create_project(body: ProjectCreate, user: UserRecord = Depends(get_current_user)):
    init_db()
    s = session()
    proj_id = f"proj-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}"
    row = ProjectRow(
        id=proj_id,
        title=body.title,
        tagline=body.tagline,
        category=body.category,
        status=body.status,
        image=body.image,
        creator={"name": user.name, "role": user.title or user.role, "avatar": user.avatar or ""},
        tags=body.tags,
        problem=body.problem,
        solution=body.solution,
        key_features=body.keyFeatures,
        contribution=body.contribution,
        technologies=body.technologies,
        gallery=body.gallery or [body.image],
        live_demo_url=body.liveDemoUrl,
        github_url=body.githubUrl,
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    )
    s.add(row)
    s.commit()
    s.refresh(row)
    return row.to_dict()

# ─── APPLICATIONS ─────────────────────────────────────────────────────────────
class ApplicationCreate(BaseModel):
    opportunityId: str
    portfolioLink: str | None = None
    githubLink: str | None = None
    coverNote: str = ""
    includeVerifiedScore: bool = True

@router.get("/applications")
async def list_applications(user: UserRecord = Depends(get_current_user)):
    init_db()
    s = session()
    if user.role in ("employer", "admin"):
        rows = s.query(ApplicationRow).all()
    else:
        rows = s.query(ApplicationRow).filter(ApplicationRow.applicant_id == user.id).all()
    return [r.to_dict() for r in rows]

@router.post("/applications", status_code=201)
async def create_application(body: ApplicationCreate, user: UserRecord = Depends(get_current_user)):
    init_db()
    s = session()
    app_id = f"app-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}"
    row = ApplicationRow(
        id=app_id,
        opportunity_id=body.opportunityId,
        applicant_id=user.id,
        applicant_name=user.name,
        applicant_avatar=user.avatar or "",
        applicant_role=user.title or "Software Engineer",
        portfolio_link=body.portfolioLink,
        github_link=body.githubLink,
        cover_note=body.coverNote,
        include_verified_score=body.includeVerifiedScore,
        status="Under Review",
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    )
    s.add(row)
    s.commit()
    s.refresh(row)
    return row.to_dict()

# ─── COMMUNITY FORUM ──────────────────────────────────────────────────────────
@router.get("/forum/posts")
async def list_forum_posts(category: str | None = None):
    init_db()
    s = session()
    q = s.query(ForumPostRow)
    if category and category != "All":
        q = q.filter(ForumPostRow.category == category)
    rows = q.order_by(ForumPostRow.created_at.desc()).all()
    return [r.to_dict() for r in rows]

class ForumPostCreate(BaseModel):
    title: str
    content: str
    category: str = "System Design"
    tags: list[str] = []

@router.post("/forum/posts", status_code=201)
async def create_forum_post(body: ForumPostCreate, user: UserRecord = Depends(get_current_user)):
    init_db()
    s = session()
    post_id = f"post-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}"
    row = ForumPostRow(
        id=post_id,
        author_id=user.id,
        author=user.name,
        author_avatar=user.avatar or "",
        role=user.title or user.role.capitalize(),
        category=body.category,
        title=body.title,
        content=body.content,
        tags=body.tags,
        upvotes=1,
        replies_count=0,
        time_ago="Just now",
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    )
    s.add(row)
    s.commit()
    s.refresh(row)
    return row.to_dict()

@router.post("/forum/posts/{post_id}/upvote")
async def upvote_forum_post(post_id: str):
    init_db()
    s = session()
    row = s.query(ForumPostRow).filter(ForumPostRow.id == post_id).first()
    if row:
        row.upvotes = (row.upvotes or 0) + 1
        s.commit()
        return {"upvotes": row.upvotes}
    return {"upvotes": 0}

# ─── PROJECT SQUADS ───────────────────────────────────────────────────────────
@router.get("/squads")
async def list_squads():
    init_db()
    s = session()
    rows = s.query(ProjectSquadRow).all()
    return [r.to_dict() for r in rows]

class SquadTaskStatusUpdate(BaseModel):
    status: str

@router.patch("/squads/{squad_id}/tasks/{task_id}")
async def update_squad_task(squad_id: str, task_id: str, body: SquadTaskStatusUpdate):
    init_db()
    s = session()
    row = s.query(ProjectSquadRow).filter(ProjectSquadRow.id == squad_id).first()
    if row:
        tasks = list(row.tasks or [])
        for t in tasks:
            if t.get("id") == task_id:
                t["status"] = body.status
        completed = sum(1 for t in tasks if t.get("status") == "completed")
        progress = int((completed / len(tasks) * 100)) if tasks else 0
        row.tasks = tasks
        row.progress_percentage = progress
        s.commit()
        return row.to_dict()
    return {}

class SquadTaskAdd(BaseModel):
    title: str
    assigneeName: str = "Alex Mwansa"
    assigneeAvatar: str = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    priority: str = "medium"

@router.post("/squads/{squad_id}/tasks")
async def add_squad_task(squad_id: str, body: SquadTaskAdd):
    init_db()
    s = session()
    row = s.query(ProjectSquadRow).filter(ProjectSquadRow.id == squad_id).first()
    if row:
        tasks = list(row.tasks or [])
        new_task = {
            "id": f"task-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}",
            "title": body.title,
            "status": "todo",
            "priority": body.priority,
            "assignee": {
                "name": body.assigneeName,
                "avatar": body.assigneeAvatar
            }
        }
        tasks.append(new_task)
        row.tasks = tasks
        s.commit()
        return row.to_dict()
    return {}

# ─── PREP SESSIONS & LIBRARY RESOURCES ────────────────────────────────────────
@router.get("/prep/sessions")
async def list_prep_sessions():
    init_db()
    s = session()
    rows = s.query(PrepSessionRow).all()
    return [r.to_dict() for r in rows]

@router.get("/prep/resources")
async def list_prep_resources(section: str | None = None):
    init_db()
    s = session()
    q = s.query(LibraryResourceRow)
    if section:
        q = q.filter(LibraryResourceRow.section == section)
    rows = q.all()
    return [r.to_dict() for r in rows]

@router.post("/prep/resources/{resource_id}/toggle")
async def toggle_prep_resource(resource_id: str):
    init_db()
    s = session()
    row = s.query(LibraryResourceRow).filter(LibraryResourceRow.id == resource_id).first()
    if row:
        row.completed = not bool(row.completed)
        s.commit()
        return {"id": row.id, "completed": row.completed}
    return {}

