"""In-memory opportunity store (Stage 5).

Seeded from the frontend's INITIAL_OPPORTUNITIES so discover stays populated.
Swapped for SQLAlchemy in Stage 2; routers only touch these methods.
"""

from datetime import datetime, timezone

from app.errors import ApiError
from app.profiles import profile_store
from app.store import UserRecord

OPPORTUNITY_SEED = [
    {
        "id": "ml-intern-nebula",
        "companyId": "nebula-ai",
        "companyName": "Nebula Systems",
        "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        "title": "Machine Learning Engineering Intern",
        "type": "Internship",
        "location": "Remote",
        "duration": "3–6 Months",
        "stipend": "$5k – $7k / month",
        "tags": ["Python", "PyTorch", "SQL", "Git", "TensorFlow"],
        "overview": 'As a Machine Learning Intern at Nebula Systems, you will be embedded directly into our core infrastructure team, working alongside senior engineers to develop high-throughput predictive models. We believe in "Visibility of Skill," meaning your contributions will be quantifiable and directly impact our production systems.\n\nA typical day involves data pipeline optimization, benchmark tuning, and collaborating with cross-functional teams to translate research into scalable features.',
        "requirements": {
            "techStack": ["Python", "PyTorch", "SQL", "Git", "TensorFlow"],
            "coreCompetencies": [
                "Strong analytical and problem-solving abilities",
                "Effective communication of complex technical concepts",
                "Self-directed learner with a bias for action",
            ],
        },
        "processSteps": [
            {"step": 1, "title": "Applied", "subtitle": "Submit portfolio"},
            {"step": 2, "title": "Technical", "subtitle": "Live coding & ML design"},
            {"step": 3, "title": "Culture Fit", "subtitle": "Meet the team"},
            {"step": 4, "title": "Offer", "subtitle": "Welcome aboard"},
        ],
        "benefits": [
            {"icon": "payments", "title": "Competitive Stipend", "description": "$5k – $7k / month"},
            {"icon": "supervisor_account", "title": "Direct Mentorship", "description": "1:1 with Senior ML Engineers"},
            {"icon": "schedule", "title": "Flexible Hours", "description": "Work when you are most productive"},
        ],
        "hiringManager": {
            "name": "Sarah Jenkins",
            "role": "Head of Engineering",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        },
        "status": "published",
        "applicantCount": 24,
        "postedAt": "2026-09-18T09:00:00+00:00",
        "ownerUserId": "usr-employer-001",
    },
    {
        "id": "data-science-grad-nebula",
        "companyId": "nebula-ai",
        "companyName": "Nebula Systems",
        "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        "title": "Data Science Graduate",
        "type": "Full-time",
        "location": "San Francisco",
        "duration": "Permanent",
        "stipend": "$110k – $130k / year",
        "tags": ["SQL", "R", "Statistics", "Python"],
        "overview": "Join our research team to build production recommendation engines and predictive churn modeling pipelines for enterprise partners.",
        "requirements": {
            "techStack": ["SQL", "R", "Python", "Statistical Modeling"],
            "coreCompetencies": ["Experimental design", "A/B testing methodology", "Clear data visualization"],
        },
        "processSteps": [
            {"step": 1, "title": "Applied", "subtitle": "Resume & code sample"},
            {"step": 2, "title": "Take Home", "subtitle": "Modeling case study"},
            {"step": 3, "title": "Panel Review", "subtitle": "Present findings to team"},
            {"step": 4, "title": "Offer", "subtitle": "Join full-time"},
        ],
        "benefits": [
            {"icon": "payments", "title": "Competitive Compensation", "description": "$110k - $130k + Equity"},
            {"icon": "health_and_safety", "title": "Comprehensive Health", "description": "Medical, Dental, Vision 100% covered"},
        ],
        "hiringManager": {
            "name": "Jordan Smith",
            "role": "VP of Data Science",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
        },
        "status": "published",
        "applicantCount": 11,
        "postedAt": "2026-09-11T09:00:00+00:00",
        "ownerUserId": "usr-employer-001",
    },
    {
        "id": "frontend-freelance-finflow",
        "companyId": "finflow",
        "companyName": "FinFlow",
        "companyLogo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80",
        "title": "Frontend Engineer (Contract)",
        "type": "Freelance",
        "location": "Remote",
        "duration": "3 Months",
        "stipend": "$60 – $80 / hour",
        "tags": ["React", "TypeScript", "Design Systems"],
        "overview": "Rebuild our embedded banking dashboard as a modular design system. You own component architecture, accessibility and performance budgets end to end.",
        "requirements": {
            "techStack": ["React", "TypeScript", "CSS Architecture"],
            "coreCompetencies": ["Accessible component design", "Frontend performance tuning"],
        },
        "processSteps": [
            {"step": 1, "title": "Applied", "subtitle": "Portfolio review"},
            {"step": 2, "title": "Pairing", "subtitle": "Live architecture session"},
            {"step": 3, "title": "Offer", "subtitle": "Scoped contract"},
        ],
        "benefits": [
            {"icon": "schedule", "title": "Flexible Hours", "description": "Async-first collaboration"},
        ],
        "hiringManager": {
            "name": "Priya Raman",
            "role": "Product Lead",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
        },
        "status": "published",
        "applicantCount": 7,
        "postedAt": "2026-09-05T09:00:00+00:00",
        "ownerUserId": "usr-employer-001",
    },
    {
        "id": "parttime-support-healthsync",
        "companyId": "healthsync",
        "companyName": "HealthSync",
        "companyLogo": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&auto=format&fit=crop&q=80",
        "title": "Community Support Associate",
        "type": "Part-time",
        "location": "Remote",
        "duration": "Part-time",
        "stipend": "$22 / hour",
        "tags": ["Community", "Writing", "Support"],
        "overview": "Help our clinical community succeed: answer practitioner questions, run weekly onboarding office hours and surface feedback to the product team.",
        "requirements": {
            "techStack": [],
            "coreCompetencies": ["Clear written communication", "Empathy and follow-through"],
        },
        "processSteps": [
            {"step": 1, "title": "Applied", "subtitle": "Short intro"},
            {"step": 2, "title": "Conversation", "subtitle": "Meet the community lead"},
            {"step": 3, "title": "Offer", "subtitle": "Onboarding week"},
        ],
        "benefits": [
            {"icon": "groups", "title": "Real Impact", "description": "Direct line to product team"},
        ],
        "hiringManager": {
            "name": "Elena Rodriguez",
            "role": "Community Lead",
            "avatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&auto=format&fit=crop&q=80",
        },
        "status": "published",
        "applicantCount": 15,
        "postedAt": "2026-08-27T09:00:00+00:00",
        "ownerUserId": "usr-employer-001",
    },
    {
        "id": "ml-research-draft",
        "companyId": "nebula-ai",
        "companyName": "Nebula Systems",
        "companyLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        "title": "Research Intern, Model Efficiency",
        "type": "Internship",
        "location": "Remote",
        "duration": "6 Months",
        "stipend": "$6k / month",
        "tags": ["PyTorch", "Quantization"],
        "overview": "Draft listing — quantization and distillation research on production inference stacks.",
        "requirements": {"techStack": ["PyTorch"], "coreCompetencies": ["Model benchmarking"]},
        "processSteps": [{"step": 1, "title": "Applied", "subtitle": "CV and GitHub"}],
        "benefits": [],
        "hiringManager": {
            "name": "Sarah Jenkins",
            "role": "Head of Engineering",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        },
        "status": "draft",
        "applicantCount": 0,
        "postedAt": "2026-09-28T09:00:00+00:00",
        "ownerUserId": "usr-employer-001",
    },
]


def _slugify(value: str) -> str:
    out = [c.lower() if c.isalnum() else "-" for c in value.strip()]
    slug = "".join(out)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


class OpportunityStore:
    def __init__(self) -> None:
        self._items: dict[str, dict] = {}
        self.reset()

    def reset(self) -> None:
        self._items = {o["id"]: dict(o) for o in OPPORTUNITY_SEED}

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
        found = list(self._items.values())
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
            found = [o for o in found if any(needle == t.lower() for t in o.get("tags") or [])]
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
        return self._items.get(opportunity_id)

    def for_owner(self, user: UserRecord) -> list[dict]:
        found = profile_store.get_for_user(user.id)
        if user.role == "admin":
            return self._sorted(list(self._items.values()))
        if not found or found[0] != "company":
            return []
        company_id = found[1]["id"]
        return self._sorted([o for o in self._items.values() if o.get("companyId") == company_id])

    def company_id_for(self, user: UserRecord, requested: str | None = None) -> str:
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

    def can_manage(self, user: UserRecord, record: dict) -> bool:
        if user.role == "admin":
            return True
        if record.get("ownerUserId") == user.id:
            return True
        found = profile_store.get_for_user(user.id)
        return bool(found and found[0] == "company" and found[1]["id"] == record.get("companyId"))

    def create(self, user: UserRecord, payload: dict) -> dict:
        company_id = self.company_id_for(user, payload.get("companyId"))
        company = profile_store.get(company_id) or {}
        base_id = _slugify(payload["title"])
        new_id, suffix = base_id, 2
        while new_id in self._items:
            new_id = f"{base_id}-{suffix}"
            suffix += 1
        record = {
            **payload,
            "id": new_id,
            "companyId": company_id,
            "companyName": company.get("name", ""),
            "companyLogo": company.get("logo", ""),
            "applicantCount": 0,
            "postedAt": datetime.now(timezone.utc).isoformat(),
            "ownerUserId": user.id,
        }
        self._items[new_id] = record
        return record

    def update(self, record: dict, updates: dict) -> dict:
        for key, value in updates.items():
            if value is not None:
                record[key] = value
        self._items[record["id"]] = record
        return record

    def set_status(self, record: dict, status: str) -> dict:
        record["status"] = status
        self._items[record["id"]] = record
        return record

    def delete(self, opportunity_id: str) -> None:
        self._items.pop(opportunity_id, None)


opportunity_store = OpportunityStore()
