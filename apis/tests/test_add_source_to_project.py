import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction

@pytest.mark.asyncio
async def test_add_source_to_project_success():
    class VerifyingTransaction(MockTransaction):
        def run(self, query, parameters=None):
            assert "MATCH (p:Project" in query
            assert parameters["project_id"] == "proj-123"
            assert parameters["source_id"] == "source-456"
            print("✅ CustomTransaction.run called")
            return None

    # ✅ this is key: async generator override
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()
    MockSession.write_transaction = lambda self, func, *args, **kwargs: func(VerifyingTransaction(), *args, **kwargs)

    payload = {
        "project_id": "proj-123",
        "source_id": "source-456"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/space/space-xyz/add_source_to_project", json=payload)

    app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Source added to project"
    assert data["source_id"] == "source-456"
