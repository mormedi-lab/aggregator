from agents import Agent, Runner, WebSearchTool
from dotenv import load_dotenv

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

async def find_sources(prompt: str) -> list[str]:
    result = await Runner.run(find_sources_agent, prompt)

    # Try to extract URLs from the final output
    links = []
    if isinstance(result.final_output, str):
        for line in result.final_output.splitlines():
            if "http" in line:
                links.append(line.strip())

    # Optionally, extract from tool_uses if no links found yet
    if not links and hasattr(result, "tool_uses"):
        for tool_call in result.tool_uses:
            if tool_call.output and "http" in tool_call.output:
                links.append(tool_call.output.strip())

    return links

