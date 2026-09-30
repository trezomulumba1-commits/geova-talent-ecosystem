from httpx import ASGITransport, AsyncClient

from app.main import app


async def _client() -> AsyncClient:
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def _token(client: AsyncClient, email: str, password: str, portal: str) -> str:
    res = await client.post("/api/auth/login", json={"email": email, "password": password, "portal": portal})
    return res.json()["token"]


async def test_list_students_defaults():
    async with await _client() as client:
        res = await client.get("/api/users/students")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] == 6
    assert len(body["items"]) == 6
    assert body["page"] == 1
    first = body["items"][0]
    assert {"id", "name", "title", "avatar", "verified", "available", "about", "skills"} <= set(first)


async def test_search_students_by_name():
    async with await _client() as client:
        res = await client.get("/api/users/students", params={"q": "david"})
    body = res.json()
    assert body["total"] == 2
    assert {i["id"] for i in body["items"]} == {"david-osei", "david-chen"}


async def test_search_students_by_skill():
    async with await _client() as client:
        res = await client.get("/api/users/students", params={"skills": "PyTorch,Tailwind CSS"})
    ids = {i["id"] for i in res.json()["items"]}
    assert ids == {"alex-mwansa", "david-osei"}


async def test_filter_students_available_and_verified():
    async with await _client() as client:
        avail = await client.get("/api/users/students", params={"available": "true", "verified": "true"})
    ids = {i["id"] for i in avail.json()["items"]}
    assert "sarah-jenkins" not in ids
    assert "alex-mwansa" in ids
    assert all(i["available"] and i["verified"] for i in avail.json()["items"])


async def test_students_pagination():
    async with await _client() as client:
        p1 = await client.get("/api/users/students", params={"page": 1, "page_size": 2})
        p2 = await client.get("/api/users/students", params={"page": 2, "page_size": 2})
    assert len(p1.json()["items"]) == 2
    assert p1.json()["total"] == 6
    assert p1.json()["items"][0]["id"] != p2.json()["items"][0]["id"]


async def test_list_employers_and_filters():
    async with await _client() as client:
        all_c = await client.get("/api/users/employers")
        fin = await client.get("/api/users/employers", params={"industry": "financial"})
        loc = await client.get("/api/users/employers", params={"location": "remote"})
    assert all_c.json()["total"] == 3
    assert [c["id"] for c in fin.json()["items"]] == ["finflow"]
    assert [c["id"] for c in loc.json()["items"]] == ["finflow"]


async def test_get_profile_by_id_student_and_company():
    async with await _client() as client:
        s = await client.get("/api/users/alex-mwansa")
        c = await client.get("/api/users/nebula-ai")
    assert s.status_code == 200
    assert s.json()["name"] == "Alex Mwansa"
    assert c.status_code == 200
    assert c.json()["name"] == "Nebula Systems"


async def test_get_profile_missing():
    async with await _client() as client:
        res = await client.get("/api/users/does-not-exist")
    assert res.status_code == 404
    assert res.json()["error"] == "Profile not found."


async def test_own_profile_requires_auth():
    async with await _client() as client:
        res = await client.get("/api/profiles/me")
    assert res.status_code == 401


async def test_own_profile_student():
    async with await _client() as client:
        token = await _token(client, "student@geova.ai", "student123", "student")
        res = await client.get("/api/profiles/me", headers={"Authorization": f"Bearer {token}"})
    body = res.json()
    assert res.status_code == 200
    assert body["id"] == "alex-mwansa"
    assert body["role"] == "student"
    assert body["email"] == "student@geova.ai"
    assert "React" in body["skills"]


async def test_own_profile_employer_includes_company():
    async with await _client() as client:
        token = await _token(client, "recruiter@geova.ai", "company123", "employer")
        res = await client.get("/api/profiles/me", headers={"Authorization": f"Bearer {token}"})
    body = res.json()
    assert body["role"] == "employer"
    assert body["company"] is not None
    assert body["company"]["id"] == "nebula-ai"


async def test_update_own_profile():
    async with await _client() as client:
        token = await _token(client, "student@geova.ai", "student123", "student")
        res = await client.patch(
            "/api/profiles/me",
            json={"title": "Staff Engineer", "skills": ["TypeScript", "Python"], "university": "MIT"},
            headers={"Authorization": f"Bearer {token}"},
        )
    body = res.json()
    assert res.status_code == 200
    assert body["title"] == "Staff Engineer"
    assert body["skills"] == ["TypeScript", "Python"]
    assert body["university"] == "MIT"