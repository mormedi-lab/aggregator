import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

@patch("apis.app.config.neo4j_client")
@patch("apis.app.routes.source_routes._link_source_to_library")
def test_add_source_to_library(mock_link_fn, mock_neo4j_client):
    # Mock write_transaction to call _link_source_to_library
    mock_driver = MagicMock()
    mock_driver.session.return_value.__enter__.return_value = MagicMock(
        write_transaction=lambda fn, pid, sid: fn(None, pid, sid)
    )
    mock_neo4j_client.return_value = mock_driver

    # Patch _link_source_to_library so it doesn't hit real DB
    mock_link_fn.return_value = None

    # Import router and init app
    from apis.app.routes import source_routes
    app = FastAPI()
    app.include_router(source_routes.router)

    # Simulate request
    client = TestClient(app)
    response = client.post("/project/p123/library/add", json={"source_id": "s1"})

    # Assert response
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Source s1 added to library" in data["message"]
