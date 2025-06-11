import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession

@pytest.mark.asyncio
async def test_get_industry_tag_from_project():
    # 1. Mock return value from Neo4j session
    mock_record = {
        "id": "proj-001",
        "title": "Collins Aerospace",
        "industry": "Mobility, Retail, Banking",
        "objective": "Explore aerospace strategies",
        "last_accessed": "2025-06-11"
    }

    class MockResult:
        def single(self):
            return mock_record

    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value=MockResult())

    # 2. Call the GET /project?id=proj-001 endpoint
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/project", params={"id": "proj-001"})

    # 3. Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Collins Aerospace"
    assert data["industry"] == "Mobility, Retail, Banking"
    assert "objective" in data

    app.dependency_overrides.clear()
