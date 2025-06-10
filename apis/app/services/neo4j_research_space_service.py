from neo4j import Transaction
from app.models.research_space import ResearchSpace
from app.models.source import Source, Sources

def create_research_space_node(tx: Transaction, project_id: str, space: ResearchSpace):
    query = """
    MATCH (p:Project {id: $project_id})
    CREATE (s:ResearchSpace {
        id: $id,
        query: $query,
        search_type: $search_type,
        created_at: $created_at
    })
    MERGE (p)-[:HAS_SPACE]->(s)
    """
    tx.run(query, {
        "project_id": project_id,
        "id": space.id,
        "query": space.query,
        "search_type": space.search_type,
        "created_at": space.created_at,
    })


def fetch_research_spaces_for_project(tx: Transaction, project_id: str):
    query = """
    MATCH (p:Project {id: $project_id})-[:HAS_SPACE]->(s:ResearchSpace)
    RETURN s.id AS id, s.query AS query, s.search_type AS search_type, s.created_at AS created_at
    ORDER BY s.created_at DESC
    """
    result = tx.run(query, {"project_id": project_id})
    return [ 
        {
            "id": record["id"],
            "query": record["query"],
            "search_type": record["search_type"],
            "created_at": record["created_at"],
        }
        for record in result
    ]

def fetch_single_research_space_by_id(tx: Transaction, space_id: str):
    query = """
    MATCH (s:ResearchSpace {id: $space_id})
    RETURN s.id AS id, s.query AS query, s.search_type AS search_type, s.created_at AS created_at
    """
    record = tx.run(query, {"space_id": space_id}).single()
    if not record:
        return None
    return {
        "id": record["id"],
        "query": record["query"],
        "search_type": record["search_type"],
        "created_at": record["created_at"],
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
