from fastapi.testclient import TestClient

from app.config import get_neo4j_session
from app.main import app
from tests.MockSession import MockSession, MockResult


def test_create_project():
    # 1. Mock the Neo4j session to return a predefined result
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)
    payload = {
        "title": "Test Project",
        "industry": "Mobility",
        "objective": "Explore smart solutions"
    }
    response = client.post("/projects", json=payload)

    # 3. Assert the response status and content
    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_get_all_projects():
    # 1. Mock the Neo4j session to return a predefined list of projects
    return_value = [
        {
            "id": "aaa-fff-1234",
            "title": "Test Project 1",
            "industry": "Mobility",
            "objective": "Explore smart solutions",
            "last_accessed": "2024-01-01T12:00:00"
        }
    ]
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value)

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)
    response = client.get("/projects")

    # 3. Assert the response status and content
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 1
    assert response.json() == return_value


def test_get_project_by_id():
    # 1. Mock the Neo4j session to return a predefined list of projects
    return_value = MockResult(
        {
            "id": "aaa-fff-1234",
            "title": "Test Project 1",
            "industry": "Mobility",
            "objective": "Explore smart solutions",
            "last_accessed": "2024-01-01T12:00:00"
        }
    )
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession(return_value)

    # 2. Create a test client and make a request to the endpoint
    client = TestClient(app)
    response = client.get(f"/project?id=aaa-fff-1234")
    assert response.status_code == 200
    assert response.json()["id"] == "aaa-fff-1234"


def test_update_project():
    # 1. Mock the Neo4j session to return a predefined result
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # 2. Create a test client and make a request to the endpoint with update data
    update = {
        "id": "aaa-fff-1234",
        "title": "Test Project 1",
        "industry": "Updated Industry",
        "objective": "Updated Objective"
    }
    client = TestClient(app)
    response = client.put("/project", json=update)

    # 3. Assert the response status and content
    assert response.status_code == 200
    assert response.json()["status"] == "updated"


def test_delete_project():
    # 1. Mock the Neo4j session to return a predefined result
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # 2. Create a test client and make a request to the endpoint with a project ID
    client = TestClient(app)
    response = client.delete("/project?id=aaa-fff-1234}")
    assert response.status_code == 200
    assert response.json()["status"] == "deleted"
