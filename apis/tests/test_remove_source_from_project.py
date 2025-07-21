import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction

@pytest.mark.asyncio
async def test_remove_source_from_project_success():
    # Custom mock transaction to verify Cypher and params
    class VerifyingTransaction(MockTransaction):
        def run(self, query, parameters=None):
            assert "MATCH (p:Project {id: $project_id})-[r:INCLUDES]->(s:Source {id: $source_id})" in query
            assert "DELETE r" in query
            assert parameters["project_id"] == "proj-abc"
            assert parameters["source_id"] == "src-xyz"
            return None

    # Override dependency with mocked session
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()
    MockSession.write_transaction = lambda self, func, *args, **kwargs: func(VerifyingTransaction(), *args, **kwargs)

    # Perform DELETE request
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.delete("/space/space-789/remove_source_from_project?project_id=proj-abc&source_id=src-xyz")

    # Reset overrides
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Source removed from project"
    assert data["source_id"] == "src-xyz"
