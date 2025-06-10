import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_neo4j_session

@pytest.mark.asyncio
async def test_check_has_project_sources_returns_sources():
    # 1. Define isolated mock transaction
    class MockTransactionWithSources:
        def run(self, query, **kwargs):  # Accept arbitrary keyword args
            class Record:
                def __getitem__(self, item):
                    return {
                        "id": "src-1",
                        "publisher": "Tech News",
                        "headline": "AI Advances",
                        "url": "https://technews.com/ai-advances",
                        "summary": "Latest breakthroughs in AI",
                        "is_in_project": True,
                        "is_trusted": False,
                        "date_published": "2024-06-01",
                        "image_url": "https://example.com/image.jpg"
                    }
            return [Record()]

    # 2. Isolated session using the transaction
    class IsolatedMockSession:
        def read_transaction(self, func, *args, **kwargs):
            return func(MockTransactionWithSources(), *args, **kwargs)

    app.dependency_overrides[get_neo4j_session] = lambda: IsolatedMockSession()

    # 3. Call the endpoint
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/project/test-project/spaces/test-space/has_project_sources")

    # 4. Assert the response
    assert response.status_code == 200
    data = response.json()
    assert "sources" in data
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) == 1
    assert data["sources"][0]["publisher"] == "Tech News"

    # 5. Clean up
    app.dependency_overrides.clear()
