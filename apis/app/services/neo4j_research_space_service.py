from neo4j import Transaction
from app.models.research_space import ResearchSpace
from app.models.source import Source, Sources

def create_research_space_node(tx, project_id: str, space):
    query = """
    MATCH (p:Project {id: $project_id})
    CREATE (s:ResearchSpace {
        id: $id,
        project_id: $project_id,
        query: $search_query,
        search_type: $search_type,
        created_at: $created_at,
        research_question: $research_question,
        industries: $industries,
        geographies: $geographies,
        timeframe: $timeframe,
        insight_style: $insight_style,
        additional_notes: $additional_notes,
        space_title: $space_title
    })
    MERGE (p)-[:HAS_SPACE]->(s)
    RETURN s
    """

    tx.run(
        query,
        project_id=project_id,
        id=space["id"],
        search_query=space["query"],
        search_type=space["search_type"],
        created_at=space["created_at"],
        research_question=space["research_question"],
        industries=space["industries"],
        geographies=space["geographies"],
        timeframe=space["timeframe"],
        insight_style=space["insight_style"],
        additional_notes=space["additional_notes"],
        space_title=space["space_title"],
    )


def fetch_research_spaces_for_project(tx: Transaction, project_id: str):
    query = """
    MATCH (p:Project {id: $project_id})-[:HAS_SPACE]->(s:ResearchSpace)
    RETURN 
        s.id AS id, 
        s.query AS query, 
        s.search_type AS search_type, 
        s.created_at AS created_at,
        s.space_title AS space_title
    ORDER BY s.created_at DESC
    """
    result = tx.run(query, {"project_id": project_id})
    return [ 
        {
            "id": record["id"],
            "query": record["query"] or "",
            "search_type": record["search_type"],
            "created_at": record["created_at"].to_native() if hasattr(record["created_at"], "to_native") else record["created_at"],
            "space_title": record["space_title"] or "",
        }
        for record in result
    ]

def fetch_single_research_space_by_id(tx: Transaction, space_id: str):
    query = """
    MATCH (s:ResearchSpace {id: $space_id})
    RETURN 
        s.id AS id,
        s.project_id AS project_id,
        s.query AS query,
        s.search_type AS search_type,
        s.created_at AS created_at,
        s.research_question AS research_question,
        s.industries AS industries,
        s.geographies AS geographies,
        s.timeframe AS timeframe,
        s.insight_style AS insight_style,
        s.additional_notes AS additional_notes,
        s.space_title AS space_title
    """
    record = tx.run(query, {"space_id": space_id}).single()
    if not record:
        return None

    # Convert created_at to a Python datetime
    created_at = record.get("created_at")
    if hasattr(created_at, "to_native"):
        created_at = created_at.to_native()

    return {
        **{key: record.get(key) for key in record.keys() if key != "created_at"},
        "created_at": created_at
    }

def delete_research_space_and_sources(tx: Transaction, space_id: str) -> bool:
    query = """
    MATCH (space:ResearchSpace {id: $space_id})
    OPTIONAL MATCH (space)-[:HAS_SOURCE]->(source:Source)
    DETACH DELETE space, source
    RETURN COUNT(space) > 0 AS deleted
    """
    result = tx.run(query, space_id=space_id).single()
    return result["deleted"]

def fetch_project_sources_for_space(tx, project_id: str, space_id: str) -> Sources:
    query = """
    MATCH (p:Project {id: $project_id})-[:INCLUDES]->(s:Source)<-[:HAS_SOURCE]-(rs:ResearchSpace {id: $space_id})
    RETURN s
    """
    result = tx.run(query, project_id=project_id, space_id=space_id)
    sources = [Source(**record["s"]) for record in result]
    return Sources(sources=sources)

def update_prompt_for_space(tx: Transaction, space_id: str, prompt: str):
    query = """
    MATCH (s:ResearchSpace {id: $space_id})
    SET s.query = $prompt
    RETURN s
    """
    tx.run(query, {"space_id": space_id, "prompt": prompt})
