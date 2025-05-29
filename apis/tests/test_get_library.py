from fastapi.testclient import TestClient

from app.config import get_neo4j_session
from app.main import app
from tests.MockSession import MockSession


def test_get_project_library_success():
    # 1. Mock the Neo4j session to return a predefined result
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
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(mock_sources)

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)
    response = client.get("/project/test-abc/library")

    # 3. Assert the response
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "sources" in data
    assert isinstance(data["sources"], list)
    assert len(data) == 2
    assert data[0]["headline"] == "Dog-Friendly Cars 2024"
    assert data[1]["id"] == "s2"
    assert data[1]["is_curated"] is False
