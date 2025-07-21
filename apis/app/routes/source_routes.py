import uuid
from typing import List

import openai
from fastapi import APIRouter, status, Request, HTTPException, Path
from fastapi.responses import JSONResponse

from app.config import SessionNeo4j, load_conf
from app.models.source import Source, Sources, AddSourceRequest

from app.agents.find_sources_agent import find_sources_from_prompt
from app.services.neo4j_source_service import create_sources_for_space, fetch_sources_for_space, create_link_to_project, remove_link_to_project
from app.services.neo4j_research_space_service import fetch_single_research_space_by_id

router = APIRouter()
openai.api_key = load_conf("OPENAI_API_KEY")

@router.get("/space/{space_id}/sources", response_model=Sources)
def get_sources_for_space(session: SessionNeo4j, space_id: str, project_id: str) -> Sources:
    sources = session.read_transaction(fetch_sources_for_space, space_id, project_id)
    return Sources(sources=sources)

@router.post("/space/{space_id}/find_sources", response_model=Sources)
async def find_sources_for_space(session: SessionNeo4j, space_id: str) -> Sources:
    space = session.read_transaction(fetch_single_research_space_by_id, space_id)
    if not space:
        raise HTTPException(status_code=404, detail="Research space not found")

    query = space["query"]

    try:
        sources = await find_sources_from_prompt(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

    valid_sources = [
        Source(
            publisher=s.publisher,
            headline=s.headline,
            url=s.url,
            summary=s.summary or "",
            full_text=s.full_text or "",
            is_trusted=False,
        )
        for s in sources
        if s.publisher and s.headline and s.url
    ]

    session.write_transaction(create_sources_for_space, space_id, valid_sources)

    return Sources(sources=sources)

@router.post("/space/{space_id}/add_source_to_project")
async def add_source_to_project(session: SessionNeo4j, space_id: str, request: AddSourceRequest) -> dict:
    try:
        session.write_transaction(create_link_to_project, request.project_id, request.source_id)
        return {"message": "Source added to project", "source_id": request.source_id}
    except Exception as e:
        print("🔥 ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/space/{space_id}/remove_source_from_project")
async def remove_source_from_project(session: SessionNeo4j, space_id: str, project_id: str, source_id: str) -> dict:
    try:
        session.write_transaction(remove_link_to_project, project_id, source_id)
        return {"message": "Source removed from project", "source_id": source_id}
    except Exception as e:
        print("🔥 ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
