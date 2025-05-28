from fastapi.testclient import TestClient

from app.config import get_neo4j_session
from app.main import app
from tests.MockSession import MockSession


def test_add_curated_source_success():
    # Step 1. Mock the Neo4j session to return a predefined result
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # Step 2. Create a test client
    client = TestClient(app)

    # Step 3: Payload
    payload = {
        "source": {
            "headline": "Why Dogs Love EVs",
            "publisher": "PetCar Weekly",
            "url": "https://example.com/pet-cars",
            "summary": "A deep dive into vehicle features that benefit pets."
        }
    }

    # Step 4: POST to endpoint
    response = client.post("/project/test-abc/library/add-curated", json=payload)

    # Step 5: Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "source_id" in data
