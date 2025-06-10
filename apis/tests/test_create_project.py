import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession

@pytest.mark.asyncio
async def test_create_project():
    # 1. Inject MockSession 
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # 2. Prepare payload
    payload = {
        "title": "Test Project",
        "industry": "Mobility",
        "objective": "Understand AI impact"
    }

    # 3. Make request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/projects", json=payload)

    # 4. Validate response
    app.dependency_overrides.clear()
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "success"
    assert "id" in data and isinstance(data["id"], str)
