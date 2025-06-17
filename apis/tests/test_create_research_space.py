import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction

@pytest.mark.asyncio
async def test_create_research_space():
    # 1. Mock write_transaction to return a specific research space dict
    def mock_create_research_space(tx, project_id, space):
        return {
            "id": space.id,
            "query": space.query,
            "search_type": space.search_type,
            "created_at": space.created_at,
        }

    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(
        return_value=None  # not used for write, but required
    )
    MockSession.write_transaction = lambda self, func, *args, **kwargs: mock_create_research_space(MockTransaction(), *args, **kwargs)

    # 2. Payload
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
