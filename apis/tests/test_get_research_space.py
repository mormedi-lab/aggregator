import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession

@pytest.mark.asyncio
async def test_get_research_spaces():
    # 1. Mock return value for read_transaction
    mock_spaces = [
        {
            "id": "space-1",
            "query": "AI in education",
            "search_type": "explore",
            "created_at": "2025-06-04T00:00:00Z"
        },
        {
            "id": "space-2",
            "query": "Urban mobility",
            "search_type": "monitor",
            "created_at": "2025-06-03T00:00:00Z"
        }
    ]

    class CustomSession(MockSession):
        def read_transaction(self, func, *args, **kwargs):
            return mock_spaces

    async def override_get_session():
        yield CustomSession()

    app.dependency_overrides[get_neo4j_session] = override_get_session

    # 2. Make request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/project/test-project-id/spaces")

    app.dependency_overrides.clear()

    # 3. Assertions
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["id"] == "space-1"
    assert data[1]["query"] == "Urban mobility"
