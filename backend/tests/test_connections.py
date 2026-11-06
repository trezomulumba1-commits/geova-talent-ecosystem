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


async def test_send_connection_and_list_each_direction():
    async with await _client() as client:
        student = await _token(client, "student@geova.ai", "student123", "student")
        created = await client.post(
            "/api/connections",
            json={"recipientId": "nebula-ai", "message": "Loved your ML internship."},
            headers=_auth(student),
        )
        outgoing = await client.get(
            "/api/connections", params={"direction": "outgoing"}, headers=_auth(student)
        )

        employer = await _token(client, "recruiter@geova.ai", "company123", "employer")
        incoming = await client.get(
            "/api/connections",
            params={"direction": "incoming"},
            headers=_auth(employer),
        )

    body = created.json()
    assert created.status_code == 201
    assert body["requesterId"] == "alex-mwansa"
    assert body["requesterName"] == "Alex Mwansa"
    assert body["recipientId"] == "nebula-ai"
    assert body["recipientName"] == "Nebula Systems"
    assert body["status"] == "pending"
    assert body["message"] == "Loved your ML internship."

    assert outgoing.json()["total"] == 1
    assert outgoing.json()["items"][0]["id"] == body["id"]
    assert incoming.json()["total"] == 1
    assert incoming.json()["items"][0]["id"] == body["id"]


async def test_connection_validation():
    async with await _client() as client:
        student = await _token(client, "student@geova.ai", "student123", "student")
        headers = _auth(student)

        missing = await client.post(
            "/api/connections", json={"recipientId": "nobody"}, headers=headers
        )
        itself = await client.post(
            "/api/connections", json={"recipientId": "alex-mwansa"}, headers=headers
        )
        await client.post(
            "/api/connections", json={"recipientId": "nebula-ai"}, headers=headers
        )
        duplicate = await client.post(
            "/api/connections", json={"recipientId": "nebula-ai"}, headers=headers
        )
        anon = await client.get("/api/connections")

    assert missing.status_code == 404
    assert itself.status_code == 400
    assert duplicate.status_code == 409
    assert anon.status_code == 401


async def test_recipient_can_accept_and_requester_cannot():
    async with await _client() as client:
        student = await _token(client, "student@geova.ai", "student123", "student")
        created = await client.post(
            "/api/connections",
            json={"recipientId": "nebula-ai"},
            headers=_auth(student),
        )
        connection_id = created.json()["id"]

        requester_denied = await client.post(
            f"/api/connections/{connection_id}/respond",
            json={"status": "accepted"},
            headers=_auth(student),
        )

        employer = await _token(client, "recruiter@geova.ai", "company123", "employer")
        accepted = await client.post(
            f"/api/connections/{connection_id}/respond",
            json={"status": "accepted"},
            headers=_auth(employer),
        )
        again = await client.post(
            f"/api/connections/{connection_id}/respond",
            json={"status": "declined"},
            headers=_auth(employer),
        )

    assert requester_denied.status_code == 403
    assert accepted.status_code == 200
    assert accepted.json()["status"] == "accepted"
    assert again.status_code == 409


async def test_participants_can_delete_and_outsiders_cannot_view():
    async with await _client() as client:
        student = await _token(client, "student@geova.ai", "student123", "student")
        created = await client.post(
            "/api/connections",
            json={"recipientId": "nebula-ai"},
            headers=_auth(student),
        )
        connection_id = created.json()["id"]

        provider = await _token(client, "faculty@geova.ai", "school123", "provider")
        forbidden = await client.get(
            f"/api/connections/{connection_id}", headers=_auth(provider)
        )
        deleted = await client.delete(
            f"/api/connections/{connection_id}", headers=_auth(student)
        )
        gone = await client.get(
            f"/api/connections/{connection_id}", headers=_auth(student)
        )

    assert forbidden.status_code == 403
    assert deleted.status_code == 204
    assert gone.status_code == 404


async def test_connection_status_filter_and_pagination():
    async with await _client() as client:
        student = await _token(client, "student@geova.ai", "student123", "student")
        headers = _auth(student)
        for recipient in ("nebula-ai", "finflow", "healthsync"):
            await client.post(
                "/api/connections", json={"recipientId": recipient}, headers=headers
            )
        page1 = await client.get(
            "/api/connections",
            params={"direction": "outgoing", "page": 1, "page_size": 2},
            headers=headers,
        )
        page2 = await client.get(
            "/api/connections",
            params={"direction": "outgoing", "page": 2, "page_size": 2},
            headers=headers,
        )
        pending = await client.get(
            "/api/connections", params={"status": "pending"}, headers=headers
        )

    assert page1.json()["total"] == 3
    assert len(page1.json()["items"]) == 2
    assert len(page2.json()["items"]) == 1
    assert pending.json()["total"] == 3
