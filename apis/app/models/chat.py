from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    role: str 
    content: str


class ChatRequest(BaseModel):
    project_id: str
    space_ids: List[str]
    user_message: str


class ChatResponse(BaseModel):
    answer: str
