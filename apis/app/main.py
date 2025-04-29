from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.config import neo4j_client

# Load environment variables from .env file
load_dotenv(dotenv_path="conf/.env")
driver = neo4j_client()

# entry point of FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models ---
class ProjectCreate(BaseModel):
    title: str
    industry: str
    objective: str


class Project(ProjectCreate):
    id: str
    last_accessed: Optional[str] = None

class ProjectUpdate(ProjectCreate):
    id: str

# --- Routes ---

@app.get("/")
def status():
    return {"status": "OK"}

#this gets ALL projects
@app.get("/projects", response_model=List[Project])
def get_projects():
    with driver.session() as session:
        result = session.run("""
            MATCH (p:Project)
            WHERE p.id IS NOT NULL
            RETURN p.id AS id, p.title AS title, p.industry AS industry, p.objective AS objective, p.last_accessed AS last_accessed
            ORDER BY p.last_accessed DESC
        """)
        projects = [
            {
                "id": record["id"],
                "title": record["title"],
                "industry": record["industry"],
                "objective": record["objective"] if record["objective"] is not None else "",
                "last_accessed": str(record["last_accessed"]) if record["last_accessed"] else None
            }
            for record in result
        ]
        return projects



#gets ONE project
@app.get("/project", response_model=Project)
def get_project_by_id(id: str = Query(...)):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Project {id: $id})
            RETURN p.id AS id, p.title AS title, p.industry AS industry, p.objective AS objective, p.last_accessed AS last_accessed
            """,
            id=id,
        )
        record = result.single()
        if record:
            return {
                "id": record["id"],
                "title": record["title"],
                "industry": record["industry"],
                "objective": record["objective"] if record["objective"] is not None else "",
                "last_accessed": str(record["last_accessed"]) if record["last_accessed"] else None,
            }


#creates 1 project
@app.post("/projects")
def create_project(data: ProjectCreate = Body(...)):
    with driver.session() as session:
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
            id=str(uuid.uuid4()),
            title=data.title,
            industry=data.industry,
            objective=data.objective,
        )
    return JSONResponse(content={"status": "success"})


#deletes selected project
@app.delete("/project")
def delete_project(id: str = Query(...)):
    with driver.session() as session:
        session.run(
            """
            MATCH (p:Project {id: $id})
            DETACH DELETE p
            """,
            id=id
        )
    return JSONResponse(content={"status": "deleted"})

#updates a project
@app.put("/project")
def update_project(data: ProjectUpdate = Body(...)):
    with driver.session() as session:
        session.run(
            """
            MATCH (p:Project {id: $id})
            SET p.title = $title,
                p.industry = $industry,
                p.objective = $objective,
                p.last_accessed = date()
            """,
            id=data.id,
            title=data.title,
            industry=data.industry,
            objective=data.objective,
        )
    return JSONResponse(content={"status": "updated"})

