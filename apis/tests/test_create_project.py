import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.config import get_neo4j_session
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_create_project():
    # 1. Mock Neo4j session
    mock_session = MagicMock()
    mock_session.run.return_value = None  # No return needed for create

    async def override_get_session():
        yield mock_session

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