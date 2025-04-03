from agents import Agent, Runner, WebSearchTool
from dotenv import load_dotenv
import re 
import requests
from bs4 import BeautifulSoup

load_dotenv()

# Define the agent
find_sources_agent = Agent(
    name="FindSourcesAgent",
    instructions="""
You are a strategic research assistant that takes a well-scoped search prompt and finds high-quality, up-to-date online sources that match the search intent.

1. Use the web search tool to find relevant articles, reports, product pages, or press releases.
2. Your answer should only include a list of the top 5-7 source URLs, no summaries or explanations.
3. Do not include AI-generated or low-quality sources. Focus on credible information.
""",
    tools=[WebSearchTool()]
)

def extract_title_from_url(url: str) -> str:
    try:
        response = requests.get(url, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.content, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else "Untitled"
        return title
    except Exception:
        return "Untitled"

async def find_sources(prompt: str) -> list[dict[str, str]]:
    result = await Runner.run(find_sources_agent, prompt)

    url_pattern = r'https?://\S+'
    links = re.findall(url_pattern, result.final_output or "")

    if hasattr(result, "tool_uses"):
        for tool_call in result.tool_uses:
            if tool_call.output:
                links.extend(re.findall(url_pattern, tool_call.output))

    results = []
    for link in links:
        title = extract_title_from_url(link)
        results.append({"url": link, "title": title})

    return results


