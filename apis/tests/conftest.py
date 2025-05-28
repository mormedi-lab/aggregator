import os
import sys

os.environ["NEO4J_URI"] = "bolt://localhost:7687"
os.environ["NEO4J_USERNAME"] = "neo4j"
os.environ["NEO4J_PASSWORD"] = "testpassword"
os.environ["OPENAI_API_KEY"] = "fake-openai-key"

basepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
if basepath not in sys.path:
    sys.path.append(basepath)
