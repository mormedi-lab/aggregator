# app/routes/source_routes.py
from fastapi import APIRouter
from app.agents.find_sources_agent import find_sources_from_prompt
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.get("/find_sources")
async def get_sources(search_prompt: str):
    try:
        sources = await find_sources_from_prompt(search_prompt)
        return {"sources": sources}
    except Exception as e:
        return {"error": str(e)}
