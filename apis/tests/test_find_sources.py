import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch, MagicMock
from app.main import app

@pytest.mark.skip("I don't know how to mock it yet")
@pytest.mark.asyncio
@patch("app.agents.find_sources_agent.FindSourcesAgent.run", new_callable=AsyncMock)
# @patch("apis.app.config.neo4j_client")
async def test_find_sources_returns_3_realistic_cards(mock_agent_run):
# async def test_find_sources_returns_3_realistic_cards(mock_neo4j_client, mock_agent_run):
    # 1. Mock the real LLM agent output (trimmed for brevity)
    mock_agent_run.return_value = {
        "sources": [
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
            },
        ]
    }

    # 2. Mock Neo4j write transaction
    mock_driver = MagicMock()
    mock_session = MagicMock()
    mock_tx = MagicMock()

    mock_driver.session.return_value.__enter__.return_value = mock_session
    mock_session.write_transaction.return_value = None
    mock_neo4j_client.return_value = mock_driver

    # 3. Run the FastAPI request
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/find_sources", json={
            "project_id": "test-id-123",
            "search_prompt": "best pet friendly cars"
        })

    # 4. Assertions
    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert len(data["sources"]) == 3  # Or 10 if you include all
    assert data["sources"][0]["headline"] == "15 Best Cars for Dogs in 2024"
    assert data["sources"][1]["publisher"] == "Carfax"
