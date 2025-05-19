import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

@patch("apis.app.config.neo4j_client")
@patch("apis.app.routes.source_routes._fetch_project_library")
def test_get_project_library_success(mock_fetch_fn, mock_neo4j_client):
    # Mock the return value of _fetch_project_library
    mock_sources = [
        {
            "id": "s1",
            "headline": "Dog-Friendly Cars 2024",
            "url": "https://example.com/dog-cars",
            "summary": "Top pet-friendly vehicles ranked.",
            "publisher": "AutoPet News",
            "is_curated": True
        },
        {
            "id": "s2",
            "headline": "Electric Vans for Pets",
            "url": "https://example.com/ev-pets",
            "summary": "Why EVs work well for animal travel.",
            "publisher": "EV Weekly",
            "is_curated": False
        }
    ]
    mock_fetch_fn.return_value = mock_sources

    # Mock Neo4j driver and session
    mock_driver = MagicMock()
    mock_driver.session.return_value.__enter__.return_value = MagicMock(
        read_transaction=lambda fn, pid: fn(None, pid)  # call patched _fetch_project_library
    )
    mock_neo4j_client.return_value = mock_driver

    # Import router and create FastAPI app
    from apis.app.routes import source_routes
    app = FastAPI()
    app.include_router(source_routes.router)

    # Call test client
    client = TestClient(app)
    response = client.get("/project/test-abc/library")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["headline"] == "Dog-Friendly Cars 2024"
    assert data[1]["id"] == "s2"
    assert data[1]["is_curated"] is False
