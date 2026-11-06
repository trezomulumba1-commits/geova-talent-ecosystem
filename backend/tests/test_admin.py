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


async def _admin(client: AsyncClient) -> dict:
    return _auth(await _token(client, "admin@geova.ai", "admin123", "admin"))


async def test_admin_endpoints_require_admin():
    async with await _client() as client:
        anon = await client.get("/api/admin/users")
        student = await _token(client, "student@geova.ai", "student123", "student")
        forbidden = await client.get("/api/admin/users", headers=_auth(student))
    assert anon.status_code == 401
    assert forbidden.status_code == 403


async def test_list_and_filter_users():
    async with await _client() as client:
        headers = await _admin(client)
        all_users = await client.get("/api/admin/users", headers=headers)
        employers = await client.get(
            "/api/admin/users", params={"role": "employer"}, headers=headers
        )
        query = await client.get(
            "/api/admin/users", params={"q": "alex"}, headers=headers
        )
        detail = await client.get("/api/admin/users/usr-student-001", headers=headers)
    assert all_users.json()["total"] == 4
    assert [u["email"] for u in employers.json()["items"]] == ["recruiter@geova.ai"]
    assert [u["email"] for u in query.json()["items"]] == ["student@geova.ai"]
    assert detail.json()["profileId"] == "alex-mwansa"


async def test_admin_updates_verification_and_role():
    async with await _client() as client:
        headers = await _admin(client)
        verified = await client.patch(
            "/api/admin/users/usr-student-001",
            json={"verified": False},
            headers=headers,
        )
        profile = await client.get("/api/users/alex-mwansa")

        registered = await client.post(
            "/api/auth/register",
            json={
                "email": "promote@student.com",
                "password": "secret1",
                "name": "Promote Me",
                "portal": "student",
            },
        )
        user_id = registered.json()["user"]["id"]
        promoted = await client.patch(
            f"/api/admin/users/{user_id}", json={"role": "provider"}, headers=headers
        )

        login = await client.post(
            "/api/auth/login",
            json={
                "email": "promote@student.com",
                "password": "secret1",
                "portal": "provider",
            },
        )

    assert verified.status_code == 200
    assert verified.json()["verified"] is False
    assert profile.json()["verified"] is False
    assert promoted.json()["role"] == "provider"
    assert login.status_code == 200
    assert login.json()["user"]["role"] == "provider"


async def test_admin_cannot_demote_or_delete_self():
    async with await _client() as client:
        headers = await _admin(client)
        demote = await client.patch(
            "/api/admin/users/usr-admin-001", json={"role": "student"}, headers=headers
        )
        destroy = await client.delete("/api/admin/users/usr-admin-001", headers=headers)
    assert demote.status_code == 400
    assert destroy.status_code == 400


async def test_admin_deletes_user():
    async with await _client() as client:
        headers = await _admin(client)
        registered = await client.post(
            "/api/auth/register",
            json={
                "email": "remove@student.com",
                "password": "secret1",
                "name": "Remove Me",
                "portal": "student",
            },
        )
        user_id = registered.json()["user"]["id"]
        deleted = await client.delete(f"/api/admin/users/{user_id}", headers=headers)
        login = await client.post(
            "/api/auth/login",
            json={
                "email": "remove@student.com",
                "password": "secret1",
                "portal": "student",
            },
        )
    assert deleted.status_code == 204
    assert login.status_code == 401


async def test_admin_lists_all_opportunities_and_moderates():
    async with await _client() as client:
        headers = await _admin(client)
        all_opps = await client.get(
            "/api/admin/opportunities", params={"status": "all"}, headers=headers
        )
        drafts = await client.get(
            "/api/admin/opportunities", params={"status": "draft"}, headers=headers
        )
        moderated = await client.post(
            "/api/admin/opportunities/ml-research-draft/moderate",
            json={"status": "published"},
            headers=headers,
        )
        public = await client.get("/api/opportunities")

    assert all_opps.json()["total"] == 5
    assert [o["id"] for o in drafts.json()["items"]] == ["ml-research-draft"]
    assert moderated.json()["status"] == "published"
    assert public.json()["total"] == 5


async def test_admin_analytics():
    async with await _client() as client:
        headers = await _admin(client)
        res = await client.get("/api/admin/analytics", headers=headers)
    body = res.json()
    assert res.status_code == 200
    assert body["totalUsers"] == 4
    assert body["totalStudents"] == 1
    assert body["totalEmployers"] == 1
    assert body["totalProviders"] == 1
    assert body["totalAdmins"] == 1
    assert body["totalCompanies"] == 3
    assert body["totalOpportunities"] == 5
    assert body["publishedOpportunities"] == 4
    assert body["draftOpportunities"] == 1
    assert body["totalCollabs"] == 3
    assert body["totalInterests"] == 3
    assert body["topSkills"]
    assert len(body["recentUsers"]) == 4
