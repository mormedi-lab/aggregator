import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.source import Sources, Source
from app.agents.chat_with_sources_agent import get_source_chat_response
from app.config import get_neo4j_session
from tests.MockSession import MockSession


class MockedSession(MockSession):
    def read_transaction(self, func, *args, **kwargs):
        return Sources(sources=[
            Source(
                id="1",
                headline="Mock Headline",
                publisher="Mock Publisher",
                summary="Mock summary",
                date_published="2023-01-01",
                url="http://mock.url",
                full_text="Mock full text content"
            )
        ])


@pytest.mark.asyncio
async def test_chat_with_sources_success():
    app.dependency_overrides[get_neo4j_session] = lambda: MockedSession()

    # Mock the LLM function
    def mock_response(user_message, sources):
        return "Mocked answer"

    original_func = get_source_chat_response.__code__
    get_source_chat_response.__code__ = mock_response.__code__

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/chat_with_sources",
            json={
                "project_id": "mock_project",
                "user_message": "What are the trends?",
                "space_ids": ["space1"]
            }
        )

    get_source_chat_response.__code__ = original_func
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["answer"] == "Mocked answer"


@pytest.mark.asyncio
async def test_chat_with_sources_no_sources():
    class EmptySession(MockSession):
        def read_transaction(self, func, *args, **kwargs):
            return Sources(sources=[])

    app.dependency_overrides[get_neo4j_session] = lambda: EmptySession()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/chat_with_sources",
            json={
                "project_id": "mock_project",
                "user_message": "Anything here?",
                "space_ids": ["space1"]
            }
        )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["answer"] == "No sources are selected. Please select sources before chatting."
