"""SQLAlchemy-backed stores (Stage 2).

Each class intentionally exposes the same method surface as its in-memory
counterpart, so routers and services need no changes. String slug ids and JSON
columns keep the existing API contract intact.
"""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import func

from app.db import init_db, session
from app.db_models import (
    CollabInterestRow,
    CollabPostRow,
    CompanyRow,
    ConnectionRow,
    OpportunityRow,
    StudentProfileRow,
    UserRow,
)
from app.errors import ApiError
from app.profile_schemas import CompanyProfile, OwnProfile, ProfileLinks
from app.security import hash_password


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


_SEED_HASH_CACHE: dict[str, str] = {}


def _seed_hash(password: str) -> str:
    if password not in _SEED_HASH_CACHE:
        _SEED_HASH_CACHE[password] = hash_password(password)
    return _SEED_HASH_CACHE[password]


def _profile_id_for(user) -> str:
    from app.profiles import profile_store

    found = profile_store.get_for_user(user.id)
    return found[1]["id"] if found else user.id


def _display(profile_id: str) -> tuple[str, str]:
    from app.profiles import profile_store
    from app.store import user_store

    record = profile_store.get(profile_id)
    if record:
        return record.get("name", profile_id), record.get("avatar") or record.get(
            "logo"
        ) or ""
    for candidate in user_store.list_all():
        if candidate.id == profile_id:
            return candidate.name or profile_id, candidate.avatar or ""
    return profile_id, ""


def _actor(user) -> tuple[str, str, str]:
    profile_id = _profile_id_for(user)
    name, avatar = _display(profile_id)
    if name == profile_id:
        name = user.name or profile_id
    if not avatar:
        avatar = user.avatar or ""
    return profile_id, name, avatar


def _student_dict(row: StudentProfileRow) -> dict:
    return {
        "id": row.id,
        "name": row.name,
        "role": row.role,
        "title": row.title,
        "avatar": row.avatar,
        "verified": bool(row.verified),
        "available": bool(row.available),
        "statusText": row.status_text,
        "about": row.about or "",
        "skills": list(row.skills or []),
        "university": row.university,
        "year": row.year,
        "projectsCount": row.projects_count or 0,
        "projects": list(row.projects or []),
        "links": row.links,
        "userId": row.user_id,
    }


def _company_dict(row: CompanyRow) -> dict:
    return {
        "id": row.id,
        "name": row.name,
        "logo": row.logo or "",
        "industry": row.industry or "",
        "location": row.location or "",
        "verified": bool(row.verified),
        "activeRolesCount": row.active_roles_count or 0,
        "founded": row.founded,
        "companySize": row.company_size,
        "about": row.about or "",
        "website": row.website,
        "ownerUserId": row.owner_user_id,
    }


def _opportunity_dict(row: OpportunityRow) -> dict:
    return {
        "id": row.id,
        "companyId": row.company_id,
        "companyName": row.company_name or "",
        "companyLogo": row.company_logo or "",
        "title": row.title,
        "type": row.type,
        "location": row.location or "Remote",
        "duration": row.duration or "",
        "stipend": row.stipend or "",
        "tags": list(row.tags or []),
        "overview": row.overview or "",
        "requirements": row.requirements or {},
        "processSteps": list(row.process_steps or []),
        "benefits": list(row.benefits or []),
        "hiringManager": row.hiring_manager or {},
        "status": row.status or "published",
        "applicantCount": row.applicant_count or 0,
        "postedAt": row.posted_at or "",
        "ownerUserId": row.owner_user_id,
    }


def _connection_dict(row: ConnectionRow) -> dict:
    return {
        "id": row.id,
        "requesterId": row.requester_id,
        "requesterName": row.requester_name or "",
        "requesterAvatar": row.requester_avatar or "",
        "recipientId": row.recipient_id,
        "recipientName": row.recipient_name or "",
        "recipientAvatar": row.recipient_avatar or "",
        "message": row.message or "",
        "status": row.status,
        "createdAt": row.created_at,
        "updatedAt": row.updated_at,
    }


class DbUserStore:
    def __init__(self, seed: list[dict]) -> None:
        self._seed = seed
        init_db()
        with session() as s:
            if s.query(UserRow).count() == 0:
                self._seed_rows(s)

    def _seed_rows(self, s) -> None:
        for item in self._seed:
            s.add(
                UserRow(
                    id=item["id"],
                    email=item["email"].lower(),
                    password_hash=_seed_hash(item["password"]),
                    role=item["role"],
                    name=item["name"],
                    institution=item.get("institution"),
                    title=item.get("title"),
                    avatar=item.get("avatar"),
                    bio=item.get("bio", ""),
                    skills=list(item.get("skills") or []),
                    created_at=_now(),
                )
            )
        s.commit()

    def reset(self) -> None:
        with session() as s:
            s.query(UserRow).delete()
            s.commit()
            self._seed_rows(s)

    def get(self, email: str) -> UserRow | None:
        if not email:
            return None
        with session() as s:
            return (
                s.query(UserRow)
                .filter(func.lower(UserRow.email) == email.lower().strip())
                .first()
            )

    def has(self, email: str) -> bool:
        return self.get(email) is not None

    def list_all(self) -> list[UserRow]:
        with session() as s:
            return list(s.query(UserRow).all())

    def get_by_id(self, user_id: str) -> UserRow | None:
        with session() as s:
            return s.query(UserRow).filter(UserRow.id == user_id).first()

    def upsert(self, user: UserRow) -> UserRow:
        with session() as s:
            s.merge(user)
            s.commit()
        return user

    def create(
        self,
        email: str,
        password: str,
        role: str,
        name: str,
        institution: str | None = None,
        title: str | None = None,
    ) -> UserRow:
        record = UserRow(
            id=f"usr-{role}-{uuid4().hex[:8]}",
            email=email.strip().lower(),
            password_hash=hash_password(password),
            role=role,
            name=name.strip(),
            institution=institution,
            title=title,
            avatar=f"https://ui-avatars.com/api/?name={name.strip() or 'User'}&background=random&size=200",
            bio="",
            skills=[],
            created_at=_now(),
        )
        with session() as s:
            s.add(record)
            s.commit()
        return record

    def delete(self, email: str) -> bool:
        with session() as s:
            row = (
                s.query(UserRow)
                .filter(func.lower(UserRow.email) == email.lower().strip())
                .first()
            )
            if not row:
                return False
            s.delete(row)
            s.commit()
            return True


class DbProfileStore:
    def __init__(self, students: list[dict], companies: list[dict]) -> None:
        self._students_seed = students
        self._companies_seed = companies
        init_db()
        with session() as s:
            if (
                s.query(StudentProfileRow).count() == 0
                and s.query(CompanyRow).count() == 0
            ):
                self._seed_rows(s)

    def _seed_rows(self, s) -> None:
        for item in self._students_seed:
            s.add(
                StudentProfileRow(
                    id=item["id"],
                    user_id=item.get("userId"),
                    name=item.get("name", ""),
                    role=item.get("role", ""),
                    title=item.get("title", ""),
                    avatar=item.get("avatar", ""),
                    verified=bool(item.get("verified")),
                    available=bool(item.get("available", True)),
                    status_text=item.get("statusText"),
                    about=item.get("about", ""),
                    skills=list(item.get("skills") or []),
                    university=item.get("university"),
                    year=item.get("year"),
                    projects_count=int(item.get("projectsCount") or 0),
                    projects=list(item.get("projects") or []),
                    links=item.get("links"),
                )
            )
        for item in self._companies_seed:
            s.add(
                CompanyRow(
                    id=item["id"],
                    owner_user_id=item.get("ownerUserId"),
                    name=item.get("name", ""),
                    logo=item.get("logo", ""),
                    industry=item.get("industry", ""),
                    location=item.get("location", ""),
                    verified=bool(item.get("verified")),
                    active_roles_count=int(item.get("activeRolesCount") or 0),
                    founded=item.get("founded"),
                    company_size=item.get("companySize"),
                    about=item.get("about", ""),
                    website=item.get("website"),
                )
            )
        s.commit()

    def reset(self) -> None:
        with session() as s:
            s.query(StudentProfileRow).delete()
            s.query(CompanyRow).delete()
            s.commit()
            self._seed_rows(s)

    def search_students(
        self,
        q: str | None = None,
        skills: str | None = None,
        available: bool | None = None,
        verified: bool | None = None,
    ) -> list[dict]:
        with session() as s:
            items = [_student_dict(r) for r in s.query(StudentProfileRow).all()]
        if q:
            needle = q.lower()
            items = [
                s
                for s in items
                if needle in s["name"].lower()
                or needle in s["title"].lower()
                or needle in (s.get("about") or "").lower()
                or any(needle in sk.lower() for sk in s["skills"])
            ]
        if skills:
            wanted = {k.strip().lower() for k in skills.split(",") if k.strip()}
            items = [s for s in items if wanted & {sk.lower() for sk in s["skills"]}]
        if available is not None:
            items = [s for s in items if s["available"] is available]
        if verified is not None:
            items = [s for s in items if s["verified"] is verified]
        return items

    def search_companies(
        self,
        q: str | None = None,
        industry: str | None = None,
        location: str | None = None,
        verified: bool | None = None,
    ) -> list[dict]:
        with session() as s:
            items = [_company_dict(r) for r in s.query(CompanyRow).all()]
        if q:
            needle = q.lower()
            items = [
                c
                for c in items
                if needle in c["name"].lower()
                or needle in c["industry"].lower()
                or needle in (c.get("about") or "").lower()
            ]
        if industry:
            needle = industry.lower()
            items = [c for c in items if needle in c["industry"].lower()]
        if location:
            needle = location.lower()
            items = [c for c in items if needle in c["location"].lower()]
        if verified is not None:
            items = [c for c in items if c["verified"] is verified]
        return items

    def get(self, profile_id: str) -> dict | None:
        with session() as s:
            student = (
                s.query(StudentProfileRow)
                .filter(StudentProfileRow.id == profile_id)
                .first()
            )
            if student:
                return _student_dict(student)
            company = s.query(CompanyRow).filter(CompanyRow.id == profile_id).first()
            if company:
                return _company_dict(company)
        return None

    def get_for_user(self, user_id: str) -> tuple[str, dict] | None:
        with session() as s:
            student = (
                s.query(StudentProfileRow)
                .filter(StudentProfileRow.user_id == user_id)
                .first()
            )
            if student:
                return "student", _student_dict(student)
            company = (
                s.query(CompanyRow).filter(CompanyRow.owner_user_id == user_id).first()
            )
            if company:
                return "company", _company_dict(company)
        return None

    def ensure_own(self, user) -> tuple[str, dict]:
        found = self.get_for_user(user.id)
        if found:
            return found
        record = StudentProfileRow(
            id=user.id,
            user_id=user.id,
            name=user.name,
            role=user.title or "Student",
            title=user.title or "Student",
            avatar=user.avatar or "",
            verified=False,
            available=True,
            status_text="Available",
            about=user.bio or "",
            skills=list(user.skills or []),
            university=user.institution,
            year=None,
            projects_count=0,
            projects=[],
            links=None,
        )
        with session() as s:
            s.add(record)
            s.commit()
        return "student", _student_dict(record)

    def update_own(self, user, updates: dict) -> tuple[str, dict]:
        kind, record = self.ensure_own(user)
        with session() as s:
            if kind == "company":
                row = s.query(CompanyRow).filter(CompanyRow.id == record["id"]).first()
                if row:
                    if updates.get("name") is not None:
                        row.name = updates["name"]
                    if updates.get("about") is not None:
                        row.about = updates["about"]
            else:
                row = (
                    s.query(StudentProfileRow)
                    .filter(StudentProfileRow.id == record["id"])
                    .first()
                )
                if row:
                    if updates.get("name") is not None:
                        row.name = updates["name"]
                    if updates.get("title") is not None:
                        row.title = updates["title"]
                    if updates.get("about") is not None:
                        row.about = updates["about"]
                    if updates.get("skills") is not None:
                        row.skills = list(updates["skills"])
                    if updates.get("avatar") is not None:
                        row.avatar = updates["avatar"]
                    if updates.get("available") is not None:
                        row.available = updates["available"]
                    if updates.get("statusText") is not None:
                        row.status_text = updates["statusText"]
                    if updates.get("university") is not None:
                        row.university = updates["university"]
                    if updates.get("year") is not None:
                        row.year = updates["year"]
                    if isinstance(updates.get("links"), dict):
                        row.links = {**ProfileLinks().model_dump(), **updates["links"]}
            s.commit()

        if updates.get("name") is not None:
            user.name = str(updates["name"]).strip()
        if updates.get("title") is not None:
            user.title = str(updates["title"]).strip() or None
        if updates.get("institution") is not None:
            user.institution = str(updates["institution"]).strip() or None
        if updates.get("university") is not None:
            user.institution = str(updates["university"]).strip() or None
        if updates.get("avatar") is not None:
            user.avatar = str(updates["avatar"]).strip() or None
        if updates.get("about") is not None:
            user.bio = str(updates["about"]).strip()
        if updates.get("skills") is not None:
            user.skills = list(updates["skills"] or [])

        with session() as s:
            user_row = s.query(UserRow).filter(UserRow.id == user.id).first()
            if user_row:
                user_row.name = user.name
                user_row.title = user.title
                user_row.institution = user.institution
                user_row.avatar = user.avatar
                user_row.bio = user.bio or ""
                user_row.skills = list(user.skills or [])
                s.commit()

        return self.get_for_user(user.id) or (kind, record)

    def set_flags(
        self,
        profile_id: str,
        *,
        verified: bool | None = None,
        available: bool | None = None,
    ) -> dict | None:
        with session() as s:
            student = (
                s.query(StudentProfileRow)
                .filter(StudentProfileRow.id == profile_id)
                .first()
            )
            if student:
                if verified is not None:
                    student.verified = verified
                if available is not None:
                    student.available = available
                s.commit()
                return _student_dict(student)
            company = s.query(CompanyRow).filter(CompanyRow.id == profile_id).first()
            if company:
                if verified is not None:
                    company.verified = verified
                s.commit()
                return _company_dict(company)
        return None

    def delete_for_user(self, user_id: str) -> bool:
        with session() as s:
            student = (
                s.query(StudentProfileRow)
                .filter(StudentProfileRow.user_id == user_id)
                .first()
            )
            if student:
                s.delete(student)
                s.commit()
                return True
            company = (
                s.query(CompanyRow).filter(CompanyRow.owner_user_id == user_id).first()
            )
            if company:
                s.delete(company)
                s.commit()
                return True
        return False

    def own_profile(self, user) -> OwnProfile:
        kind, record = self.ensure_own(user)
        university = record.get("university") or user.institution
        base = OwnProfile(
            id=user.id,
            role=user.role,
            name=record.get("name") or user.name,
            email=user.email,
            title=record.get("title") or user.title,
            institution=user.institution,
            avatar=record.get("avatar") or user.avatar,
            about=(record.get("about") if "about" in record else user.bio) or "",
            skills=list(record.get("skills") or user.skills or []),
            available=record.get("available"),
            statusText=record.get("statusText"),
            university=university,
            year=record.get("year"),
            links=ProfileLinks(**record["links"]) if record.get("links") else None,
        )
        if kind == "company":
            base.company = CompanyProfile.model_validate(record)
        else:
            base.id = record["id"]
        return base


_OPPORTUNITY_FIELDS = {
    "companyId": "company_id",
    "companyName": "company_name",
    "companyLogo": "company_logo",
    "title": "title",
    "type": "type",
    "location": "location",
    "duration": "duration",
    "stipend": "stipend",
    "tags": "tags",
    "overview": "overview",
    "requirements": "requirements",
    "processSteps": "process_steps",
    "benefits": "benefits",
    "hiringManager": "hiring_manager",
    "status": "status",
    "applicantCount": "applicant_count",
    "postedAt": "posted_at",
    "ownerUserId": "owner_user_id",
}


class DbOpportunityStore:
    def __init__(self, seed: list[dict]) -> None:
        self._seed = seed
        init_db()
        with session() as s:
            if s.query(OpportunityRow).count() == 0:
                self._seed_rows(s)

    def _seed_rows(self, s) -> None:
        for item in self._seed:
            s.add(
                OpportunityRow(
                    id=item["id"],
                    company_id=item["companyId"],
                    company_name=item.get("companyName", ""),
                    company_logo=item.get("companyLogo", ""),
                    title=item["title"],
                    type=item["type"],
                    location=item.get("location", "Remote"),
                    duration=item.get("duration", ""),
                    stipend=item.get("stipend", ""),
                    tags=list(item.get("tags") or []),
                    overview=item.get("overview", ""),
                    requirements=item.get("requirements") or {},
                    process_steps=list(item.get("processSteps") or []),
                    benefits=list(item.get("benefits") or []),
                    hiring_manager=item.get("hiringManager") or {},
                    status=item.get("status", "published"),
                    applicant_count=int(item.get("applicantCount") or 0),
                    posted_at=item.get("postedAt", ""),
                    owner_user_id=item.get("ownerUserId"),
                )
            )
        s.commit()

    def reset(self) -> None:
        with session() as s:
            s.query(OpportunityRow).delete()
            s.commit()
            self._seed_rows(s)

    def _all_dicts(self) -> list[dict]:
        with session() as s:
            return [_opportunity_dict(r) for r in s.query(OpportunityRow).all()]

    def _sorted(self, items: list[dict]) -> list[dict]:
        return sorted(items, key=lambda o: o.get("postedAt") or "", reverse=True)

    def search(
        self,
        q: str | None = None,
        type: str | None = None,
        location: str | None = None,
        company_id: str | None = None,
        tag: str | None = None,
        status: str | None = None,
    ) -> list[dict]:
        found = self._all_dicts()
        if status:
            found = [o for o in found if o.get("status") == status]
        if type:
            found = [o for o in found if o.get("type") == type]
        if company_id:
            found = [o for o in found if o.get("companyId") == company_id]
        if location:
            needle = location.strip().lower()
            found = [o for o in found if needle in (o.get("location") or "").lower()]
        if tag:
            needle = tag.strip().lower()
            found = [
                o
                for o in found
                if any(needle == t.lower() for t in o.get("tags") or [])
            ]
        if q:
            needle = q.strip().lower()
            found = [
                o
                for o in found
                if needle in o.get("title", "").lower()
                or needle in o.get("overview", "").lower()
                or needle in o.get("companyName", "").lower()
                or any(needle in t.lower() for t in o.get("tags") or [])
            ]
        return self._sorted(found)

    def get(self, opportunity_id: str) -> dict | None:
        with session() as s:
            row = (
                s.query(OpportunityRow)
                .filter(OpportunityRow.id == opportunity_id)
                .first()
            )
            return _opportunity_dict(row) if row else None

    def for_owner(self, user) -> list[dict]:
        if user.role == "admin":
            return self._sorted(self._all_dicts())
        from app.profiles import profile_store

        found = profile_store.get_for_user(user.id)
        if not found or found[0] != "company":
            return []
        company_id = found[1]["id"]
        return self._sorted(
            [o for o in self._all_dicts() if o.get("companyId") == company_id]
        )

    def company_id_for(self, user, requested: str | None = None) -> str:
        from app.profiles import profile_store

        if user.role == "admin":
            company_id = requested
            if not company_id:
                raise ApiError(400, "companyId is required when posting as admin.")
        else:
            found = profile_store.get_for_user(user.id)
            if not found or found[0] != "company":
                raise ApiError(400, "No company profile is linked to this account.")
            company_id = found[1]["id"]
        company = profile_store.get(company_id) if company_id else None
        if not company:
            raise ApiError(404, "Company not found.")
        return company_id

    def can_manage(self, user, record: dict) -> bool:
        if user.role == "admin":
            return True
        if record.get("ownerUserId") == user.id:
            return True
        from app.profiles import profile_store

        found = profile_store.get_for_user(user.id)
        return bool(
            found
            and found[0] == "company"
            and found[1]["id"] == record.get("companyId")
        )

    def create(self, user, payload: dict) -> dict:
        from app.profiles import profile_store

        company_id = self.company_id_for(user, payload.get("companyId"))
        company = profile_store.get(company_id) or {}
        base_id = _slugify(payload["title"])
        existing = {o["id"] for o in self._all_dicts()}
        new_id, suffix = base_id, 2
        while new_id in existing:
            new_id = f"{base_id}-{suffix}"
            suffix += 1

        record = OpportunityRow(
            id=new_id,
            company_id=company_id,
            company_name=company.get("name", ""),
            company_logo=company.get("logo", ""),
            title=payload["title"],
            type=payload["type"],
            location=payload.get("location") or "Remote",
            duration=payload.get("duration") or "",
            stipend=payload.get("stipend") or "",
            tags=list(payload.get("tags") or []),
            overview=payload.get("overview") or "",
            requirements=payload.get("requirements") or {},
            process_steps=list(payload.get("processSteps") or []),
            benefits=list(payload.get("benefits") or []),
            hiring_manager=payload.get("hiringManager") or {},
            status=payload.get("status") or "published",
            applicant_count=0,
            posted_at=_now(),
            owner_user_id=user.id,
        )
        with session() as s:
            s.add(record)
            s.commit()
        return _opportunity_dict(record)

    def update(self, record: dict, updates: dict) -> dict:
        with session() as s:
            row = (
                s.query(OpportunityRow)
                .filter(OpportunityRow.id == record["id"])
                .first()
            )
            if not row:
                raise ApiError(404, "Opportunity not found.")
            for key, value in updates.items():
                column = _OPPORTUNITY_FIELDS.get(key)
                if column and value is not None:
                    setattr(row, column, value)
            s.commit()
            return _opportunity_dict(row)

    def set_status(self, record: dict, status: str) -> dict:
        return self.update(record, {"status": status})

    def delete(self, opportunity_id: str) -> None:
        with session() as s:
            row = (
                s.query(OpportunityRow)
                .filter(OpportunityRow.id == opportunity_id)
                .first()
            )
            if row:
                s.delete(row)
                s.commit()


def _slugify(value: str) -> str:
    out = [c.lower() if c.isalnum() else "-" for c in value.strip()]
    slug = "".join(out)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


class DbConnectionStore:
    def __init__(self) -> None:
        init_db()

    def reset(self) -> None:
        with session() as s:
            s.query(ConnectionRow).delete()
            s.commit()

    def all(self) -> list[dict]:
        with session() as s:
            return [_connection_dict(r) for r in s.query(ConnectionRow).all()]

    def get(self, connection_id: str) -> dict | None:
        with session() as s:
            row = (
                s.query(ConnectionRow).filter(ConnectionRow.id == connection_id).first()
            )
            return _connection_dict(row) if row else None

    def find_between(self, first: str, second: str) -> dict | None:
        for record in self.all():
            if {record["requesterId"], record["recipientId"]} == {
                first,
                second,
            } and record["status"] in (
                "pending",
                "accepted",
            ):
                return record
        return None

    def create(self, requester, recipient_id: str, message: str) -> dict:
        from app.profiles import profile_store

        recipient_id = (recipient_id or "").strip()
        if not recipient_id:
            raise ApiError(400, "recipientId is required.")
        if not profile_store.get(recipient_id):
            raise ApiError(404, "Recipient not found.")

        requester_id, requester_name, requester_avatar = _actor(requester)
        if recipient_id == requester_id:
            raise ApiError(400, "You cannot connect with yourself.")
        if self.find_between(requester_id, recipient_id):
            raise ApiError(409, "A connection already exists with this profile.")

        recipient_name, recipient_avatar = _display(recipient_id)
        with session() as s:
            count = s.query(ConnectionRow).count()
        record = ConnectionRow(
            id=f"conn-{count + 1:04d}",
            requester_id=requester_id,
            requester_name=requester_name,
            requester_avatar=requester_avatar,
            recipient_id=recipient_id,
            recipient_name=recipient_name,
            recipient_avatar=recipient_avatar,
            message=(message or "").strip(),
            status="pending",
            created_at=_now(),
            updated_at=_now(),
        )
        with session() as s:
            s.add(record)
            s.commit()
        return _connection_dict(record)

    def list_for(
        self, user, direction: str = "all", status: str | None = None
    ) -> list[dict]:
        profile_id = _profile_id_for(user)
        items = self.all()
        if direction == "incoming":
            items = [c for c in items if c["recipientId"] == profile_id]
        elif direction == "outgoing":
            items = [c for c in items if c["requesterId"] == profile_id]
        else:
            items = [
                c for c in items if profile_id in (c["requesterId"], c["recipientId"])
            ]
        if status:
            items = [c for c in items if c["status"] == status]
        return sorted(items, key=lambda c: c["createdAt"], reverse=True)

    def respond(self, connection_id: str, user, status: str) -> dict:
        record = self.get(connection_id)
        if not record:
            raise ApiError(404, "Connection not found.")
        if record["recipientId"] != _profile_id_for(user):
            raise ApiError(403, "Only the recipient can respond to this request.")
        if record["status"] != "pending":
            raise ApiError(409, "This connection has already been answered.")
        with session() as s:
            row = (
                s.query(ConnectionRow).filter(ConnectionRow.id == connection_id).first()
            )
            row.status = status
            row.updated_at = _now()
            s.commit()
            return _connection_dict(row)

    def delete(self, connection_id: str, user) -> None:
        record = self.get(connection_id)
        if not record:
            raise ApiError(404, "Connection not found.")
        if _profile_id_for(user) not in (record["requesterId"], record["recipientId"]):
            raise ApiError(403, "Not authorized to remove this connection.")
        with session() as s:
            row = (
                s.query(ConnectionRow).filter(ConnectionRow.id == connection_id).first()
            )
            if row:
                s.delete(row)
                s.commit()


class DbCollabStore:
    def __init__(self, seed: list[dict]) -> None:
        self._seed = seed
        init_db()
        with session() as s:
            if s.query(CollabPostRow).count() == 0:
                self._seed_rows(s)

    def _seed_rows(self, s) -> None:
        for item in self._seed:
            name, avatar = _display(item["authorId"])
            s.add(
                CollabPostRow(
                    id=item["id"],
                    author_id=item["authorId"],
                    author_name=name,
                    author_avatar=avatar,
                    phase=item["phase"],
                    title=item["title"],
                    description=item["description"],
                    tags=list(item.get("tags") or []),
                    created_at=item["createdAt"],
                    updated_at=item["createdAt"],
                )
            )
            for profile_id in item.get("interests") or []:
                s.add(
                    CollabInterestRow(
                        post_id=item["id"],
                        profile_id=profile_id,
                        created_at=item["createdAt"],
                    )
                )
        s.commit()

    def reset(self) -> None:
        with session() as s:
            s.query(CollabInterestRow).delete()
            s.query(CollabPostRow).delete()
            s.commit()
            self._seed_rows(s)

    def _interest_ids(self, collab_id: str) -> list[str]:
        with session() as s:
            rows = (
                s.query(CollabInterestRow)
                .filter(CollabInterestRow.post_id == collab_id)
                .all()
            )
            return [r.profile_id for r in rows]

    def _to_dict(self, row: CollabPostRow) -> dict:
        return {
            "id": row.id,
            "authorId": row.author_id,
            "authorName": row.author_name or "",
            "authorAvatar": row.author_avatar or "",
            "phase": row.phase,
            "title": row.title,
            "description": row.description or "",
            "tags": list(row.tags or []),
            "interests": self._interest_ids(row.id),
            "createdAt": row.created_at,
            "updatedAt": row.updated_at,
        }

    def all(self) -> list[dict]:
        with session() as s:
            return [self._to_dict(r) for r in s.query(CollabPostRow).all()]

    def get(self, collab_id: str) -> dict | None:
        with session() as s:
            row = s.query(CollabPostRow).filter(CollabPostRow.id == collab_id).first()
            return self._to_dict(row) if row else None

    def search(
        self,
        q: str | None = None,
        phase: str | None = None,
        tag: str | None = None,
        author_id: str | None = None,
    ) -> list[dict]:
        items = self.all()
        if q:
            needle = q.lower()
            items = [
                c
                for c in items
                if needle in c["title"].lower()
                or needle in c["description"].lower()
                or any(needle in t.lower() for t in c["tags"])
            ]
        if phase:
            items = [c for c in items if c["phase"].lower() == phase.lower()]
        if tag:
            items = [c for c in items if tag.lower() in {t.lower() for t in c["tags"]}]
        if author_id:
            items = [c for c in items if c["authorId"] == author_id]
        return sorted(items, key=lambda c: c["createdAt"], reverse=True)

    def create(self, user, payload: dict) -> dict:
        from app.profiles import profile_store

        _, profile = profile_store.ensure_own(user)
        with session() as s:
            count = s.query(CollabPostRow).count()
        record = CollabPostRow(
            id=f"collab-{count + 1}",
            author_id=profile["id"],
            author_name=profile.get("name") or user.name,
            author_avatar=profile.get("avatar") or user.avatar or "",
            phase=payload.get("phase") or "Ideation Phase",
            title=payload["title"].strip(),
            description=(payload.get("description") or "").strip(),
            tags=list(payload.get("tags") or []),
            created_at=_now(),
            updated_at=_now(),
        )
        with session() as s:
            s.add(record)
            s.commit()
        return self._to_dict(record)

    def update(self, record: dict, updates: dict, user) -> dict:
        if record["authorId"] != _profile_id_for(user):
            raise ApiError(403, "Only the author can edit this collaboration post.")
        with session() as s:
            row = (
                s.query(CollabPostRow).filter(CollabPostRow.id == record["id"]).first()
            )
            if not row:
                raise ApiError(404, "Collaboration post not found.")
            if updates.get("title") is not None:
                row.title = updates["title"].strip()
            if updates.get("phase") is not None:
                row.phase = updates["phase"]
            if updates.get("description") is not None:
                row.description = updates["description"].strip()
            if updates.get("tags") is not None:
                row.tags = list(updates["tags"])
            row.updated_at = _now()
            s.commit()
            return self._to_dict(row)

    def delete(self, record: dict, user) -> None:
        if record["authorId"] != _profile_id_for(user):
            raise ApiError(403, "Only the author can delete this collaboration post.")
        with session() as s:
            s.query(CollabInterestRow).filter(
                CollabInterestRow.post_id == record["id"]
            ).delete()
            row = (
                s.query(CollabPostRow).filter(CollabPostRow.id == record["id"]).first()
            )
            if row:
                s.delete(row)
            s.commit()

    def toggle_interest(self, record: dict, user) -> bool:
        profile_id = _profile_id_for(user)
        with session() as s:
            existing = (
                s.query(CollabInterestRow)
                .filter(
                    CollabInterestRow.post_id == record["id"],
                    CollabInterestRow.profile_id == profile_id,
                )
                .first()
            )
            if existing:
                s.delete(existing)
                s.commit()
                return False
            s.add(
                CollabInterestRow(
                    post_id=record["id"], profile_id=profile_id, created_at=_now()
                )
            )
            s.commit()
            return True

    def interests(self, record: dict) -> list[dict]:
        result = []
        for profile_id in self._interest_ids(record["id"]):
            name, avatar = _display(profile_id)
            result.append({"profileId": profile_id, "name": name, "avatar": avatar})
        return result
