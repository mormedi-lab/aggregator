from pydantic import BaseModel
from typing import Optional, List

class ProjectCreate(BaseModel):
    title: str
    industry: str
    objective: str

class Project(ProjectCreate):
    id: str
    last_accessed: Optional[str] = None

class ProjectUpdate(ProjectCreate):
    id: str

class Projects(BaseModel):
    projects: List[Project]