from httpx import ASGITransport, AsyncClient

from app.main import app


async def _client() -> AsyncClient:
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def _token(client: AsyncClient, email: str, password: str, portal: str) -> str:
    res = await client.post("/api/auth/login", json={"email": email, "password": password, "portal": portal})
    return res.json()["token"]


async def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


NEW_OPPORTUNITY = {
    "title": "Backend Engineer (Payments)",
    "type": "Full-time",
    "location": "Remote",
    "duration": "Permanent",
    "stipend": "$120k – $150k / year",
    "tags": ["Python", "PostgreSQL", "FastAPI"],
    "overview": "Own the payments service: ledger, reconciliation and payout webhooks.",
    "requirements": {
        "techStack": ["Python", "PostgreSQL", "FastAPI"],
        "coreCompetencies": ["Idempotent API design", "Financial reconciliation"],
    },
    "processSteps": [
        {"step": 1, "title": "Applied", "subtitle": "Resume review"},
        {"step": 2, "title": "Technical", "subtitle": "Systems design"},
    ],
    "benefits": [{"icon": "payments", "title": "Equity", "description": "Meaningful early equity"}],
    "hiringManager": {"name": "Sarah Jenkins", "role": "Head of Engineering", "avatar": ""},
}


async def test_list_opportunities_hides_drafts():
    async with await _client() as client:
        res = await client.get("/api/opportunities")
    body = res.json()
    assert res.status_code == 200
    assert body["total"] == 4
    assert "ml-research-draft" not in {o["id"] for o in body["items"]}


async def test_list_opportunities_sorted_newest_first():
    async with await _client() as client:
        res = await client.get("/api/opportunities")
    ids = [o["id"] for o in res.json()["items"]]
    assert ids[0] == "ml-intern-nebula"
    assert ids[-1] == "parttime-support-healthsync"


async def test_filter_opportunities_by_type_and_company():
    async with await _client() as client:
        intern = await client.get("/api/opportunities", params={"type": "Internship"})
        nebula = await client.get("/api/opportunities", params={"companyId": "nebula-ai"})
        remote = await client.get("/api/opportunities", params={"location": "remote"})
    assert [o["id"] for o in intern.json()["items"]] == ["ml-intern-nebula"]
    assert nebula.json()["total"] == 2
    assert {o["id"] for o in remote.json()["items"]} == {
        "ml-intern-nebula",
        "frontend-freelance-finflow",
        "parttime-support-healthsync",
    }


async def test_filter_opportunities_by_query_and_tag():
    async with await _client() as client:
        q = await client.get("/api/opportunities", params={"q": "churn"})
        tag = await client.get("/api/opportunities", params={"tag": "pytorch"})
    assert [o["id"] for o in q.json()["items"]] == ["data-science-grad-nebula"]
    assert [o["id"] for o in tag.json()["items"]] == ["ml-intern-nebula"]


async def test_opportunity_filters_validate_enum_values():
    async with await _client() as client:
        bad_type = await client.get("/api/opportunities", params={"type": "Apprenticeship"})
        bad_status = await client.get("/api/opportunities", params={"status": "deleted"})
    assert bad_type.status_code == 400
    assert bad_status.status_code == 400


async def test_get_opportunity_detail():
    async with await _client() as client:
        res = await client.get("/api/opportunities/ml-intern-nebula")
    body = res.json()
    assert res.status_code == 200
    assert body["title"] == "Machine Learning Engineering Intern"
    assert body["requirements"]["techStack"][0] == "Python"
    assert body["hiringManager"]["name"] == "Sarah Jenkins"
    assert body["processSteps"][0]["title"] == "Applied"


async def test_draft_hidden_from_public_but_visible_to_owner():
    async with await _client() as client:
        public = await client.get("/api/opportunities/ml-research-draft")
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        owner = await client.get("/api/opportunities/ml-research-draft", headers=await _auth(token))
    assert public.status_code == 404
    assert owner.status_code == 200
    assert owner.json()["status"] == "draft"


async def test_mine_requires_employer_role():
    async with await _client() as client:
        anon = await client.get("/api/opportunities/mine")
        student_token = await _token(client, "student@geova.ai", "student123", "student")
        student = await client.get("/api/opportunities/mine", headers=await _auth(student_token))
    assert anon.status_code == 401
    assert student.status_code == 403


async def test_mine_lists_employer_company_listings():
    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        res = await client.get("/api/opportunities/mine", headers=await _auth(token))
    body = res.json()
    assert res.status_code == 200
    assert body["total"] == 3
    assert {o["companyId"] for o in body["items"]} == {"nebula-ai"}

    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        drafts = await client.get("/api/opportunities/mine", params={"status": "draft"}, headers=await _auth(token))
    assert [o["id"] for o in drafts.json()["items"]] == ["ml-research-draft"]


async def test_create_opportunity_fills_company_from_account():
    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        res = await client.post("/api/opportunities", json=NEW_OPPORTUNITY, headers=await _auth(token))
    body = res.json()
    assert res.status_code == 201
    assert body["companyId"] == "nebula-ai"
    assert body["companyName"] == "Nebula Systems"
    assert body["title"] == "Backend Engineer (Payments)"
    assert body["applicantCount"] == 0
    assert body["status"] == "published"
    assert body["postedAt"]


async def test_create_opportunity_as_student_forbidden():
    async with await _client() as client:
        token = await _token(client, "student@geova.ai", "student123", "student")
        res = await client.post("/api/opportunities", json=NEW_OPPORTUNITY, headers=await _auth(token))
    assert res.status_code == 403


async def test_create_opportunity_requires_title():
    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        res = await client.post("/api/opportunities", json={**NEW_OPPORTUNITY, "title": "  "}, headers=await _auth(token))
    assert res.status_code == 400


async def test_update_and_publish_and_close_flow():
    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        headers = await _auth(token)

        created = await client.post(
            "/api/opportunities",
            json={**NEW_OPPORTUNITY, "title": "Platform Engineer", "status": "draft"},
            headers=headers,
        )
        opportunity_id = created.json()["id"]
        assert created.json()["status"] == "draft"

        hidden = await client.get(f"/api/opportunities/{opportunity_id}")
        assert hidden.status_code == 404

        published = await client.post(f"/api/opportunities/{opportunity_id}/status", json={"status": "published"}, headers=headers)
        assert published.json()["status"] == "published"
        assert (await client.get(f"/api/opportunities/{opportunity_id}")).status_code == 200

        updated = await client.patch(
            f"/api/opportunities/{opportunity_id}",
            json={"stipend": "$130k / year", "tags": ["Python", "AWS"]},
            headers=headers,
        )
        assert updated.json()["stipend"] == "$130k / year"
        assert updated.json()["tags"] == ["Python", "AWS"]

        closed = await client.post(f"/api/opportunities/{opportunity_id}/status", json={"status": "closed"}, headers=headers)
        assert closed.json()["status"] == "closed"
        public = await client.get("/api/opportunities")
        assert opportunity_id not in {o["id"] for o in public.json()["items"]}


async def test_update_other_company_listing_forbidden():
    async with await _client() as client:
        admin_token = await _token(client, "admin@geova.ai", "admin123", "admin")
        created = await client.post(
            "/api/opportunities",
            json={**NEW_OPPORTUNITY, "title": "HealthSync Listing", "companyId": "healthsync"},
            headers=await _auth(admin_token),
        )
        opportunity_id = created.json()["id"]

        recruiter_token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        denied = await client.patch(
            f"/api/opportunities/{opportunity_id}",
            json={"stipend": "hacked"},
            headers=await _auth(recruiter_token),
        )
    assert denied.status_code == 403


async def test_delete_opportunity():
    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        headers = await _auth(token)
        created = await client.post("/api/opportunities", json=NEW_OPPORTUNITY, headers=headers)
        opportunity_id = created.json()["id"]

        deleted = await client.delete(f"/api/opportunities/{opportunity_id}", headers=headers)
        gone = await client.get(f"/api/opportunities/{opportunity_id}")
        again = await client.delete(f"/api/opportunities/{opportunity_id}", headers=headers)
    assert deleted.status_code == 204
    assert gone.status_code == 404
    assert again.status_code == 404


async def test_opportunity_pagination():
    async with await _client() as client:
        p1 = await client.get("/api/opportunities", params={"page": 1, "page_size": 3})
        p2 = await client.get("/api/opportunities", params={"page": 2, "page_size": 3})
    assert len(p1.json()["items"]) == 3
    assert p1.json()["total"] == 4
    assert len(p2.json()["items"]) == 1
