"""In-memory networking stores (Stage 7).

Covers connections (requests between profiles) and collaboration posts with
expressions of interest. Kept behind minimal interfaces so Stage 2 can swap in
SQLAlchemy repositories without touching routers.
"""

from datetime import datetime, timezone

from app.config import settings
from app.errors import ApiError
from app.profiles import profile_store
from app.store import UserRecord, user_store


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def profile_id_for(user: UserRecord) -> str:
    """Resolve the public profile id (slug) for an auth user."""
    found = profile_store.get_for_user(user.id)
    return found[1]["id"] if found else user.id


def display_for(profile_id: str) -> tuple[str, str]:
    record = profile_store.get(profile_id)
    if record:
        return record.get("name", profile_id), record.get("avatar") or record.get(
            "logo"
        ) or ""
    for candidate in user_store.list_all():
        if candidate.id == profile_id:
            return candidate.name or profile_id, candidate.avatar or ""
    return profile_id, ""


def _actor(user: UserRecord) -> tuple[str, str, str]:
    profile_id = profile_id_for(user)
    name, avatar = display_for(profile_id)
    if name == profile_id:
        name = user.name or profile_id
    if not avatar:
        avatar = user.avatar or ""
    return profile_id, name, avatar


CONNECTION_STATUSES = ("pending", "accepted", "declined")


class ConnectionStore:
    def __init__(self) -> None:
        self._by_id: dict[str, dict] = {}
        self._seq = 0
        self.reset()

    def reset(self) -> None:
        self._by_id.clear()
        self._seq = 0

    def all(self) -> list[dict]:
        return list(self._by_id.values())

    def get(self, connection_id: str) -> dict | None:
        return self._by_id.get(connection_id)

    def _next_id(self) -> str:
        self._seq += 1
        return f"conn-{self._seq:04d}"

    def find_between(self, first: str, second: str) -> dict | None:
        for record in self._by_id.values():
            if {record["requesterId"], record["recipientId"]} == {
                first,
                second,
            } and record["status"] in (
                "pending",
                "accepted",
            ):
                return record
        return None

    def create(self, requester: UserRecord, recipient_id: str, message: str) -> dict:
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

        recipient_name, recipient_avatar = display_for(recipient_id)
        record = {
            "id": self._next_id(),
            "requesterId": requester_id,
            "requesterName": requester_name,
            "requesterAvatar": requester_avatar,
            "recipientId": recipient_id,
            "recipientName": recipient_name,
            "recipientAvatar": recipient_avatar,
            "message": (message or "").strip(),
            "status": "pending",
            "createdAt": _now(),
            "updatedAt": _now(),
        }
        self._by_id[record["id"]] = record
        return record

    def list_for(
        self,
        user: UserRecord,
        direction: str = "all",
        status: str | None = None,
    ) -> list[dict]:
        profile_id = profile_id_for(user)
        items = list(self._by_id.values())
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

    def respond(self, connection_id: str, user: UserRecord, status: str) -> dict:
        record = self.get(connection_id)
        if not record:
            raise ApiError(404, "Connection not found.")
        if record["recipientId"] != profile_id_for(user):
            raise ApiError(403, "Only the recipient can respond to this request.")
        if record["status"] != "pending":
            raise ApiError(409, "This connection has already been answered.")
        record["status"] = status
        record["updatedAt"] = _now()
        return record

    def delete(self, connection_id: str, user: UserRecord) -> None:
        record = self.get(connection_id)
        if not record:
            raise ApiError(404, "Connection not found.")
        if profile_id_for(user) not in (record["requesterId"], record["recipientId"]):
            raise ApiError(403, "Not authorized to remove this connection.")
        del self._by_id[connection_id]


COLLAB_SEED = [
    {
        "id": "collab-1",
        "authorId": "alex-mwansa",
        "phase": "Prototyping Phase",
        "title": "Looking for a backend co-founder for a health-tech side project",
        "description": (
            "We are building an offline-first patient intake app and need help with FastAPI "
            "services, sync and Postgres schemas."
        ),
        "tags": ["FastAPI", "PostgreSQL", "HealthTech"],
        "interests": ["marcus-chen"],
        "createdAt": "2026-02-10T09:00:00+00:00",
    },
    {
        "id": "collab-2",
        "authorId": "sarah-jenkins",
        "phase": "Ideation Phase",
        "title": "Open-source design system for African fintechs",
        "description": (
            "Exploring accessible components and token pipelines; looking for designers "
            "and frontend engineers."
        ),
        "tags": ["Design Systems", "React", "Accessibility"],
        "interests": ["david-osei", "elena-rodriguez"],
        "createdAt": "2026-02-08T14:30:00+00:00",
    },
    {
        "id": "collab-3",
        "authorId": "marcus-chen",
        "phase": "Growth Phase",
        "title": "ML engineer for a climate analytics dashboard",
        "description": (
            "We have validated the concept and need someone to own forecasting models "
            "and data pipelines."
        ),
        "tags": ["PyTorch", "Data Science", "Climate"],
        "interests": [],
        "createdAt": "2026-02-05T11:15:00+00:00",
    },
]


class CollabStore:
    def __init__(self) -> None:
        self._by_id: dict[str, dict] = {}
        self._seq = 0
        self.reset()

    def reset(self) -> None:
        self._by_id.clear()
        for item in COLLAB_SEED:
            name, avatar = display_for(item["authorId"])
            record = {
                "id": item["id"],
                "authorId": item["authorId"],
                "authorName": name,
                "authorAvatar": avatar,
                "phase": item["phase"],
                "title": item["title"],
                "description": item["description"],
                "tags": list(item["tags"]),
                "interests": list(item["interests"]),
                "createdAt": item["createdAt"],
                "updatedAt": item["createdAt"],
            }
            self._by_id[record["id"]] = record
        self._seq = len(COLLAB_SEED)

    def all(self) -> list[dict]:
        return list(self._by_id.values())

    def get(self, collab_id: str) -> dict | None:
        return self._by_id.get(collab_id)

    def _next_id(self) -> str:
        self._seq += 1
        return f"collab-{self._seq}"

    def search(
        self,
        q: str | None = None,
        phase: str | None = None,
        tag: str | None = None,
        author_id: str | None = None,
    ) -> list[dict]:
        items = list(self._by_id.values())
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

    def create(self, user: UserRecord, payload: dict) -> dict:
        _, profile = profile_store.ensure_own(user)
        record = {
            "id": self._next_id(),
            "authorId": profile["id"],
            "authorName": profile.get("name") or user.name,
            "authorAvatar": profile.get("avatar") or user.avatar or "",
            "phase": payload.get("phase") or "Ideation Phase",
            "title": payload["title"].strip(),
            "description": (payload.get("description") or "").strip(),
            "tags": list(payload.get("tags") or []),
            "interests": [],
            "createdAt": _now(),
            "updatedAt": _now(),
        }
        self._by_id[record["id"]] = record
        return record

    def update(self, record: dict, updates: dict, user: UserRecord) -> dict:
        if record["authorId"] != profile_id_for(user):
            raise ApiError(403, "Only the author can edit this collaboration post.")
        for key, value in updates.items():
            if value is None:
                continue
            record[key] = value.strip() if isinstance(value, str) else value
        record["updatedAt"] = _now()
        return record

    def delete(self, record: dict, user: UserRecord) -> None:
        if record["authorId"] != profile_id_for(user):
            raise ApiError(403, "Only the author can delete this collaboration post.")
        del self._by_id[record["id"]]

    def toggle_interest(self, record: dict, user: UserRecord) -> bool:
        profile_id = profile_id_for(user)
        if profile_id in record["interests"]:
            record["interests"].remove(profile_id)
        else:
            record["interests"].append(profile_id)
        record["updatedAt"] = _now()
        return profile_id in record["interests"]

    def interests(self, record: dict) -> list[dict]:
        return [
            {
                "profileId": profile_id,
                "name": display_for(profile_id)[0],
                "avatar": display_for(profile_id)[1],
            }
            for profile_id in record["interests"]
        ]


if settings.persistence == "db":
    from app.db_stores import DbCollabStore, DbConnectionStore

    connection_store = DbConnectionStore()
    collab_store = DbCollabStore(COLLAB_SEED)
else:
    connection_store = ConnectionStore()
    collab_store = CollabStore()
