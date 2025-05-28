from fastapi.testclient import TestClient

from app.config import get_neo4j_session
from app.main import app
from tests.MockSession import MockSession


def test_add_source_to_library():
    # 1. Mock the Neo4j session to return a predefined result
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)

    # Simulate request
    # client = TestClient(app)
    response = client.post("/project/p123/library/add", json={"source_id": "s1"})

    # Assert response
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Source s1 added to library" in data["message"]
