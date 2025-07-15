from openai import OpenAI
from typing import List
from app.models.source import Source
from textwrap import shorten

client = OpenAI()

def build_context_from_sources(sources: List[Source]) -> str:
    return "\n\n".join(
        f"[{i+1}] {s.headline} — {s.publisher}\n{shorten((s.full_text or s.summary).strip(), width=2000, placeholder='...')}"
        for i, s in enumerate(sources)
    )

def get_source_chat_response(user_message: str, sources: List[Source]) -> str:
    context = build_context_from_sources(sources)

    system_prompt = (
        "You are an expert research assistant. You can only answer using the sources provided below.  "
        "IMPORTANT: Do not make up any information, strictly use the sources to answer the question."
        "Cite the source numbers in your response using [#] format. If you don't know the answer, say so."
        "\n\nSources:\n"
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
