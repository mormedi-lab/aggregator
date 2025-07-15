from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    project_id: str
    user_message: str

class ChatResponse(BaseModel):
    answer: str
    citations: List[str]  # list of source IDs or headlines
