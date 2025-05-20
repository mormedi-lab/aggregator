import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

@patch("apis.app.config.neo4j_client")
@patch("apis.app.routes.source_routes._fetch_sources_for_project")
def test_get_all_project_sources(mock_fetch_fn, mock_neo4j_client):
    # 1. Mock source return value
    mock_sources = [
        {
            "id": "s1",
            "headline": "The Future of Dog Vans",
            "url": "https://example.com/dogs-and-evs",
            "summary": "A full overview of dog-friendly electric vans.",
            "publisher": "Pet Mobility",
            "is_curated": True
        },
        {
            "id": "s2",
            "headline": "Subaru’s Pet Safety Push",
            "url": "https://example.com/safety",
            "summary": "Subaru adds new pet features to SUVs.",
            "publisher": "Auto Today",
            "is_curated": False
        }
    ]
    mock_fetch_fn.return_value = mock_sources

    # 2. Mock the DB session passthrough
    mock_driver = MagicMock()
    mock_driver.session.return_value.__enter__.return_value = MagicMock(
        read_transaction=lambda fn, pid: fn(None, pid)
    )
    mock_neo4j_client.return_value = mock_driver

    # 3. Set up app and include route
    from apis.app.routes import source_routes
    app = FastAPI()
    app.include_router(source_routes.router)

    # 4. Send GET request
    client = TestClient(app)
    response = client.get("/projects/p123/sources")

    # 5. Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["is_curated"] is True
    assert data[1]["publisher"] == "Auto Today"
