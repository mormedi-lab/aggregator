from agents import Agent, Runner, WebSearchTool
import os
import re
import json

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

async def find_sources_from_prompt(search_prompt: str) -> list[dict]:
    result = await Runner.run(agent, search_prompt)
    raw_output = result.final_output

    print("\n📤 RAW AGENT OUTPUT:\n", raw_output)

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError as e:
        print("Failed to parse full JSON. Attempting fallback.\nError:", e)
        
        match = re.search(r'\[\s*{.*?}\s*\]', raw_output, re.DOTALL)
        if match:
            try:
                print("\n🧪 Extracted fallback JSON:\n", match.group(0))
                return json.loads(match.group(0))
            except json.JSONDecodeError as e:
                print("Fallback array also failed:", e)

        return []
