from pydantic import BaseModel
from typing import List, Optional

class PromptInput(BaseModel):
    research_question: str
    industries: List[str]
    geographies: Optional[List[str]] = []
    timeframe: Optional[str] = ""
    insight_style: Optional[str] = ""
    additional_notes: Optional[str] = ""


