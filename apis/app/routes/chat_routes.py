from fastapi import APIRouter
from app.config import SessionNeo4j
from app.agents.chat_with_sources_agent import get_source_chat_response
from app.models.chat import ChatRequest, ChatResponse
from app.services.neo4j_research_space_service import fetch_project_sources_for_space

router = APIRouter()

@router.post("/space/{space_id}/chat_with_sources", response_model=ChatResponse)
async def chat_with_selected_sources(space_id: str, body: ChatRequest, session: SessionNeo4j):
    project_id = body.project_id
    user_message = body.user_message

    # Get only sources added to the project + from this space
    sources_model = session.read_transaction(fetch_project_sources_for_space, project_id, space_id)
    if not sources_model.sources:
        return ChatResponse(answer="No sources are selected. Please select sources before chatting.", citations=[])

    # Call the LLM with the context
    answer = get_source_chat_response(user_message, sources_model.sources)

    # Optional: return IDs or headlines used
    citations = [s.headline for s in sources_model.sources]

    return ChatResponse(answer=answer, citations=citations)
