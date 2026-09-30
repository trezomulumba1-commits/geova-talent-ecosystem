"""In-memory profile directory (Stage 4).

Seeded from the frontend's mockData so the discover screens stay populated.
Swapped for SQLAlchemy in Stage 2; routers only touch these methods.
"""

from app.profile_schemas import CompanyProfile, OwnProfile, ProfileLinks
from app.store import UserRecord, user_store

STUDENT_SEED = [
    {
        "id": "alex-mwansa",
        "name": "Alex Mwansa",
        "role": "Frontend Developer & UI Specialist",
        "title": "Frontend Developer & UI Specialist",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        "verified": True,
        "available": True,
        "statusText": "Available for opportunities",
        "about": "Passionate about crafting intuitive and accessible user interfaces. Bridging the gap between design and engineering to build products that look great and function seamlessly. Experienced in React, Vue, and modern CSS frameworks, with a strong focus on component-driven architecture.",
        "skills": ["React", "TypeScript", "Tailwind CSS", "Figma", "Vue.js", "UI/UX Design", "Web Accessibility"],
        "university": "Stanford University",
        "year": "Year 4",
        "projectsCount": 8,
        "projects": [
            {"id": "ecotrack", "title": "EcoTrack Dashboard", "description": "A comprehensive dashboard for tracking personal carbon footprints with real-time data visualization and gamified sustainability challenges.", "type": "Web App", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"},
            {"id": "mediconnect", "title": "MediConnect App", "description": "Accessible patient portal app focusing on clear typography and high contrast for elderly users navigating their healthcare records.", "type": "Mobile UI", "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"},
        ],
        "links": {"github": "https://github.com/alexmwansa", "linkedin": "https://linkedin.com/in/alexmwansa", "website": "https://alexmwansa.dev"},
        "userId": "usr-student-001",
    },
    {
        "id": "marcus-chen",
        "name": "Marcus Chen",
        "role": "Product Designer",
        "title": "Product Designer",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        "verified": True,
        "available": True,
        "statusText": "Available",
        "about": "Specializing in design systems, micro-interactions, and human-centered design for fintech and consumer mobile apps.",
        "skills": ["Figma", "UI/UX", "Prototyping", "Design Systems", "User Research"],
        "projectsCount": 8,
        "links": {"github": "https://github.com/marcusdesign", "linkedin": "https://linkedin.com/in/marcuschen", "website": "https://marcuschen.studio"},
    },
    {
        "id": "sarah-jenkins",
        "name": "Sarah Jenkins",
        "role": "Full-stack Eng",
        "title": "Full-stack Eng",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        "verified": True,
        "available": False,
        "statusText": "Busy",
        "about": "Building resilient backend APIs and reactive frontend applications. Passionate about PostgreSQL query tuning and microservices.",
        "skills": ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker", "GraphQL"],
        "projectsCount": 12,
        "links": {"github": "https://github.com/sarahjenkins", "linkedin": "https://linkedin.com/in/sarahjenkins-dev"},
    },
    {
        "id": "david-osei",
        "name": "David Osei",
        "role": "Data Scientist",
        "title": "Data Scientist",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
        "verified": True,
        "available": True,
        "statusText": "Available",
        "about": "Predictive modeling, deep learning architectures, and big data pipelines for NLP and computer vision.",
        "skills": ["Python", "Machine Learning", "SQL", "PyTorch", "Pandas", "Scikit-Learn"],
        "projectsCount": 5,
        "links": {"github": "https://github.com/davidosei", "linkedin": "https://linkedin.com/in/davidosei"},
    },
    {
        "id": "elena-rodriguez",
        "name": "Elena Rodriguez",
        "role": "Growth Marketer",
        "title": "Growth Marketer",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
        "verified": False,
        "available": True,
        "statusText": "Available",
        "about": "Data-informed user acquisition, SEO architecture, conversion rate optimization, and brand storytelling.",
        "skills": ["SEO", "Analytics", "Strategy", "Growth Marketing", "Copywriting"],
        "projectsCount": 10,
        "links": {"linkedin": "https://linkedin.com/in/elenarodriguez-growth"},
    },
    {
        "id": "david-chen",
        "name": "David Chen",
        "role": "Data Scientist",
        "title": "Data Scientist",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
        "verified": False,
        "available": True,
        "statusText": "Available",
        "about": "Machine learning specialist focusing on time-series analysis and distributed computational graphs.",
        "skills": ["Python", "R", "TensorFlow", "Spark", "SQL"],
        "projectsCount": 6,
    },
]

COMPANY_SEED = [
    {
        "id": "nebula-ai",
        "name": "Nebula Systems",
        "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        "industry": "Distributed Systems & ML",
        "location": "San Francisco, CA",
        "verified": True,
        "activeRolesCount": 3,
        "founded": "2018",
        "companySize": "50–200",
        "about": "Nebula Systems is a leading innovator in high-throughput distributed systems and machine learning infrastructure. We build high-resilience computing platforms for global enterprise clients.\n\nOur team of data scientists and systems engineers collaborate to build robust, scalable infrastructure that empowers enterprises to process streaming telemetry with microsecond latency.",
        "website": "https://nebulasystems.example.com",
        "ownerUserId": "usr-employer-001",
    },
    {
        "id": "finflow",
        "name": "FinFlow",
        "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80",
        "industry": "Financial Services",
        "location": "Remote",
        "verified": False,
        "activeRolesCount": 1,
        "founded": "2020",
        "companySize": "20–50",
        "about": "FinFlow delivers next-generation embedded banking tools, real-time treasury analytics, and modern payment APIs for fast-scaling startups.",
        "website": "https://finflow.example.com",
    },
    {
        "id": "healthsync",
        "name": "HealthSync",
        "logo": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&auto=format&fit=crop&q=80",
        "industry": "Healthtech",
        "location": "Boston, MA",
        "verified": True,
        "activeRolesCount": 5,
        "founded": "2019",
        "companySize": "100–500",
        "about": "HealthSync bridges patient telemetry, electronic health records, and predictive diagnostics into unified clinical intelligence dashboards.",
        "website": "https://healthsync.example.com",
    },
]


def paginate(items: list[dict], page: int, page_size: int) -> tuple[list[dict], int]:
    total = len(items)
    start = (page - 1) * page_size
    return items[start : start + page_size], total


class ProfileStore:
    def __init__(self) -> None:
        self._students: dict[str, dict] = {}
        self._companies: dict[str, dict] = {}
        self.reset()

    def reset(self) -> None:
        self._students.clear()
        self._companies.clear()
        self._students.update({s["id"]: dict(s) for s in STUDENT_SEED})
        self._companies.update({c["id"]: dict(c) for c in COMPANY_SEED})

    def search_students(
        self,
        q: str | None = None,
        skills: str | None = None,
        available: bool | None = None,
        verified: bool | None = None,
    ) -> list[dict]:
        items = list(self._students.values())
        if q:
            needle = q.lower()
            items = [
                s
                for s in items
                if needle in s["name"].lower()
                or needle in s["title"].lower()
                or needle in s.get("about", "").lower()
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
        items = list(self._companies.values())
        if q:
            needle = q.lower()
            items = [
                c
                for c in items
                if needle in c["name"].lower()
                or needle in c["industry"].lower()
                or needle in c.get("about", "").lower()
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
        return self._students.get(profile_id) or self._companies.get(profile_id)

    def get_for_user(self, user_id: str) -> tuple[str, dict] | None:
        for s in self._students.values():
            if s.get("userId") == user_id:
                return "student", s
        for c in self._companies.values():
            if c.get("ownerUserId") == user_id:
                return "company", c
        return None

    def ensure_own(self, user: UserRecord) -> tuple[str, dict]:
        found = self.get_for_user(user.id)
        if found:
            return found
        created = {
            "id": user.id,
            "name": user.name,
            "role": user.title or "Student",
            "title": user.title or "Student",
            "avatar": user.avatar or "",
            "verified": False,
            "available": True,
            "statusText": "Available",
            "about": user.bio or "",
            "skills": list(user.skills),
            "university": user.institution,
            "year": None,
            "projectsCount": 0,
            "projects": [],
            "links": None,
            "userId": user.id,
        }
        self._students[user.id] = created
        return "student", created

    def update_own(self, user: UserRecord, updates: dict) -> tuple[str, dict]:
        _, record = self.ensure_own(user)
        for key, value in updates.items():
            if value is None:
                continue
            if key == "links" and isinstance(value, dict):
                record["links"] = {**ProfileLinks().model_dump(), **value}
            else:
                record[key] = value
        if record["id"] in self._students:
            self._students[record["id"]] = record
        else:
            self._companies[record["id"]] = record

        if "name" in updates:
            user.name = str(updates["name"]).strip()
        if "title" in updates:
            user.title = str(updates["title"]).strip() or None
        if "institution" in updates:
            user.institution = str(updates["institution"]).strip() or None
        if "university" in updates:
            user.institution = str(updates["university"]).strip() or None
        if "avatar" in updates:
            user.avatar = str(updates["avatar"]).strip() or None
        if "about" in updates:
            user.bio = str(updates["about"]).strip()
        if "skills" in updates:
            user.skills = list(updates["skills"] or [])
        user_store.upsert(user)
        return "company" if record["id"] in self._companies else "student", record

    def own_profile(self, user: UserRecord) -> OwnProfile:
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
            about=record.get("about") if "about" in record else user.bio,
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


profile_store = ProfileStore()