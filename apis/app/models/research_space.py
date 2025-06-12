from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.source import Sources

class ResearchSpace(BaseModel):
    id: str
    project_id: str
    query: str
    search_type: str
    created_at: datetime
    research_question: str
    industries: List[str]
    geographies: Optional[List[str]]
    timeframe: Optional[str]
    insight_style: Optional[str]
    additional_notes: Optional[str]
    space_title: Optional[str] = None

class CreateResearchSpaceRequest(BaseModel):
    search_type: str
    research_question: str
    industries: List[str]
    geographies: Optional[List[str]] = []
    timeframe: Optional[str] = ""
    insight_style: Optional[str] = ""
    additional_notes: Optional[str] = ""

class ResearchSpaceResponse(BaseModel):
    id: str
    query: str
    search_type: str
    created_at: datetime
    space_title: Optional[str] = None
