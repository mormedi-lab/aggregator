import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import MagicMock
from app.main import app
from app.models.source import Source, Sources
from app.config import get_neo4j_session

@pytest.mark.asyncio
async def test_get_sources_from_space():
    # 1. Mock Neo4j session and response
    mock_session = MagicMock()
    mock_session.read_transaction.return_value = [
        Source(
            publisher="Test Publisher",
            headline="Test Headline",
            url="https://example.com/article",
            summary="A test summary",
            is_curated=False
        )
    ]

    async def override_get_session():
        yield mock_session

    # 2. Inject the mock session
    app.dependency_overrides[get_neo4j_session] = override_get_session

    # 3. Make the test request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/space/test-space-id/sources")

    # 4. Cleanup + assertions
    app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert len(data["sources"]) == 1
    assert data["sources"][0]["headline"] == "Test Headline"
