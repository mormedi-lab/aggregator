from fastapi import APIRouter, Body, Request
from app.models.project import ProjectCreate
from app.db import db
from bson.objectid import ObjectId
from typing import Dict
from app.agents.prompt_generator.agent import generate_prompt
from app.agents.find_sources.agent import find_sources
from fastapi import APIRouter, HTTPException
from bs4 import BeautifulSoup
import httpx

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

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    try:
        obj_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    project = await db.projects.find_one({"_id": obj_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "_id": str(project["_id"]),
        "name": project["name"],
        "description": project.get("description", ""),
        "lastAccessed": project.get("lastAccessed", "2025-01-01"),
    }

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

@router.post("/fetch_metadata")
async def fetch_metadata(url: str):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)
            soup = BeautifulSoup(response.text, "html.parser")
            title = soup.title.string.strip() if soup.title else "No title"
            description = soup.find("meta", attrs={"name": "description"})
            if description and description.get("content"):
                description = description["content"].strip()
            else:
                description = "No description found"
            return {"title": title, "description": description}
    except Exception as e:
        return {"title": "Error", "description": str(e)}

@router.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    try:
        object_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    project = await db.projects.find_one({"_id": object_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.projects.delete_one({"_id": object_id})
    return {"message": "Project deleted successfully"}