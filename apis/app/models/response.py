from pydantic import BaseModel
from typing import Optional

class StatusResponse(BaseModel):
    status: str
    message: str
    source_id: Optional[str] = None  

class ProjectStatusResponse(BaseModel):
    status: str
    id: Optional[str] = None
