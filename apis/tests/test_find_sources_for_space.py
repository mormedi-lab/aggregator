import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from unittest.mock import AsyncMock, MagicMock, patch
from app.main import app
from app.config import get_neo4j_session 

@pytest.mark.asyncio
@patch("app.agents.find_sources_agent.Runner.run", new_callable=AsyncMock)
async def test_find_sources_returns_3_realistic_cards(mock_runner_run):
    # 1. Mock the LLM agent output
    mock_runner_run.return_value.final_output = """
    [
        {
            "headline": "15 Best Cars for Dogs in 2024",
            "publisher": "Lemonade Car Insurance",
            "summary": "Top vehicles for dog owners, like Jeep Wrangler and Toyota RAV4.",
            "date_published": "2024-01-15",
            "url": "https://www.lemonade.com/car/explained/best-cars-for-dogs/"
        },
        {
            "headline": "Best Cars & SUVs for Dogs",
            "publisher": "Carfax",
            "summary": "Spacious, dog-friendly cars like Subaru Forester.",
            "date_published": "2024-02-10",
            "url": "https://www.carfax.com/rankings/dog-car"
        },
        {
            "headline": "Paws and Engines: Best Cars for Dog Owners",
            "publisher": "All Auto Experts",
            "summary": "Highlights Subaru Outback and Honda Odyssey for pets.",
            "date_published": "2023-11-20",
            "url": "https://allautoexperts.com/paws-and-engines-the-best-cars-for-dog-owners-in-2023"
        }
    ]
    """

    # 2. Mock the Neo4j session
    mock_session = MagicMock()
    mock_session.read_transaction.return_value = {
        "id": "test-space-id",
        "query": "best cars for dogs",
        "search_type": "explore",
        "created_at": "2024-06-01T00:00:00Z"
    }
    mock_session.write_transaction.return_value = None

    # 3. Override the dependency to return the mocked session
    async def override_get_neo4j_session():
        return mock_session

    app.dependency_overrides[get_neo4j_session] = override_get_neo4j_session

    # 4. Run the test request using the FastAPI test client
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/space/test-space-id/find_sources")

    # 5. Assertions
    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert len(data["sources"]) == 3
    assert data["sources"][0]["publisher"] == "Lemonade Car Insurance"
    assert data["sources"][1]["publisher"] == "Carfax"

    # 6. Clean up overrides
    app.dependency_overrides.clear()
