import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from app.main import app
from app.config import get_neo4j_session
from unittest.mock import MagicMock
from datetime import datetime

@pytest.mark.asyncio
async def test_create_research_space():
    # 1. Mock Neo4j session
    mock_session = MagicMock()
    mock_session.write_transaction.return_value = {
        "id": "new-space-id",
        "query": "AI in mobility",
        "search_type": "explore",
        "created_at": "2025-06-04T00:00:00Z"
    }

    async def override_get_session():
        yield mock_session

    app.dependency_overrides[get_neo4j_session] = override_get_session

    # 2. Request payload (without project_id)
    payload = {
        "query": "AI in mobility",
        "search_type": "explore"
    }

    # 3. Execute request to correct route
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/project/test-project-id/spaces", json=payload)

    app.dependency_overrides.clear()

    # 4. Assert response
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "AI in mobility"
    assert data["search_type"] == "explore"
    assert "created_at" in data
    assert "id" in data
