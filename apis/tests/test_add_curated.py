import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
@patch("apis.app.config.neo4j_client")
def test_add_curated_source_success(mock_neo4j_client):
    # Step 1: Mock Neo4j driver + session
    mock_driver = MagicMock()
    mock_session = MagicMock()
    mock_driver.session.return_value.__enter__.return_value = mock_session
    mock_session.write_transaction.return_value = None
    mock_neo4j_client.return_value = mock_driver

    # Step 2: Import router lazily
    from apis.app.routes import source_routes
    app = FastAPI()
    app.include_router(source_routes.router)

    # Step 3: Payload
    payload = {
        "source": {
            "headline": "Why Dogs Love EVs",
            "publisher": "PetCar Weekly",
            "url": "https://example.com/pet-cars",
            "summary": "A deep dive into vehicle features that benefit pets."
        }
    }

    # Step 4: POST to endpoint
    client = TestClient(app)
    response = client.post("/project/test-abc/library/add-curated", json=payload)

    # Step 5: Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "source_id" in data
