from fastapi import APIRouter, status, HTTPException
from app.config import SessionNeo4j
from app.agents.prompt_generator_agent import generate_prompt
from app.services.neo4j_research_space_service import (
    fetch_single_research_space_by_id,
    update_prompt_for_space
)
from app.models.research_space import ResearchSpace

router = APIRouter()

#CURRENTLY NOT USED
@router.post("/space/{space_id}/generate_prompt")
async def generate_prompt_for_space(session: SessionNeo4j, space_id: str):
    print(f"📥 HIT: /space/{space_id}/generate_prompt")
    # Fetch the full ResearchSpace node
    space = session.read_transaction(fetch_single_research_space_by_id, space_id)
    if not space:
        raise HTTPException(status_code=404, detail="Research space not found")

    # Use it to generate the prompt
    prompt = await generate_prompt(ResearchSpace(**space))
    print("🧠 GENERATED PROMPT:", prompt) 

    if not prompt:
        prompt = space.get("research_question", "")

    # Save the prompt back into the node
    session.write_transaction(update_prompt_for_space, space_id, prompt)

    return {"prompt": prompt}

