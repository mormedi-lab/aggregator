"""Configuration for the application. Includes Neo4j client."""
import os
from typing import Annotated

from fastapi import Depends
from neo4j import GraphDatabase, Session
from neo4j import Driver
from dotenv import load_dotenv
from pathlib import Path

# Load from absolute path using pathlib
env_path = Path(__file__).parent.parent / "conf" / ".env"
load_dotenv(dotenv_path=env_path)


def load_conf(key: str):
    """
    Load the configuration from the environment variable.
    :param key: The key of the configuration.
    :return: The value of the configuration.
    """
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Configuration {key} not found in the environment variables.")
    return value


def get_neo4j_session():
    """
    Create a Neo4j client.
    :return: The Neo4j driver.
    """
    # Neo4j config
    uri = load_conf("NEO4J_URI")
    user = load_conf("NEO4J_USERNAME")
    password = load_conf("NEO4J_PASSWORD")

    print("✅ Connecting to Neo4j at", uri, "with user", user)

    # TODO: replace by logging
    print(f"# Neo4j URI: {uri}")
    # runs queries against the graph DB
    driver = GraphDatabase.driver(uri, auth=(user, password))

    with driver.session() as session:
        yield session


SessionNeo4j = Annotated[Session, Depends(get_neo4j_session)]
