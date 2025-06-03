from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResearchSpace(BaseModel):
    id: str
    project_id: str
    query: str
    search_type: str
    created_at: datetime

class CreateResearchSpaceRequest(BaseModel):
    query: str
    search_type: str

class ResearchSpaceResponse(BaseModel):
    id: str
    query: str
    search_type: str
    created_at: datetime
