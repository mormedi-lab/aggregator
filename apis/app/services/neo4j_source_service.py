import uuid
from app.models.source import Source
from neo4j import Session, Transaction
from typing import List

def create_sources_for_space(tx: Transaction, space_id: str, sources: list[Source]) -> None:
    for source in sources:
        tx.run(
            """
            MATCH (s:ResearchSpace {id: $space_id})
            CREATE (src:Source {
                id: $id,
                publisher: $publisher,
                headline: $headline,
                url: $url,
                summary: $summary,
                full_text: $full_text,
                is_trusted: $is_trusted,
                date_published: $date_published
            })
            MERGE (s)-[:HAS_SOURCE]->(src)
            """,
            space_id=space_id,
            id=source.id or str(uuid.uuid4()),
            publisher=source.publisher,
            headline=source.headline,
            url=source.url,
            summary=source.summary or "No summary available",
            full_text=source.full_text or "No full text available",
            is_trusted=source.is_trusted or False,
            date_published=source.date_published or "2025-01-01"
)

def fetch_sources_for_space(tx: Transaction, space_id: str, project_id: str):
    query = """
    MATCH (s:ResearchSpace {id: $space_id})-[:HAS_SOURCE]->(src:Source)
    OPTIONAL MATCH (p:Project {id: $project_id})-[:INCLUDES]->(src)
    RETURN 
        src.id AS id,
        src.publisher AS publisher,
        src.headline AS headline,
        src.url AS url,
        src.summary AS summary,
        src.full_text AS full_text,
        src.is_trusted AS is_trusted,
        src.date_published AS date_published,
        COUNT(p) > 0 AS is_in_project
    ORDER BY src.date_published DESC
    """
    result = tx.run(query, {"space_id": space_id, "project_id": project_id})
    return [record.data() for record in result]

def create_link_to_project(tx, project_id: str, source_id: str):
    query = """
    MATCH (p:Project {id: $project_id}), (s:Source {id: $source_id})
    MERGE (p)-[:INCLUDES]->(s)
    """
    tx.run(query, {"project_id": project_id, "source_id": source_id})