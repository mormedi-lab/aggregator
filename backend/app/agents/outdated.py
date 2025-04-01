import os
from dotenv import load_dotenv
from typing import Dict
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class PromptGeneratorAgent:
    def __init__(self, form_answers: Dict[str, str]):
        self.answers = form_answers

    def _build_system_prompt(self) -> str:
        return (
           """
            You are an AI agent that generates highly optimized search engine queries to retrieve strategic, relevant sources for industry benchmarks.

            You are given a user’s answers to a detailed benchmark questionnaire. Your job is to generate **one high-performance search prompt** that will return the most relevant results from a web search engine.

            🎯 Search Query Optimization Instructions:
            - Include exact company names, industry terms, and specific technologies or topics from the answers.
            - Include time constraints (e.g. “2020..2024” or “last 5 years”).
            - Include geography constraints (e.g. "Europe" or "-site:us").
            - Use specific search operators when helpful (e.g. `intitle:`, `site:`, `filetype:pdf`, `inurl:`).
            - Include desirable source types: `"case study" OR "whitepaper" OR "press release" OR "product launch"`
            - Exclude noisy or low-quality sources: `-site:medium.com -site:quora.com -AI generated`
            - Avoid vague terms like “overview” or “general info”.
            - Do NOT include any natural-sounding filler. The output must be a high-precision search query, not a sentence.

            Respond only with the final search query.
            """
        )

    def _build_user_message(self) -> str:
        formatted = []
        for i in range(1, 12):
            answer = self.answers.get(f"q{i}")
            if answer:
                formatted.append(f"{i}. {answer}")
        return "\n".join(formatted)

    def generate_prompt(self) -> str:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": self._build_system_prompt()},
                {"role": "user", "content": self._build_user_message()},
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

