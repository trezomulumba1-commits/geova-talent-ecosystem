"""In-memory user store.

Kept behind a minimal interface so Stage 2 (SQLAlchemy) can swap it out without
touching routers or services. Seed accounts mirror the original Node server's
demo credentials with the new role enum (student | employer | provider | admin).
"""

from app.config import settings
from app.security import hash_password

ROLES = ("student", "employer", "provider", "admin")


class UserRecord:
    def __init__(
        self,
        id: str,
        email: str,
        password: str | None = None,
        role: str = "student",
        name: str = "",
        institution: str | None = None,
        title: str | None = None,
        avatar: str | None = None,
        bio: str = "",
        skills: list[str] | None = None,
        createdAt: str = "",
        password_hash: str | None = None,
    ):
        self.id = id
        self.email = email
        self.password_hash = password_hash or hash_password(password or "")
        self.role = role
        self.name = name
        self.institution = institution
        self.title = title
        self.avatar = avatar
        self.bio = bio
        self.skills = skills or []
        self.createdAt = createdAt

    def safe(self) -> dict:
        """Public representation — never includes the password hash."""
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "name": self.name,
            "institution": self.institution,
            "title": self.title,
            "avatar": self.avatar,
            "bio": self.bio,
            "skills": list(self.skills),
            "createdAt": self.createdAt,
        }


_SEED_HASH_CACHE: dict[str, str] = {}


def _seed_hash(password: str) -> str:
    """bcrypt is intentionally slow; reuse the hash when re-seeding demo accounts."""
    if password not in _SEED_HASH_CACHE:
        _SEED_HASH_CACHE[password] = hash_password(password)
    return _SEED_HASH_CACHE[password]


USER_SEED = [
    {
        "id": "usr-student-001",
        "email": "student@geova.ai",
        "password": "student123",
        "role": "student",
        "name": "Alex Mwansa",
        "title": "Full-Stack Engineer",
        "institution": "Stanford University",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        "bio": "Building distributed systems and open-source tools.",
        "skills": ["TypeScript", "React", "Node.js", "Python", "System Design"],
    },
    {
        "id": "usr-employer-001",
        "email": "recruiter@geova.ai",
        "password": "company123",
        "role": "employer",
        "name": "Sophia Chen",
        "title": "Senior Technical Recruiter",
        "institution": "Nebula AI",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        "bio": "Sourcing elite engineering talent for hyper-growth AI startups.",
    },
    {
        "id": "usr-provider-001",
        "email": "faculty@geova.ai",
        "password": "school123",
        "role": "provider",
        "name": "Prof. Damilola Adeyemi",
        "title": "Associate Professor of CS",
        "institution": "MIT EECS Department",
        "avatar": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400",
        "bio": "Teaching software engineering & distributed systems since 2012.",
    },
    {
        "id": "usr-admin-001",
        "email": "admin@geova.ai",
        "password": "admin123",
        "role": "admin",
        "name": "Platform Admin",
        "title": "Administrator",
        "institution": "GEOVA",
        "avatar": "https://ui-avatars.com/api/?name=Admin&background=random&size=200",
        "bio": "Oversees users and opportunities on the GEOVA platform.",
    },
]


class UserStore:
    def __init__(self) -> None:
        self._users: dict[str, UserRecord] = {}
        self.reset()

    def reset(self) -> None:
        self._users.clear()
        self._seed()

    def _seed(self) -> None:
        import datetime as _dt

        now = lambda: _dt.datetime.now(_dt.timezone.utc).isoformat()  # noqa: E731
        for s in USER_SEED:
            rec = UserRecord(
                **{k: v for k, v in s.items() if k != "password"},
                password_hash=_seed_hash(s["password"]),
                createdAt=now(),
            )
            self._users[rec.email] = rec

    def get(self, email: str) -> UserRecord | None:
        return self._users.get(email.lower().strip())

    def has(self, email: str) -> bool:
        return email.lower().strip() in self._users

    def list_all(self) -> list[UserRecord]:
        return list(self._users.values())

    def get_by_id(self, user_id: str) -> UserRecord | None:
        for user in self._users.values():
            if user.id == user_id:
                return user
        return None

    def delete(self, email: str) -> bool:
        return self._users.pop(email.lower().strip(), None) is not None

    def upsert(self, user: UserRecord) -> UserRecord:
        self._users[user.email] = user
        return user

    def create(
        self,
        email: str,
        password: str,
        role: str,
        name: str,
        institution: str | None = None,
        title: str | None = None,
    ) -> UserRecord:
        import datetime as _dt

        rec = UserRecord(
            id=f"usr-{role}-{int(_dt.datetime.now(_dt.timezone.utc).timestamp())}",
            email=email.strip().lower(),
            password=password,
            role=role,
            name=name.strip(),
            institution=institution,
            title=title,
            avatar=f"https://ui-avatars.com/api/?name={name.strip() or 'User'}&background=random&size=200",
            createdAt=_dt.datetime.now(_dt.timezone.utc).isoformat(),
        )
        return self.upsert(rec)


if settings.persistence == "db":
    from app.db_stores import DbUserStore

    user_store = DbUserStore(USER_SEED)
else:
    user_store = UserStore()
