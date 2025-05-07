from pydantic import BaseModel
from typing import Optional

class BenchmarkCreate(BaseModel):
    project_id: str
    objective: str
    companies: str
    industries: str
    geographies: str
    timeframe: str
    source_type: str
