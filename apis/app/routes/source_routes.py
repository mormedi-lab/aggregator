import uuid
from typing import List

import openai
from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse

from app.agents.find_sources_agent import find_sources_from_prompt
from app.services.neo4j_source_service import (
    create_source_node,
    fetch_sources_for_project,
    link_source_to_library,
    fetch_project_library,
    unlink_source_from_library,
    create_curated_source_node_and_link,
)
from app.config import SessionNeo4j, load_conf
from app.models.source import Source, FindSourcesRequest, AddToLibraryRequest, RemoveFromLibraryRequest, CuratedSourceRequest

router = APIRouter()
openai.api_key = load_conf("OPENAI_API_KEY")

# find and persist sources for a project
@router.post("/find_sources")
async def post_and_save_sources(request: FindSourcesRequest)-> dict:
    project_id = request.project_id
    search_prompt = request.search_prompt

    print("✅ Received request to /find_sources")
    print("📌 project_id:", project_id)
    print("📌 search_prompt:", search_prompt)

    try:
        print("🚀 Calling find_sources_from_prompt...")
        sources = await find_sources_from_prompt(search_prompt)
        print("✅ Received sources:", sources)

        # Convert validated Pydantic Source objects to new instances
        source_models = [
            Source(
                publisher=s.publisher,
                headline=s.headline,
                url=s.url,
                summary=s.summary or "",
                is_curated=False
            )
            for s in sources
            if s.publisher and s.headline and s.url
        ]

        print(f"📦 Saving {len(source_models)} sources to project {project_id}")
        save_sources(project_id, source_models)

        return {"sources": [s.model_dump() for s in sources]}  # Return raw data for frontend

    except Exception as e:
        print("❌ Error in /find_sources:", str(e))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )


# save sources to Neo4j
@router.post("/projects/{project_id}/sources")
def save_sources(session: SessionNeo4j, project_id: str, sources: List[Source]):
    for source in sources:
        session.write_transaction(create_source_node, project_id, source)
    return {"status": "success", "message": f"{len(sources)} sources saved for project {project_id}"}

@router.get("/projects/{project_id}/sources", response_model=List[Source])
def get_sources_for_project(session: SessionNeo4j, project_id: str):
    # Route handler: Fetches all sources saved for a given project
    result = session.read_transaction(fetch_sources_for_project, project_id)
    return result


@router.post("/project/{project_id}/library/add")
def add_source_to_library(session: SessionNeo4j, project_id: str, body: AddToLibraryRequest)-> dict:
    source_id = body.source_id
    session.write_transaction(link_source_to_library, project_id, source_id)
    return {"status": "success", "message": f"Source {source_id} added to library of project {project_id}"}


@router.get("/project/{project_id}/library", response_model=List[Source])
def get_project_library(session: SessionNeo4j, project_id: str):
    result = session.read_transaction(fetch_project_library, project_id)
    return result


@router.post("/project/{project_id}/library/remove")
def remove_source_from_library(session: SessionNeo4j, project_id: str, body: RemoveFromLibraryRequest):
    source_id = body.source_id
    session.write_transaction(unlink_source_from_library, project_id, source_id)
    return {"status": "success", "message": f"Source {source_id} removed from library of project {project_id}"}


@router.post("/project/{project_id}/library/add-curated")
async def add_curated_source_and_link_to_library(session: SessionNeo4j, project_id: str, body: CuratedSourceRequest, request: Request)-> dict:
    source_data = body.source.model_dump()

    source_id = str(uuid.uuid4())  # generate stable ID
    session.write_transaction(create_curated_source_node_and_link, project_id, source_id, source_data)

    return {"status": "success", "source_id": source_id, "message": f"Curated source added to project {project_id} and library."}

