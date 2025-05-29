from fastapi import APIRouter, Body, Query, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import uuid

from app.models.project import Project, ProjectCreate, ProjectUpdate, Projects
from app.config import SessionNeo4j
from app.models.response import ProjectStatusResponse

router = APIRouter()


@router.get("/", tags=["System"], response_model=ProjectStatusResponse)
def status()-> ProjectStatusResponse:
    return ProjectStatusResponse(status="OK")


@router.get("/projects", response_model=Projects)
def get_projects(session: SessionNeo4j)-> Projects:
    result = session.run("""
        MATCH (p:Project)
        WHERE p.id IS NOT NULL
        RETURN p.id AS id, p.title AS title, p.industry AS industry, p.objective AS objective, p.last_accessed AS last_accessed
        ORDER BY p.last_accessed DESC
    """)
    return Projects(
        projects=[
            Project(
                id=r["id"],
                title=r["title"],
                industry=r["industry"],
                objective=r["objective"] or "",
                last_accessed=str(r["last_accessed"]) if r["last_accessed"] else None,
            )
            for r in result
        ]
    )


@router.get("/project", response_model=Project)
def get_project_by_id(session: SessionNeo4j, id: str = Query(...))-> Project:
    result = session.run("""
        MATCH (p:Project {id: $id})
        RETURN p.id AS id, p.title AS title, p.industry AS industry, p.objective AS objective, p.last_accessed AS last_accessed
    """, id=id)
    record = result.single()
    if not record:
        raise HTTPException(status_code=404, detail="Project not found")

    if record:
        return Project(
            id=record["id"],
            title=record["title"],
            industry=record["industry"],
            objective=record["objective"] or "",
            last_accessed=str(record["last_accessed"]) if record["last_accessed"] else None,
        )


@router.post("/projects", response_model=ProjectStatusResponse)
def create_project(session: SessionNeo4j, data: ProjectCreate = Body(...))-> ProjectStatusResponse:
    new_id = str(uuid.uuid4())

    session.run(
        """
        CREATE (p:Project {
            id: $id,
            title: $title,
            industry: $industry,
            objective: $objective,
            last_accessed: date()
        })
        """,
        id=new_id,
        title=data.title,
        industry=data.industry,
        objective=data.objective,
    )
    return ProjectStatusResponse(status="success", id=new_id)


@router.delete("/project", response_model=ProjectStatusResponse)
def delete_project(session: SessionNeo4j, id: str = Query(...))-> ProjectStatusResponse:
    session.run("""
        MATCH (p:Project {id: $id})
        OPTIONAL MATCH (p)-[:HAS_SOURCE]->(s:Source)
        DETACH DELETE p, s
    """, id=id)
    return ProjectStatusResponse(status="deleted")


@router.put("/project", response_model=ProjectStatusResponse)
def update_project(session: SessionNeo4j, data: ProjectUpdate = Body(...))-> ProjectStatusResponse:
    session.run("""
        MATCH (p:Project {id: $id})
        SET p.title = $title,
            p.industry = $industry,
            p.objective = $objective,
            p.last_accessed = date()
    """, id=data.id, title=data.title, industry=data.industry, objective=data.objective)
    return ProjectStatusResponse(status="updated")
