from agents import Agent, Runner 
from typing import Dict

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
def build_user_input(form_answers: Dict[str, str]) -> str:
    return "\n".join([
        f"Benchmark Objective: {form_answers.get('objective', '')}",
        f"Target Companies: {form_answers.get('companies', '')}",
        f"Relevant Industries or Sectors: {form_answers.get('industries', '')}",
        f"Geographies or Markets of Focus: {form_answers.get('geographies', '')}",
        f"Time Frame: {form_answers.get('timeframe', '')}",
        f"Preferred Source Type: {form_answers.get('source_type', '')}",
    ])

# Generate the search query using the agent
async def generate_prompt(form_answers: Dict[str, str]) -> str:
    user_input = build_user_input(form_answers)
    result = await Runner.run(agent, user_input)
    return result.final_output
