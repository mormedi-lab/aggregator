from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import MagicMock
import pytest
import sys

@pytest.mark.asyncio
async def test_metadata_summary(monkeypatch):
    sys.modules["app.agents.summarize_url_agent"] = MagicMock(summarize_article=lambda x: "This is a mocked summary.")

    from apis.app.routes import metadata_routes

    app = FastAPI()
    app.include_router(metadata_routes.router)

    class MockResponse:
        status_code = 200
        text = "<html><head><title>Mock Title</title></head><body><p>Mock content</p></body></html>"
        def raise_for_status(self): pass

    monkeypatch.setattr("requests.get", lambda *args, **kwargs: MockResponse())

    client = TestClient(app)
    response = client.get("/metadata", params={"url": "https://example.com"})

    assert response.status_code == 200
    assert response.json()["headline"] == "Mock Title"
    assert response.json()["summary"] == "This is a mocked summary."
    assert response.json()["publisher"] == "example.com"
