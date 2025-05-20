# app/routes/source_routes.py
import requests
import openai 
import os
import uuid
from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from typing import List
from dotenv import load_dotenv
from app.config import neo4j_client
from app.models.source import Source, FindSourcesRequest, AddToLibraryRequest, RemoveFromLibraryRequest
from app.agents.find_sources_agent import find_sources_from_prompt

load_dotenv()
router = APIRouter()
driver = neo4j_client()
openai.api_key = os.getenv("OPENAI_API_KEY")

# find and persist sources for a project
@router.post("/find_sources")
async def post_and_save_sources(request: FindSourcesRequest):
    project_id = request.project_id
    search_prompt = request.search_prompt

    print("✅ Received request to /find_sources")
    print("📌 project_id:", project_id)
    print("📌 search_prompt:", search_prompt)

    try:
        print("🚀 Calling find_sources_from_prompt...")
        sources = await find_sources_from_prompt(search_prompt)
        print("✅ Received sources:", sources)

        source_models = []
        for s in sources:
            if all(k in s for k in ("publisher", "headline", "url")):
                source_models.append(Source(
                    publisher=s["publisher"],
                    headline=s["headline"],
                    url=s["url"],
                    summary=s.get("summary", ""),
                    is_curated=False
                ))

        print(f"📦 Saving {len(source_models)} sources to project {project_id}")
        save_sources(project_id, source_models)

        return {"sources": sources}

    except Exception as e:
        print("❌ Error in /find_sources:", str(e))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(e)}
        )


# save sources to Neo4j
@router.post("/projects/{project_id}/sources")
def save_sources(project_id: str, sources: List[Source]):
    with driver.session() as session:
        for source in sources:
            session.write_transaction(_create_source_node, project_id, source)
    return {"status": "success", "message": f"{len(sources)} sources saved for project {project_id}"}

def _create_source_node(tx, project_id: str, source: Source):
    query = """
    MATCH (p:Project {id: $project_id})
    CREATE (s:Source {
        id: randomUUID(),
        publisher: $publisher,
        headline: $headline,
        url: $url,
        summary: $summary,
        is_curated: $is_curated
    })
    CREATE (p)-[:HAS_SOURCE]->(s)
    """
    tx.run(query, project_id=project_id, publisher=source.publisher, headline=source.headline, url=source.url, summary=source.summary, is_curated=source.is_curated)

@router.get("/projects/{project_id}/sources", response_model=List[Source])
def get_sources_for_project(project_id: str):
    # Route handler: Fetches all sources saved for a given project
    with driver.session() as session:
        result = session.read_transaction(_fetch_sources_for_project, project_id)
    return result


def _fetch_sources_for_project(tx, project_id: str):
    # Neo4j transaction: Queries and returns sources linked to a project
    query = """
    MATCH (p:Project {id: $project_id})-[:HAS_SOURCE]->(s:Source)
    RETURN 
        s.id AS id, 
        s.publisher AS publisher,
        s.headline AS headline, 
        s.url AS url, 
        coalesce(s.summary, "") AS summary,
        coalesce(s.is_curated, false) AS is_curated
    """
    results = tx.run(query, project_id=project_id)
    return [
        {
            "id": record["id"],
            "publisher": record["publisher"],
            "headline": record["headline"],
            "url": record["url"],
            "summary": record["summary"],
            "is_curated": record["is_curated"]
        }
        for record in results
    ]

@router.post("/project/{project_id}/library/add")
def add_source_to_library(project_id: str, body: AddToLibraryRequest):
    source_id = body.source_id
    with driver.session() as session:
        session.write_transaction(_link_source_to_library, project_id, source_id)
    return {"status": "success", "message": f"Source {source_id} added to library of project {project_id}"}

def _link_source_to_library(tx, project_id: str, source_id: str):
    query = """
    MATCH (p:Project {id: $project_id}), (s:Source {id: $source_id})
    MERGE (p)-[:IS_IN_LIBRARY]->(s)
    """
    tx.run(query, project_id=project_id, source_id=source_id)

@router.get("/project/{project_id}/library", response_model=List[Source])
def get_project_library(project_id: str):
    with driver.session() as session:
        result = session.read_transaction(_fetch_project_library, project_id)
    return result

def _fetch_project_library(tx, project_id: str):
    query = """
    MATCH (p:Project {id: $project_id})-[:IS_IN_LIBRARY]->(s:Source)
    RETURN 
        s.id AS id, 
        s.headline AS headline,
        s.publisher AS publisher,
        s.url AS url,
        coalesce(s.summary, "") AS summary,
        coalesce(s.is_curated, false) AS is_curated
    """
    results = tx.run(query, project_id=project_id)
    return [
        {
            "id": record["id"],
            "headline": record["headline"],
            "publisher": record["publisher"],
            "url": record["url"],
            "summary": record["summary"],
            "is_curated": record["is_curated"]
        }
        for record in results
    ]

@router.post("/project/{project_id}/library/remove")
def remove_source_from_library(project_id: str, body: RemoveFromLibraryRequest):
    source_id = body.source_id
    with driver.session() as session:
        session.write_transaction(_unlink_source_from_library, project_id, source_id)
    return {"status": "success", "message": f"Source {source_id} removed from library of project {project_id}"}

def _unlink_source_from_library(tx, project_id: str, source_id: str):
    query = """
    MATCH (p:Project {id: $project_id})-[r:IS_IN_LIBRARY]->(s:Source {id: $source_id})
    DELETE r
    """
    tx.run(query, project_id=project_id, source_id=source_id)

@router.post("/project/{project_id}/library/add-curated")
async def add_curated_source_and_link_to_library(project_id: str, request: Request):
    body = await request.json()
    source_data = body["source"]

    source_id = str(uuid.uuid4())  # generate stable ID
    with driver.session() as session:
        session.write_transaction(_create_curated_source_node_and_link, project_id, source_id, source_data)

    return {"status": "success", "source_id": source_id, "message": f"Curated source added to project {project_id} and library."}

def _create_curated_source_node_and_link(tx, project_id: str, source_id: str, source: dict):
    query = """
    MATCH (p:Project {id: $project_id})
    CREATE (s:Source {
        id: $source_id,
        publisher: $publisher,
        headline: $headline,
        url: $url,
        summary: $summary,
        is_curated: true
    })
    CREATE (p)-[:HAS_SOURCE]->(s)
    CREATE (p)-[:IS_IN_LIBRARY]->(s)
    """
    tx.run(query,
        project_id=project_id,
        source_id=source_id,
        publisher=source.get("publisher", "unknown"),
        headline=source.get("headline", "Untitled"),
        url=source.get("url", ""),
        summary=source.get("summary", "Invalid source")
    )
