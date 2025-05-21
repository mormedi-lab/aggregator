from agents import Agent, Runner, WebSearchTool
from pydantic import ValidationError
from typing import List
import re
import json
from app.models.source import Source, Sources

# Define the agent
agent = Agent(
    name="FindSourcesAgent",
    instructions="""
    You are an expert web researcher.

    Your only task is to return exactly 5 to 10 structured sources in the following strict JSON format:

    Each object in the array must contain:
    - "headline": (string) the title of the article
    - "publisher": (string) the source (e.g. Financial Times, arXiv, Wired)
    - "summary": (string) a 1–2 sentence explanation of why the article is relevant
    - "date_published": (string) in YYYY-MM-DD format
    - "url": (string) a direct link to the article

    Your response MUST be a single raw JSON array and must NOT include any additional text, commentary, markdown, explanation, or formatting.

    Do NOT wrap the output in ```json
    Do NOT explain what you're doing
    Do NOT introduce the list

    Return ONLY the JSON array as valid raw JSON.
    """
    ,
    tools=[WebSearchTool()]
)

async def find_sources_from_prompt(search_prompt: str) -> List[Source]:
    result = await Runner.run(agent, search_prompt)
    raw_output = result.final_output
    print("\n📤 RAW AGENT OUTPUT:\n", raw_output)

    try:
        parsed = json.loads(raw_output)
        return Sources.model_validate({"sources": parsed}).sources
    except (json.JSONDecodeError, ValidationError) as e:
        print("❌ Initial parse or validation failed:", e)

        match = re.search(r'\[\s*{.*?}\s*\]', raw_output, re.DOTALL)
        if match:
            try:
                fallback = json.loads(match.group(0))
                print("\n🧪 Extracted fallback JSON:\n", fallback)
                return Sources.model_validate({"sources": fallback}).sources
            except (json.JSONDecodeError, ValidationError) as fallback_e:
                print("❌ Fallback validation also failed:", fallback_e)

    return []