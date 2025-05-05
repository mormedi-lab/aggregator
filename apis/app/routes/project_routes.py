from fastapi import APIRouter, Body, Query
from fastapi.responses import JSONResponse
from typing import List
import uuid

from app.models.project import Project, ProjectCreate, ProjectUpdate
from app.config import neo4j_client

driver = neo4j_client()
router = APIRouter()

@router.get("/", tags=["System"])
def status():
    return {"status": "OK"}


@router.get("/projects", response_model=List[Project])
def get_projects():
    with driver.session() as session:
        result = session.run("""
            MATCH (p:Project)
            WHERE p.id IS NOT NULL
            RETURN p.id AS id, p.title AS title, p.industry AS industry, p.objective AS objective, p.last_accessed AS last_accessed
            ORDER BY p.last_accessed DESC
        """)
        return [
            {
                "id": r["id"],
                "title": r["title"],
                "industry": r["industry"],
                "objective": r["objective"] or "",
                "last_accessed": str(r["last_accessed"]) if r["last_accessed"] else None,
            }
            for r in result
        ]


@router.get("/project", response_model=Project)
def get_project_by_id(id: str = Query(...)):
    with driver.session() as session:
        result = session.run("""
            MATCH (p:Project {id: $id})
            RETURN p.id AS id, p.title AS title, p.industry AS industry, p.objective AS objective, p.last_accessed AS last_accessed
        """, id=id)
        record = result.single()
        if record:
            return {
                "id": record["id"],
                "title": record["title"],
                "industry": record["industry"],
                "objective": record["objective"] or "",
                "last_accessed": str(record["last_accessed"]) if record["last_accessed"] else None,
            }


@router.post("/projects")
def create_project(data: ProjectCreate = Body(...)):
    with driver.session() as session:
        session.run("""
            CREATE (p:Project {
                id: $id,
                title: $title,
                industry: $industry,
                objective: $objective,
                last_accessed: date()
            })
        """, id=str(uuid.uuid4()), title=data.title, industry=data.industry, objective=data.objective)
    return JSONResponse(content={"status": "success"})


@router.delete("/project")
def delete_project(id: str = Query(...)):
    with driver.session() as session:
        session.run("""
            MATCH (p:Project {id: $id})
            DETACH DELETE p
        """, id=id)
    return JSONResponse(content={"status": "deleted"})


@router.put("/project")
def update_project(data: ProjectUpdate = Body(...)):
    with driver.session() as session:
        session.run("""
            MATCH (p:Project {id: $id})
            SET p.title = $title,
                p.industry = $industry,
                p.objective = $objective,
                p.last_accessed = date()
        """, id=data.id, title=data.title, industry=data.industry, objective=data.objective)
    return JSONResponse(content={"status": "updated"})
