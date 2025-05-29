from pydantic import BaseModel

class SummaryResponse(BaseModel):
    summary: str
    
class MetadataResponse(BaseModel):
    headline: str
    summary: str
    publisher: str