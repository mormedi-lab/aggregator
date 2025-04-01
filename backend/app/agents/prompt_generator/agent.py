import os
from typing import Dict
from dotenv import load_dotenv
from agents import Agent, Runner

load_dotenv()

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

def build_user_input(form_answers: Dict[str, str]) -> str:
    return "\n".join([
        f"Main Objective: {form_answers.get('q1', '')}",
        f"Topic Area: {form_answers.get('q2', '')}",
        f"Target Companies: {form_answers.get('q3', '')}",
        f"Insights Desired: {form_answers.get('q4', '')}",
        f"Benchmark Audience: {form_answers.get('q5', '')}",
        f"Relevant Industry: {form_answers.get('q6', '')}",
        f"Detail Level: {form_answers.get('q7', '')}",
        f"Geographies: {form_answers.get('q8', '')}",
        f"Time Frame: {form_answers.get('q9', '')}",
        f"Source Types: {form_answers.get('q10', '')}",
        f"Things to Avoid: {form_answers.get('q11', '')}",
    ])

async def generate_prompt(form_answers: Dict[str, str]) -> str:
    user_input = build_user_input(form_answers)
    result = await Runner.run(agent, user_input)
    return result.final_output
