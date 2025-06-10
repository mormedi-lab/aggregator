from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction
from app.models.source import Source
import json

def test_find_sources_extracts_image_url():
    # 1. Mock session to return a query when reading the space
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(
        return_value={"query": "future of electric vehicles"}
    )

    # 2. Patch both extract_image_url and Runner.run
    with patch("app.agents.find_sources_agent.extract_image_url") as mock_extract_image, \
         patch("app.agents.find_sources_agent.Runner.run") as mock_runner_run:

        mock_extract_image.return_value = "https://example.com/fake-image.jpg"

        # Mock LLM response JSON
        fake_sources = [
            {
                "publisher": "Test Publisher",
                "headline": "EVs and the Future",
                "url": "https://example.com/future-evs",
                "summary": "Exploring electric vehicle trends."
            }
        ]

        mock_runner_run.return_value.final_output = json.dumps(fake_sources)

        # Patch the write_transaction to avoid AttributeErrors
        def mock_create_sources_for_space(tx, project_id, sources):
            assert isinstance(sources, list)
            for source in sources:
                assert isinstance(source, Source)
                assert source.headline == "EVs and the Future"
                assert source.image_url == "https://example.com/fake-image.jpg"
            return True

        MockSession.write_transaction = lambda self, func, *args, **kwargs: mock_create_sources_for_space(MockTransaction(), *args, **kwargs)

        # 3. Make the request
        client = TestClient(app)
        response = client.post("/space/test-space-id/find_sources")

        # 4. Assertions
        assert response.status_code == 200
        data = response.json()
        assert "sources" in data
        assert isinstance(data["sources"], list)
        assert data["sources"][0]["image_url"] == "https://example.com/fake-image.jpg"
        assert data["sources"][0]["headline"] == "EVs and the Future"
