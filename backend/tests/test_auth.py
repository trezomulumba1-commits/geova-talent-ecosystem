from httpx import ASGITransport, AsyncClient

from app.main import app


async def _client() -> AsyncClient:
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def test_login_student_ok():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/login",
            json={"email": "student@geova.ai", "password": "student123", "portal": "student"},
        )
    assert res.status_code == 200
    body = res.json()
    assert body["token"]
    assert body["user"]["email"] == "student@geova.ai"
    assert body["user"]["role"] == "student"
    assert "passwordHash" not in body["user"]


async def test_login_wrong_password():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/login",
            json={"email": "student@geova.ai", "password": "wrong", "portal": "student"},
        )
    assert res.status_code == 401
    assert res.json()["error"] == "Incorrect password."


async def test_login_missing_fields():
    async with await _client() as client:
        res = await client.post("/api/auth/login", json={"email": "x@y.z"})
    assert res.status_code == 400
    assert "required" in res.json()["error"]


async def test_login_role_mismatch():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/login",
            json={"email": "recruiter@geova.ai", "password": "company123", "portal": "student"},
        )
    assert res.status_code == 403
    assert "employer" in res.json()["error"]


async def test_login_provider_portal():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/login",
            json={"email": "faculty@geova.ai", "password": "school123", "portal": "provider"},
        )
    assert res.status_code == 200
    assert res.json()["user"]["role"] == "provider"


async def test_admin_login():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/login",
            json={"email": "admin@geova.ai", "password": "admin123", "portal": "admin"},
        )
    assert res.status_code == 200
    assert res.json()["user"]["role"] == "admin"


async def test_register_and_me():
    async with await _client() as client:
        reg = await client.post(
            "/api/auth/register",
            json={
                "email": "new@student.com",
                "password": "secret1",
                "name": "New Student",
                "portal": "student",
                "institution": "Test University",
            },
        )
        assert reg.status_code == 201
        token = reg.json()["token"]

        me = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me.status_code == 200
        assert me.json()["email"] == "new@student.com"


async def test_register_duplicate_email():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/register",
            json={"email": "student@geova.ai", "password": "secret1", "name": "Dup", "portal": "student"},
        )
    assert res.status_code == 409


async def test_register_short_password():
    async with await _client() as client:
        res = await client.post(
            "/api/auth/register",
            json={"email": "a@b.com", "password": "123", "name": "A", "portal": "student"},
        )
    assert res.status_code == 400
    assert "at least 6 characters" in res.json()["error"]


async def test_me_requires_token():
    async with await _client() as client:
        res = await client.get("/api/auth/me")
    assert res.status_code == 401
    assert res.json()["error"] == "Unauthorized. Login required."


async def test_profile_update():
    async with await _client() as client:
        login = await client.post(
            "/api/auth/login",
            json={"email": "student@geova.ai", "password": "student123", "portal": "student"},
        )
        token = login.json()["token"]
        res = await client.patch(
            "/api/auth/profile",
            json={"title": "Senior Engineer", "skills": ["React", "Go"]},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 200
    body = res.json()
    assert body["title"] == "Senior Engineer"
    assert body["skills"] == ["React", "Go"]


async def test_logout():
    async with await _client() as client:
        res = await client.post("/api/auth/logout")
    assert res.status_code == 200
    assert res.json()["message"] == "Logged out successfully."


async def test_gemini_fallback_endpoints():
    async with await _client() as client:
        review = await client.post("/api/gemini/code-review", json={"code": "const x=1", "language": "js", "questionTitle": "t"})
        evaluate = await client.post("/api/gemini/evaluate-interview", json={"question": "q", "transcript": "a"})
        summary = await client.post("/api/gemini/generate-candidate-summary", json={"studentName": "Alex"})
    assert review.status_code == 200
    assert "valid" in review.json()
    assert evaluate.status_code == 200
    assert "overallScore" in evaluate.json()
    assert summary.status_code == 200
    assert "executiveSummary" in summary.json()