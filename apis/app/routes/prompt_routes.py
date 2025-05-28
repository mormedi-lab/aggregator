from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.config import SessionNeo4j
from app.agents.prompt_generator_agent import generate_prompt

router = APIRouter()


@router.get("/prompt_context")
def get_prompt_context(session: SessionNeo4j, project_id: str):
    result = session.run("""
        MATCH (p:Project {id: $project_id})
        RETURN 
            p.title AS title,
            p.objective AS project_objective,
            p.industry AS industry,
            p.benchmark_objective AS benchmark_objective,
            p.benchmark_companies AS companies,
            p.benchmark_industries AS benchmark_industries,
            p.benchmark_geographies AS geographies,
            p.benchmark_timeframe AS timeframe,
            p.benchmark_source_type AS source_type
    """, project_id=project_id)
    record = result.single()
    if not record:
        return JSONResponse(content={"error": "Project not found"}, status_code=404)
    return {k: record[k] for k in record.keys()}


@router.get("/generate_prompt")
async def generate_prompt_route(session: SessionNeo4j, project_id: str):
    result = session.run("""
        MATCH (p:Project {id: $project_id})
        RETURN 
            p.benchmark_objective AS objective,
            p.benchmark_companies AS companies,
            p.benchmark_industries AS industries,
            p.benchmark_geographies AS geographies,
            p.benchmark_timeframe AS timeframe,
            p.benchmark_source_type AS source_type
    """, project_id=project_id)

    record = result.single()
    if not record:
        return JSONResponse(content={"error": "Project not found"}, status_code=404)

    form_answers = {k: record[k] or "" for k in record.keys()}  # fill None with ""
    prompt = await generate_prompt(form_answers)
    return {"prompt": prompt}
