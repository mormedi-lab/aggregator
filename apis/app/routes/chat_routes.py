from fastapi import APIRouter
from app.config import SessionNeo4j
from app.agents.chat_with_sources_agent import get_source_chat_response
from app.models.chat import ChatRequest, ChatResponse
from app.services.neo4j_research_space_service import fetch_project_sources_for_space
from app.models.source import Source, Sources

router = APIRouter()

@router.post("/chat_with_sources", response_model=ChatResponse)
async def chat_with_selected_sources(body: ChatRequest, session: SessionNeo4j):
    project_id = body.project_id
    user_message = body.user_message
    space_ids = body.space_ids

    # Gather sources from all selected space_ids
    all_sources: list[Source] = []
    for space_id in space_ids:
        result: Sources = session.read_transaction(fetch_project_sources_for_space, project_id, space_id)
        all_sources.extend(result.sources)

    if not all_sources:
        return ChatResponse(answer="No sources are selected. Please select sources before chatting.")

    # Call the LLM with full context
    answer = get_source_chat_response(user_message, all_sources)

    return ChatResponse(answer=answer)
