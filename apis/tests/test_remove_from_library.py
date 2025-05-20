import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

@patch("apis.app.config.neo4j_client")
@patch("apis.app.routes.source_routes._unlink_source_from_library")
def test_remove_source_from_library(mock_unlink_fn, mock_neo4j_client):
    # 1. Mock DB transaction passthrough
    mock_driver = MagicMock()
    mock_driver.session.return_value.__enter__.return_value = MagicMock(
        write_transaction=lambda fn, pid, sid: fn(None, pid, sid)
    )
    mock_neo4j_client.return_value = mock_driver

    # 2. Patch the internal function (no-op)
    mock_unlink_fn.return_value = None

    # 3. Import route and setup app
    from apis.app.routes import source_routes
    app = FastAPI()
    app.include_router(source_routes.router)

    # 4. Send POST request
    client = TestClient(app)
    response = client.post("/project/p123/library/remove", json={"source_id": "s1"})

    # 5. Validate
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "removed from library" in data["message"]
