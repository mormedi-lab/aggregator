import uuid
from datetime import datetime
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.config import SessionNeo4j
from app.models.research_space import CreateResearchSpaceRequest, ResearchSpaceResponse

from app.services.neo4j_research_space_service import fetch_research_spaces_for_project
from app.services.neo4j_research_space_service import create_research_space_node

router = APIRouter()

@router.post("/project/{project_id}/spaces", response_model=ResearchSpaceResponse)
def create_research_space(session: SessionNeo4j, project_id: str, body: CreateResearchSpaceRequest):
    space_id = str(uuid.uuid4())
    space = body.model_copy(update={"id": space_id, "created_at": datetime.utcnow().isoformat()})
    
    session.write_transaction(create_research_space_node, project_id, space)
    return ResearchSpaceResponse(
        id=space.id,
        query=space.query,
        search_type=space.search_type,
        created_at=space.created_at
    )

@router.get("/project/{project_id}/spaces", response_model=list[ResearchSpaceResponse])
def get_research_spaces(session: SessionNeo4j, project_id: str):
    return session.read_transaction(fetch_research_spaces_for_project, project_id)
