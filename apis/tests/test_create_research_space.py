import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction

@pytest.mark.asyncio
@patch("app.agents.prompt_generator_agent.Runner.run", new_callable=AsyncMock)
@patch("app.agents.generate_space_title_agent.Runner.run", new_callable=AsyncMock)
async def test_create_research_space(mock_prompt_runner, mock_title_runner):
    # 1. Mock the space title agent
    mock_title_runner.return_value.final_output = "Mocked Title from Runner"

    # 2. Mock the prompt generation agent
    mock_prompt_runner.return_value.final_output = "Mocked prompt from Runner"

    # 3. Define specific mock write transactions
    def write_tx_router(func, *args, **kwargs):
        if func.__name__ == "create_research_space_node":
            return args[1]
        elif func.__name__ == "update_prompt_for_space":
            return None  # No-op for test
        else:
            raise Exception(f"Unexpected write_transaction call to {func.__name__}")

    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value=None)
    MockSession.write_transaction = lambda self, func, *args, **kwargs: write_tx_router(func, *args, **kwargs)

    # 4. Payload
    payload = {
        "search_type": "Internet sources only",
        "research_question": "How are retailers using digital twins?",
        "industries": ["Retail", "Technology"],
        "geographies": ["United States"],
        "timeframe": "Last 2 years",
        "insight_style": "Trends",
        "additional_notes": "Include both academic and industry sources"
    }

    # 5. Run request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/project/test-project-id/spaces", json=payload)

    # 6. Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["research_question"] == payload["research_question"]
    assert data["search_type"] == payload["search_type"]
    assert data["space_title"] == "Mocked Title from Runner"
    assert "created_at" in data
    assert "id" in data

    # 7. Cleanup
    app.dependency_overrides.clear()
