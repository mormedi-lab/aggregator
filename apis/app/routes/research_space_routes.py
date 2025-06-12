import uuid
from datetime import datetime
from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse

from app.config import SessionNeo4j
from app.models.research_space import CreateResearchSpaceRequest, ResearchSpaceResponse
from app.models.source import Sources, Source
from app.models.response import StatusResponse
from app.services.neo4j_research_space_service import fetch_research_spaces_for_project, create_research_space_node, fetch_single_research_space_by_id, delete_research_space_and_sources, fetch_project_sources_for_space
from app.services.neo4j_source_service import create_sources_for_space
from app.agents.prompt_generator_agent import generate_prompt
from app.agents.find_sources_agent import find_sources_from_prompt


router = APIRouter()

@router.post("/project/{project_id}/spaces", response_model=ResearchSpaceResponse)
async def create_research_space(session: SessionNeo4j, project_id: str, body: CreateResearchSpaceRequest) -> ResearchSpaceResponse:
    space_id = str(uuid.uuid4())

    # Step 1: Generate prompt
    prompt = await generate_prompt(body)
    if not prompt:
        prompt = body.research_question

    # Step 2: Create ResearchSpace with prompt
    space = body.model_copy(update={
        "id": space_id,
        "created_at": datetime.utcnow().isoformat(),
        "query": prompt
    })

    session.write_transaction(create_research_space_node, project_id, space)

    # Step 3: Find sources immediately
    sources = await find_sources_from_prompt(prompt)

    # Step 4: Filter and persist
    valid_sources = [
        Source(
            publisher=s.publisher,
            headline=s.headline,
            url=s.url,
            summary=s.summary or "",
            is_trusted=False
        )
        for s in sources
        if s.publisher and s.headline and s.url
    ]

    session.write_transaction(create_sources_for_space, space_id, valid_sources)

    # Step 5: Return
    return ResearchSpaceResponse(
        id=space.id,
        query=space.query or "",
        search_type=space.search_type,
        created_at=space.created_at
    )

@router.get("/project/{project_id}/spaces", response_model=list[ResearchSpaceResponse])
def get_research_spaces(session: SessionNeo4j, project_id: str) -> list[ResearchSpaceResponse]:
    return session.read_transaction(fetch_research_spaces_for_project, project_id)


@router.get("/project/{project_id}/spaces/{space_id}", response_model=ResearchSpaceResponse)
def get_research_space(session: SessionNeo4j, project_id: str, space_id: str) -> ResearchSpaceResponse:
    space = session.read_transaction(fetch_single_research_space_by_id, space_id)
    if space is None:
        raise HTTPException(status_code=404, detail="Research space not found")
    return space

@router.delete("/project/{project_id}/spaces/{space_id}")
def delete_research_space(session: SessionNeo4j, project_id: str, space_id: str)-> StatusResponse:
    deleted: bool = session.write_transaction(delete_research_space_and_sources, space_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Research space not found")
    
    return StatusResponse(status="success", message=f"Research space {space_id} deleted")

@router.get("/project/{project_id}/spaces/{space_id}/has_project_sources", response_model=Sources)
def check_research_space_has_project_sources(session: SessionNeo4j, project_id: str, space_id: str) -> Sources:
    return session.read_transaction(fetch_project_sources_for_space, project_id, space_id)