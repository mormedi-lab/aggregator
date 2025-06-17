import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction

@pytest.mark.asyncio
@patch("app.agents.generate_space_title_agent.Runner.run", new_callable=AsyncMock)
async def test_create_research_space(mock_runner_run):
    # 1. Mock the LLM agent to return a .final_output string
    mock_runner_run.return_value.final_output = "Mocked Title from Runner"

    # 2. Mock Neo4j session logic using dict access
    def mock_create_research_space(tx, project_id, space):
        return {
            "id": "mocked-id-123",
            "query": space["research_question"],
            "search_type": space["search_type"],
            "created_at": space["created_at"],
            "space_title": space["space_title"],
        }

    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value=None)
    MockSession.write_transaction = lambda self, func, *args, **kwargs: mock_create_research_space(MockTransaction(), *args, **kwargs)

    # 3. Payload
    payload = {
        "search_type": "Internet sources only",
        "research_question": "How are retailers using digital twins?",
        "industries": ["Retail", "Technology"],
        "geographies": ["United States"],
        "timeframe": "Last 2 years",
        "insight_style": "Trends",
        "additional_notes": "Include both academic and industry sources"
    }

    # 4. Run request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/project/test-project-id/spaces", json=payload)

    # 5. Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["research_question"] == payload["research_question"]
    assert data["search_type"] == payload["search_type"]
    assert data["space_title"] == "Mocked Title from Runner"
    assert "created_at" in data
    assert "id" in data

    # 6. Cleanup
    app.dependency_overrides.clear()
