from fastapi.testclient import TestClient
import uuid
import sys
import os 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import app

client = TestClient(app)

def test_create_project():
    payload = {
        "title": "Test Project",
        "industry": "Mobility",
        "objective": "Explore smart solutions"
    }
    response = client.post("/projects", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_get_all_projects():
    response = client.get("/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_project_by_id():
    # First create a new project
    payload = {
        "title": f"Project {uuid.uuid4()}",
        "industry": "Retail",
        "objective": "Test single fetch"
    }
    client.post("/projects", json=payload)
    projects = client.get("/projects").json()
    latest = projects[0]

    response = client.get(f"/project?id={latest['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == latest["id"]

def test_update_project():
    projects = client.get("/projects").json()
    project = projects[0]

    update = {
        "id": project["id"],
        "title": project["title"],
        "industry": "Updated Industry",
        "objective": "Updated Objective"
    }
    response = client.put("/project", json=update)
    assert response.status_code == 200
    assert response.json()["status"] == "updated"

def test_delete_project():
    # Create new
    payload = {
        "title": f"ToDelete {uuid.uuid4()}",
        "industry": "Energy",
        "objective": "Temporary project"
    }
    client.post("/projects", json=payload)
    projects = client.get("/projects").json()
    to_delete = next(p for p in projects if "ToDelete" in p["title"])

    response = client.delete(f"/project?id={to_delete['id']}")
    assert response.status_code == 200
    assert response.json()["status"] == "deleted"
