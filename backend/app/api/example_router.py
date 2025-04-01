from fastapi import APIRouter
from app.models.project import ProjectCreate
from app.db import db

router = APIRouter()

@router.post("/projects")
async def create_project(project: ProjectCreate):
    result = await db.projects.insert_one(project.dict())
    return {"_id": str(result.inserted_id)}

