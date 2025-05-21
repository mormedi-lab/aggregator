from pydantic import BaseModel

class PromptInput(BaseModel):
    objective: str
    companies: str
    industries: str
    geographies: str
    timeframe: str
    source_type: str
