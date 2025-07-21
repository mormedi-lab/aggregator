from agents import Agent, Runner, WebSearchTool
from pydantic import ValidationError
from typing import List
import re
import json
from app.models.source import Source, Sources

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
    - "full_text": (string) a longer paragraph or excerpt from the article that best explains its key insights. This should be a few paragraphs, not the entire article.

    Your response MUST be a single raw JSON array and must NOT include any additional text, commentary, markdown, explanation, or formatting.

    Do NOT wrap the output in ```json
    Do NOT explain what you're doing
    Do NOT introduce the list

    Return ONLY the JSON array as valid raw JSON.
    """
    ,
    tools=[WebSearchTool()]
)

MAX_FULLTEXT_CHARS = 2000

def try_recover_partial_json(raw_output: str) -> list:
    """
    Attempts to extract partial JSON array from a malformed string by:
    - Locating the array start (`[`)
    - Trying to parse each object individually
    """
    raw_output = raw_output.strip()
    potential_objs = re.findall(r"{.*?}", raw_output, flags=re.DOTALL)

    parsed_objects = []
    for i, raw_obj in enumerate(potential_objs):
        try:
            obj = json.loads(raw_obj)
            parsed_objects.append(obj)
        except json.JSONDecodeError as e:
            print(f"⚠️ Skipping malformed object #{i}: {e}")

    return parsed_objects

async def find_sources_from_prompt(search_prompt: str) -> List[Source]:
    result = await Runner.run(agent, search_prompt)
    raw_output = result.final_output
    print("\n📤 RAW AGENT OUTPUT:\n", raw_output)

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError as e:
        print("❌ JSON decode failed:", e)
        print("⚠️ Attempting partial recovery")
        parsed = try_recover_partial_json(raw_output)

    valid_sources = []
    for i, item in enumerate(parsed):
        try:
            # Trim full_text if too long
            if "full_text" in item and isinstance(item["full_text"], str):
                item["full_text"] = item["full_text"][:MAX_FULLTEXT_CHARS]

            source = Source.model_validate(item)
            valid_sources.append(source)

        except ValidationError as e:
            print(f"⚠️ Skipping malformed source #{i}: {e}")

    print(f"✅ Parsed {len(valid_sources)} valid sources out of {len(parsed)}")
    return valid_sources
