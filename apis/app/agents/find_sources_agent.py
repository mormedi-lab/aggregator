from agents import Agent, Runner, WebSearchTool
import os
import re

agent = Agent(
    name="FindSourcesAgent",
        instructions=(
        "You are an expert research assistant.\n"
        "Your job is to return **only a list of up to 10 URLs** that match the provided search query.\n"
        "- No summaries.\n"
        "- No commentary.\n"
        "- No markdown.\n"
        "- No list formatting (e.g., no bullets, numbers, or titles).\n"
        "- Output MUST be only raw URLs, one per line.\n\n"
        "If no relevant URLs are found, return an empty string."
    ),
    tools=[WebSearchTool()]
)

def extract_urls(text: str) -> list[str]:  # ✅ Add this
    return re.findall(r'https?://[^\s]+', text)

async def find_sources_from_prompt(search_prompt: str) -> list[str]:
    result = await Runner.run(agent, search_prompt)
    print(result.final_output)  # 👈 For debugging
    return extract_urls(result.final_output)
