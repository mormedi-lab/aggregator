from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from neo4j import GraphDatabase
import os

# Neo4j config
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Two models
class ProjectCreate(BaseModel):
    title: str
    description: str

class Project(ProjectCreate):
    last_accessed: str

@app.get("/projects", response_model=List[Project])
def get_projects():
    with driver.session() as session:
        result = session.run("""
            MATCH (p:Project)
            RETURN p.title AS title, p.description AS description, p.last_accessed AS last_accessed
            ORDER BY p.last_accessed DESC
        """)
        return [
            {
                "title": r["title"],
                "description": r["description"],
                "last_accessed": r["last_accessed"]
            }
            for r in result
        ]

@app.post("/projects")
def create_project(data: ProjectCreate = Body(...)):
    with driver.session() as session:
        session.run(
            """
            CREATE (p:Project {
                title: $title,
                description: $description,
                last_accessed: date()
            })
            """,
            title=data.title,
            description=data.description,
        )
    return JSONResponse(content={"status": "success"})
