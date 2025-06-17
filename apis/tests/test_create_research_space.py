import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction
from app.models.research_space import ResearchSpace

@pytest.mark.asyncio
async def test_create_research_space():
    # 1. Mock write_transaction to simulate DB insert
    def mock_create_research_space(tx, project_id, space):
        return {
            "id": space["id"],
            "query": space["query"],
            "search_type": space["search_type"],
            "created_at": space["created_at"],
            "space_title": space["space_title"]
        }

    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value=None)
    MockSession.write_transaction = lambda self, func, *args, **kwargs: mock_create_research_space(MockTransaction(), *args, **kwargs)

    # 2. Valid payload for CreateResearchSpaceRequest
    payload = {
        "search_type": "Internet sources only",
        "research_question": "How are retailers using digital twins?",
        "industries": ["Retail", "Technology"],
        "geographies": ["United States"],
        "timeframe": "Last 2 years",
        "insight_style": "Trends",
        "additional_notes": "Include both academic and industry sources"
    }

    # 3. Perform request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/project/test-project-id/spaces", json=payload)

    app.dependency_overrides.clear()

    # 4. Assert response structure
    assert response.status_code == 200
    data = response.json()
    assert data["query"] != ""  # query should be auto-generated
    assert data["space_title"] != ""  # new: space_title from agent
    assert data["search_type"] == "Internet sources only"
    assert "created_at" in data
    assert "id" in data
