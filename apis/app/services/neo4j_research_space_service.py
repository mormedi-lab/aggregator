from neo4j import Transaction
from app.models.research_space import ResearchSpace

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




