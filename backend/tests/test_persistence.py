from types import SimpleNamespace

import pytest

from app.db import init_db
from app.db_stores import (
    DbCollabStore,
    DbConnectionStore,
    DbOpportunityStore,
    DbProfileStore,
    DbUserStore,
)
from app.network import COLLAB_SEED
from app.opportunities import OPPORTUNITY_SEED
from app.profiles import COMPANY_SEED, STUDENT_SEED
from app.store import USER_SEED


@pytest.fixture()
def stores():
    init_db()
    s = SimpleNamespace(
        users=DbUserStore(USER_SEED),
        profiles=DbProfileStore(STUDENT_SEED, COMPANY_SEED),
        opportunities=DbOpportunityStore(OPPORTUNITY_SEED),
        connections=DbConnectionStore(),
        collabs=DbCollabStore(COLLAB_SEED),
    )
    s.users.reset()
    s.profiles.reset()
    s.opportunities.reset()
    s.connections.reset()
    s.collabs.reset()
    return s


def test_seed_counts(stores):
    assert len(stores.users.list_all()) == 4
    assert len(stores.profiles.search_students()) == 6
    assert len(stores.profiles.search_companies()) == 3
    assert len(stores.opportunities.search()) == 5
    assert len(stores.collabs.search()) == 3
    assert stores.collabs.get("collab-1")["interests"] == ["marcus-chen"]


def test_user_crud(stores):
    created = stores.users.create("db@student.com", "secret1", "student", "DB Student")
    assert stores.users.get("db@student.com").email == "db@student.com"
    assert stores.users.get_by_id(created.id).name == "DB Student"

    created.name = "Renamed Student"
    stores.users.upsert(created)
    assert stores.users.get_by_id(created.id).name == "Renamed Student"

    assert stores.users.delete("db@student.com") is True
    assert stores.users.get("db@student.com") is None


def test_profile_search_and_update_syncs_user(stores):
    assert "alex-mwansa" in {s["id"] for s in stores.profiles.search_students(q="Alex")}
    assert "nebula-ai" in {
        c["id"] for c in stores.profiles.search_companies(q="Nebula")
    }

    user = stores.users.get("student@geova.ai")
    kind, record = stores.profiles.ensure_own(user)
    assert kind == "student"
    assert record["id"] == "alex-mwansa"

    kind, updated = stores.profiles.update_own(
        user, {"title": "Staff Engineer", "skills": ["Go", "Rust"]}
    )
    assert updated["title"] == "Staff Engineer"
    assert updated["skills"] == ["Go", "Rust"]
    assert stores.users.get("student@geova.ai").title == "Staff Engineer"
    assert updated["userId"] == user.id


def test_opportunity_crud_and_ownership(stores):
    employer = stores.users.get("recruiter@geova.ai")
    assert len(stores.opportunities.for_owner(employer)) == 3

    created = stores.opportunities.create(
        employer,
        {
            "title": "Database Reliability Engineer",
            "type": "Full-time",
            "location": "Remote",
            "tags": ["PostgreSQL", "SRE"],
            "requirements": {
                "techStack": ["PostgreSQL"],
                "coreCompetencies": ["On-call"],
            },
            "processSteps": [],
            "benefits": [],
            "status": "draft",
        },
    )
    assert created["companyId"] == "nebula-ai"
    assert created["status"] == "draft"
    assert stores.opportunities.get(created["id"])["title"] == created["title"]

    updated = stores.opportunities.update(
        created, {"stipend": "$150k / year", "status": "published"}
    )
    assert updated["stipend"] == "$150k / year"
    assert updated["status"] == "published"

    stores.opportunities.set_status(created, "closed")
    assert stores.opportunities.get(created["id"])["status"] == "closed"

    stores.opportunities.delete(created["id"])
    assert stores.opportunities.get(created["id"]) is None


def test_connection_flow(stores):
    student = stores.users.get("student@geova.ai")
    employer = stores.users.get("recruiter@geova.ai")

    created = stores.connections.create(
        student, "nebula-ai", "Loved your ML internship."
    )
    assert created["requesterId"] == "alex-mwansa"
    assert created["recipientName"] == "Nebula Systems"
    assert created["status"] == "pending"
    assert len(stores.connections.list_for(student, direction="outgoing")) == 1
    assert len(stores.connections.list_for(employer, direction="incoming")) == 1

    responded = stores.connections.respond(created["id"], employer, "accepted")
    assert responded["status"] == "accepted"
    assert stores.connections.get(created["id"])["status"] == "accepted"

    stores.connections.delete(created["id"], student)
    assert stores.connections.get(created["id"]) is None


def test_collab_interest_round_trip(stores):
    employer = stores.users.get("recruiter@geova.ai")
    collab = stores.collabs.get("collab-1")
    assert collab["interests"] == ["marcus-chen"]

    assert stores.collabs.toggle_interest(collab, employer) is True
    assert set(stores.collabs.get("collab-1")["interests"]) == {
        "marcus-chen",
        "nebula-ai",
    }

    assert stores.collabs.toggle_interest(collab, employer) is False
    assert stores.collabs.get("collab-1")["interests"] == ["marcus-chen"]

    names = {i["profileId"] for i in stores.collabs.interests(collab)}
    assert names == {"marcus-chen"}
