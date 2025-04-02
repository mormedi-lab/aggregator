from fastapi import APIRouter, Body, Request
from app.models.project import ProjectCreate
from app.db import db
from bson.objectid import ObjectId
from typing import Dict
from app.agents.prompt_generator.agent import generate_prompt
from app.agents.find_sources.agent import find_sources

router = APIRouter()

@router.post("/projects")
async def create_project(project: ProjectCreate):
    result = await db.projects.insert_one(project.dict())
    return {"_id": str(result.inserted_id)}

@router.get("/projects")
async def get_projects():
    projects = []
    cursor = db.projects.find({})
    async for project in cursor:
        projects.append({
            "_id": str(project["_id"]),  # ✅ include _id
            "name": project["name"],
            "description": project.get("description", ""),
            "lastAccessed": project.get("lastAccessed", "2025-01-01"),  # fallback
        })
    return projects

@router.post("/generate_prompt")
async def generate_prompt_route(form_answers: dict):
    print("📩 Received form answers:", form_answers)
    prompt = await generate_prompt(form_answers)  # ✅ await the async function
    print("🧠 Generated search prompt:", prompt)
    return {"prompt": prompt}


@router.post("/find_sources")
async def find_sources_route(request: Request):
    body = await request.json()
    search_prompt = body.get("search_prompt")
    print(f"🌐 Calling FindSourcesAgent with: {search_prompt}")
    results = await find_sources(search_prompt)
    return {"sources": results}


