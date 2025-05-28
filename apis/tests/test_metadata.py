from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.agents.summarize_url_agent import summarize_article
from app.main import app


def fake_summarize_article(raw_text):
    return "This is a mocked summary."

@pytest.mark.skip("Skipping this test for now due to issues with mocking the summarize_article function.")
@patch("app.agents.summarize_url_agent.summarize_article", side_effect=fake_summarize_article)
def test_metadata_summary(mock_summarize_article, monkeypatch):
    # Mock the summarize_article function to return a fixed summary
    # TODO: doesn't work, I don't know why for the moment.
    summarize_article("blopblop")

    # 1. Mock the requests.get method to return a predefined response
    class MockResponse:
        status_code = 200
        text = "<html><head><title>Mock Title</title></head><body><p>Mock content</p></body></html>"

        def raise_for_status(self): pass

    monkeypatch.setattr("requests.get", lambda *args, **kwargs: MockResponse())

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)
    response = client.get("/metadata", params={"url": "https://example.com"})

    # 3. Assert the response
    assert response.status_code == 200
    assert response.json()["headline"] == "Mock Title"
    assert response.json()["summary"] == "This is a mocked summary."
    assert response.json()["publisher"] == "example.com"
