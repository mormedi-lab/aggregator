from openai import OpenAI
from typing import List
from app.models.source import Source

client = OpenAI()

def build_context_from_sources(sources: List[Source]) -> str:
    context_blocks = []
    for i, s in enumerate(sources):
        text = (s.full_text or s.summary).strip()
        context_blocks.append(f"{s.headline} — {s.publisher}\n{text[:2000]}...")
    return "\n\n".join(context_blocks)

def get_source_chat_response(user_message: str, sources: List[Source]) -> str:
    context = build_context_from_sources(sources)

    system_prompt = (
        "You are an expert research assistant. "
        "IMPORTANT: Do not make up any information, strictly use the sources to answer the question. "
        "IMPORTANT: Do not use any other sources than the ones provided below. "
        "Format your response with clear line breaks, bullet points, and bold text where helpful. "
        "Keep your response clean and readable: use **at most one line break between sections**, and avoid extra whitespace."
        "Sources:\n"
        f"{context}"
    )

    result = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0.7
    )

    return result.choices[0].message.content.strip()
