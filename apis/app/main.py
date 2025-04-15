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


class ProjectCreate(BaseModel):
    title: str
    industry: str


class Project(ProjectCreate):
    last_accessed: Optional[str] = None


@app.get("/")
def status():
    return {"status": "OK"}


@app.get("/projects", response_model=List[Project])
def get_projects():
    with driver.session() as session:
        result = session.run("""
            MATCH (p:Project)
            RETURN p.title AS title, p.industry AS industry, p.last_accessed AS last_accessed
            ORDER BY p.last_accessed DESC
        """)
        projects = [
            {
                "title": record["title"],
                "industry": record["industry"],
                "last_accessed": str(record["last_accessed"])  # Convert Neo4j date to string
            }
            for record in result
        ]
        return projects


@app.post("/projects")
def create_project(data: Project = Body(...)):
    with driver.session() as session:
        session.run(
            """
            CREATE (p:Project {
                title: $title,
                industry: $industry,
                last_accessed: date()
            })
            """,
            title=data.title,
            industry=data.industry,
        )
    return JSONResponse(content={"status": "success"})


@app.delete("/projects")
def delete_project(title: str = Query(...)):
    with driver.session() as session:
        session.run(
            """
            MATCH (p:Project {title: $title})
            DETACH DELETE p
            """,
            title=title
        )
    return {"status": "deleted"}
