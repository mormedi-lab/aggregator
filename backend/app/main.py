# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from neo4j import GraphDatabase
import os

# Example: read from env
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

class Project(BaseModel):
    title: str
    description: str
    last_accessed: str

@app.get("/projects", response_model=List[Project])
def get_projects():
    with driver.session() as session:
        result = session.run("""
            MATCH (p:Project)
            RETURN p.title AS title, p.description AS description, p.last_accessed AS last_accessed
            ORDER BY p.last_accessed DESC
        """)
        projects = [
            {
                "title": record["title"],
                "description": record["description"],
                "last_accessed": record["last_accessed"]
            }
            for record in result
        ]
        return projects

