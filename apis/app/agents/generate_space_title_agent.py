from agents import Agent, Runner

# Define the agent
agent = Agent(
    name="GenerateSpaceTitleAgent",
    instructions="""
        You will be given a search query that contains keywords, filters, and logic operators. 
        Your task is to rewrite it as a **clean, clear, and concise English title** that could 
        appear as the name of a research topic.

        The title should:
        - Be short (max 10 words)
        - Use natural language
        - Include relevant themes or sectors (e.g. 'retail', 'banking')
        - Mention geography or audience if present (e.g. 'in the US', 'for Gen Z')
        - Not include raw operators (like site:.com, OR, etc.)

        ### Example 1
        Query: "climate adaptation" OR "coastal cities" site:.gov OR site:.edu
        Title: Climate Adaptation Strategies for Coastal Cities

        ### Example 2
        Query: “fintech innovation” Gen Z OR Millennials Europe site:.com
        Title: Fintech Innovation for Young Adults in Europe
    """
)

# Generate the title from a search query
async def generate_space_title(query: str) -> str:
    result = await Runner.run(agent, query)
    return result.final_output.strip().strip('"')
