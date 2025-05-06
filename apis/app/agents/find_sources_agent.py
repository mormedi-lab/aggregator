from agents import Agent, Runner, WebSearchTool
import os
import re
import json

# Define the agent
agent = Agent(
    name="FindSourcesAgent",
    instructions="""
    You are an expert web researcher. Your task is to use the provided search query to return exactly 5–10 relevant sources in JSON format.

    Each item must be a JSON object with the following keys:
    - "headline" (string): Title of the article or report
    - "publisher" (string): Publisher or website
    - "summary" (string): 1–2 sentence explanation of relevance
    - "date_published" (string): YYYY-MM-DD
    - "url" (string): Direct link

    Your entire output must be a single valid JSON array (not markdown, not text, not wrapped in ```json). Do not include any explanations, prose, or commentary.

    Example:
    [
    {
        "headline": "Chase UK tops customer satisfaction survey",
        "publisher": "Financial Times",
        "summary": "A 2024 FT report highlighting Chase UK's leading NPS score in the UK retail banking sector.",
        "date_published": "2024-06-21",
        "url": "https://www.ft.com/content/example"
    },
    ...
    ]

    Return only the JSON array. Do not add any headers, markdown formatting, bullet points, or additional text.
    """
    ,
    tools=[WebSearchTool()]
)

async def find_sources_from_prompt(search_prompt: str) -> list[dict]:
    result = await Runner.run(agent, search_prompt)
    raw_output = result.final_output

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        print("❌ Failed to parse source results as JSON.\nRAW OUTPUT:\n", raw_output)
        return []