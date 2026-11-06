from httpx import ASGITransport, AsyncClient

from app.main import app


async def _client() -> AsyncClient:
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def _token(client: AsyncClient, email: str, password: str, portal: str) -> str:
    res = await client.post(
        "/api/auth/login", json={"email": email, "password": password, "portal": portal}
    )
    return res.json()["token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


NEW_COLLAB = {
    "title": "Need a Flutter engineer for an education app",
    "phase": "Prototyping Phase",
    "description": "Offline-first lesson planner for low-connectivity schools.",
    "tags": ["Flutter", "Offline-First", "Education"],
}


async def test_list_seeded_collabs_newest_first():
    async with await _client() as client:
        res = await client.get("/api/collabs")
    body = res.json()
    assert res.status_code == 200
    assert body["total"] == 3
    assert [c["id"] for c in body["items"]] == ["collab-1", "collab-2", "collab-3"]
    assert body["items"][0]["interestedCount"] == 1


async def test_filter_collabs():
    async with await _client() as client:
        phase = await client.get("/api/collabs", params={"phase": "Ideation Phase"})
        tag = await client.get("/api/collabs", params={"tag": "pytorch"})
        query = await client.get("/api/collabs", params={"q": "fintech"})
        bad_phase = await client.get("/api/collabs", params={"phase": "Hiring"})
    assert [c["id"] for c in phase.json()["items"]] == ["collab-2"]
    assert [c["id"] for c in tag.json()["items"]] == ["collab-3"]
    assert [c["id"] for c in query.json()["items"]] == ["collab-2"]
    assert bad_phase.status_code == 400


async def test_create_collab_uses_author_profile():
    async with await _client() as client:
        token = await _token(client, "student@geova.ai", "student123", "student")
        res = await client.post("/api/collabs", json=NEW_COLLAB, headers=_auth(token))
        listing = await client.get("/api/collabs", params={"page_size": 50})
    body = res.json()
    assert res.status_code == 201
    assert body["authorId"] == "alex-mwansa"
    assert body["authorName"] == "Alex Mwansa"
    assert body["interestedCount"] == 0
    assert body["userInterested"] is False
    assert listing.json()["total"] == 4


async def test_create_collab_requires_auth_and_title():
    async with await _client() as client:
        anon = await client.post("/api/collabs", json=NEW_COLLAB)
        token = await _token(client, "student@geova.ai", "student123", "student")
        blank = await client.post(
            "/api/collabs", json={**NEW_COLLAB, "title": "  "}, headers=_auth(token)
        )
    assert anon.status_code == 401
    assert blank.status_code == 400


async def test_interest_toggle_is_per_profile():
    async with await _client() as client:
        employer = await _token(client, "recruiter@geova.ai", "company123", "employer")
        first = await client.post(
            "/api/collabs/collab-1/interest", headers=_auth(employer)
        )
        assert first.json()["interestedCount"] == 2
        assert first.json()["userInterested"] is True

        student = await _token(client, "student@geova.ai", "student123", "student")
        as_student = await client.get("/api/collabs/collab-1", headers=_auth(student))
        assert as_student.json()["interestedCount"] == 2
        assert as_student.json()["userInterested"] is False

        second = await client.post(
            "/api/collabs/collab-1/interest", headers=_auth(employer)
        )
        assert second.json()["interestedCount"] == 1
        assert second.json()["userInterested"] is False


async def test_interests_list():
    async with await _client() as client:
        token = await _token(client, "student@geova.ai", "student123", "student")
        res = await client.get("/api/collabs/collab-2/interests", headers=_auth(token))
    body = res.json()
    assert res.status_code == 200
    assert {i["profileId"] for i in body} == {"david-osei", "elena-rodriguez"}


async def test_only_author_can_update_or_delete():
    async with await _client() as client:
        student = await _token(client, "student@geova.ai", "student123", "student")
        headers = _auth(student)

        own = await client.patch(
            "/api/collabs/collab-1", json={"title": "Updated title"}, headers=headers
        )
        other = await client.patch(
            "/api/collabs/collab-2", json={"title": "Hijacked"}, headers=headers
        )
        deleted = await client.delete("/api/collabs/collab-1", headers=headers)
        gone = await client.get("/api/collabs/collab-1")

    assert own.status_code == 200
    assert own.json()["title"] == "Updated title"
    assert other.status_code == 403
    assert deleted.status_code == 204
    assert gone.status_code == 404
