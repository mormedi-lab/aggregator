from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from app.models.benchmark import BenchmarkCreate
from app.config import neo4j_client

router = APIRouter()
driver = neo4j_client()

@router.post("/benchmark")
def save_benchmark(data: BenchmarkCreate = Body(...)):
    with driver.session() as session:
        session.run("""
            MATCH (p:Project {id: $project_id})
            SET 
                p.benchmark_objective = $objective,
                p.benchmark_companies = $companies,
                p.benchmark_industries = $industries,
                p.benchmark_geographies = $geographies,
                p.benchmark_timeframe = $timeframe,
                p.benchmark_source_type = $source_type
        """, **data.dict())
    return JSONResponse(content={"status": "saved"})


@router.get("/benchmark")
def get_project_benchmark(project_id: str):
    with driver.session() as session:
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
        if record and record["objective"]:
            return {k: record[k] for k in record.keys()}
        return {}
