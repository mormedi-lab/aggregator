import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session
from tests.MockSession import MockSession, MockTransaction

@pytest.mark.asyncio
async def test_delete_research_space():
    # Override get_neo4j_session to use a mock session
    app.dependency_overrides[get_neo4j_session] = lambda: MockSession()

    # Override write_transaction inline to simulate a real result
    MockSession.write_transaction = lambda self, func, *args, **kwargs: func(MockTransactionWithDelete(), *args, **kwargs)

    # Mock transaction that returns expected structure
    class MockTransactionWithDelete:
        def run(self, query, **kwargs):
            class Result:
                def single(self_inner):
                    return {"deleted": True}
            return Result()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.delete("/project/test-project/spaces/test-space")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["message"] == "Research space test-space deleted"
    assert data.get("source_id") is None

    app.dependency_overrides.clear()
