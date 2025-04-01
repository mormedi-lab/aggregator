from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://<db_username>:momedi2025@aggregator.2e8zqb4.mongodb.net/?retryWrites=true&w=majority&appName=Aggregator")
MONGO_DB_NAME = "aggregator"

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]
