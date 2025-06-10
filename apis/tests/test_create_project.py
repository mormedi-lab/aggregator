import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import app
from app.config import get_neo4j_session
from httpx import ASGITransport
from tests.MockSession import MockSession

@pytest.mark.asyncio
async def test_create_project():
    # 1. Use your custom MockSession (no return value needed for project creation)
    async def override_get_session():
        yield MockSession()  # Can optionally pass a return_value, but not needed here

    app.dependency_overrides[get_neo4j_session] = override_get_session

    # 2. Prepare payload
    payload = {
        "title": "Test Project",
        "industry": "Mobility",
        "objective": "Understand AI impact"
    }

    # 3. Make request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/projects", json=payload)

    app.dependency_overrides.clear()

    # 4. Validate response
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "id" in data and isinstance(data["id"], str)
