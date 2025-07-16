import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.source import Source
from app.config import get_neo4j_session
from tests.MockSession import MockSession

@pytest.mark.asyncio
async def test_get_sources_from_space():
    # 1. Prepare Pydantic Source objects
    mock_sources = [
        Source(
            publisher="Test Publisher",
            headline="Test Headline",
            url="https://example.com/article",
            summary="A test summary",
            is_trusted=False
        )
    ]

    # 2. Custom MockSession that returns Pydantic objects
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value=mock_sources)

    # 3. Make the request (with required project_id)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/space/test-space-id/sources?project_id=test-project-id")

    app.dependency_overrides.clear()

    # 4. Assertions
    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert len(data["sources"]) == 1
    assert data["sources"][0]["headline"] == "Test Headline"
