from agents import Agent, Runner 
from app.models.prompt import PromptInput

# Create your agent using the SDK
agent = Agent(
    name="PromptGenerator",
    instructions=(
        "You are a strategy consultant that transforms benchmark scoping answers into highly targeted and effective web search queries. "
        "Your goal is to produce a search string that retrieves relevant, insightful, and recent sources. "
        "The query must reflect the benchmark’s goal, topic, companies, insights needed, and constraints like geography, time frame, or source type. "
        "Format your output as a **single line search string** that includes advanced operators where relevant (e.g. intitle:, site:, quotes, OR). "
        "Do NOT explain the query. Just return the final search string."
    )
)

# Format form responses into structured input
def build_user_input(data: PromptInput) -> str:
    return "\n".join([
        f"Main Research Question: {data.research_question}",
        f"Relevant Industries: {', '.join(data.industries)}",
        f"Geographies or Markets: {', '.join(data.geographies) if data.geographies else 'None'}",
        f"Time Frame: {data.timeframe or 'Any'}",
        f"Ideal Insights: {data.insight_style or 'Any'}",
        f"Additional Context: {data.additional_notes or 'None'}",
    ])

# Generate the search query using the agent
async def generate_prompt(data: PromptInput) -> str:
    user_input = build_user_input(data)
    result = await Runner.run(agent, user_input)
    return result.final_output
