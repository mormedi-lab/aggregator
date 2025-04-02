import os
from openai import OpenAI
from typing import List

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class FindSourcesAgent:
    def __init__(self, search_prompt: str):
        self.query = search_prompt

    def retrieve_sources(self) -> List[str]:
        # For now, just return a fake source list for testing
        print("🔎 Received search query:", self.query)
        return [
            "https://example.com/source-1",
            "https://example.com/source-2",
            "https://example.com/source-3",
        ]
