from uuid import uuid4
from datetime import datetime
from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse

from app.config import SessionNeo4j
from app.models.research_space import CreateResearchSpaceRequest, ResearchSpaceResponse, ResearchSpace
from app.models.source import Sources, Source
from app.models.response import StatusResponse
from app.services.neo4j_research_space_service import fetch_research_spaces_for_project, create_research_space_node, fetch_single_research_space_by_id, delete_research_space_and_sources, fetch_project_sources_for_space, update_prompt_for_space
from app.services.neo4j_source_service import create_sources_for_space
from app.agents.find_sources_agent import find_sources_from_prompt
from app.agents.generate_space_title_agent import generate_space_title
from app.agents.prompt_generator_agent import generate_prompt


router = APIRouter()

@router.post("/project/{project_id}/spaces", response_model=ResearchSpace)
async def create_research_space(session: SessionNeo4j, project_id: str, body: CreateResearchSpaceRequest):
    now = datetime.utcnow()
    space_id = str(uuid4())

    space_title = await generate_space_title(body.research_question)

    space = {
        "id": space_id,
        "project_id": project_id,
        "created_at": now,
        "query": "",  # will be generated later
        "search_type": body.search_type,
        "research_question": body.research_question,
        "industries": body.industries,
        "geographies": body.geographies,
        "timeframe": body.timeframe,
        "insight_style": body.insight_style,
        "additional_notes": body.additional_notes,
        "space_title": space_title,
    }

    session.write_transaction(create_research_space_node, project_id, space)

    prompt = await generate_prompt(ResearchSpace(**space))
    print("🧠 GENERATED PROMPT:", prompt) 
    session.write_transaction(update_prompt_for_space, space_id, prompt)

    return ResearchSpace(**space)

@router.get("/project/{project_id}/spaces", response_model=list[ResearchSpaceResponse])
def get_research_spaces(session: SessionNeo4j, project_id: str) -> list[ResearchSpaceResponse]:
    results = session.read_transaction(fetch_research_spaces_for_project, project_id)
    return results

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