from pydantic import BaseModel
from typing import List

class ChatSource(BaseModel):
    id: str
    headline: str
    summary: str
    publisher: str

class ChatRequest(BaseModel):
    query: str
    sources: List[ChatSource]

class ChatResponse(BaseModel):
    answer: str