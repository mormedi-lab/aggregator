from app.models.source import Source
from neo4j import Session
from typing import List

def create_source_node(tx: Session, project_id: str, source: Source) -> None:
    tx.run(
        """
        MATCH (p:Project {id: $project_id})
        CREATE (s:Source {
            id: randomUUID(),
            publisher: $publisher,
            headline: $headline,
            url: $url,
            summary: $summary,
            is_curated: $is_curated
        })
        CREATE (p)-[:HAS_SOURCE]->(s)
        """,
        project_id=project_id,
        publisher=source.publisher,
        headline=source.headline,
        url=source.url,
        summary=source.summary,
        is_curated=source.is_curated
    )

def fetch_sources_for_project(tx: Session, project_id: str) -> List[dict]:
    result = tx.run(
        """
        MATCH (p:Project {id: $project_id})-[:HAS_SOURCE]->(s:Source)
        RETURN 
            s.id AS id, 
            s.publisher AS publisher,
            s.headline AS headline, 
            s.url AS url, 
            coalesce(s.summary, "") AS summary,
            coalesce(s.is_curated, false) AS is_curated
        """,
        project_id=project_id
    )
    return [record.data() for record in result]

def link_source_to_library(tx: Session, project_id: str, source_id: str) -> None:
    tx.run(
        """
        MATCH (p:Project {id: $project_id}), (s:Source {id: $source_id})
        MERGE (p)-[:IS_IN_LIBRARY]->(s)
        """,
        project_id=project_id,
        source_id=source_id
    )

def fetch_project_library(tx: Session, project_id: str) -> List[dict]:
    result = tx.run(
        """
        MATCH (p:Project {id: $project_id})-[:IS_IN_LIBRARY]->(s:Source)
        RETURN 
            s.id AS id, 
            s.headline AS headline,
            s.publisher AS publisher,
            s.url AS url,
            coalesce(s.summary, "") AS summary,
            coalesce(s.is_curated, false) AS is_curated
        """,
        project_id=project_id
    )
    return [record.data() for record in result]

def unlink_source_from_library(tx: Session, project_id: str, source_id: str) -> None:
    tx.run(
        """
        MATCH (p:Project {id: $project_id})-[r:IS_IN_LIBRARY]->(s:Source {id: $source_id})
        DELETE r
        """,
        project_id=project_id,
        source_id=source_id
    )

def create_curated_source_node_and_link(tx: Session, project_id: str, source_id: str, source: dict) -> None:
    tx.run(
        """
        MATCH (p:Project {id: $project_id})
        CREATE (s:Source {
            id: $source_id,
            publisher: $publisher,
            headline: $headline,
            url: $url,
            summary: $summary,
            is_curated: true
        })
        CREATE (p)-[:HAS_SOURCE]->(s)
        CREATE (p)-[:IS_IN_LIBRARY]->(s)
        """,
        project_id=project_id,
        source_id=source_id,
        publisher=source.get("publisher", "unknown"),
        headline=source.get("headline", "Untitled"),
        url=source.get("url", ""),
        summary=source.get("summary", "Invalid source")
    )
