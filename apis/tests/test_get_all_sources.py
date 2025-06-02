from fastapi.testclient import TestClient

from app.config import get_neo4j_session
from app.main import app
from tests.MockSession import MockSession


def test_get_all_project_sources():
    # 1. Mock the Neo4j session to return a predefined result
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
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(mock_sources)

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)
    response = client.get("/projects/p123/sources")

    # 3. Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "sources" in data
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) == 2
    assert data["sources"][0]["is_curated"] is True
    assert data["sources"][1]["publisher"] == "Auto Today"
