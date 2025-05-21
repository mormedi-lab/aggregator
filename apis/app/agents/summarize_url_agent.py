from openai import OpenAI
from typing import Optional
from app.models.summary import SummaryResponse

client = OpenAI()

def summarize_article(raw_text: str) -> Optional[str]:
    system_prompt = (
        "You are a content summarizer. Write a concise 1–2 sentence summary "
        "of the following article. Focus on innovation, technology, or future trends. "
        "Keep it professional and relevant to decision makers."
    )

    try:
        result = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_text[:2000]},
            ],
            temperature=0.7
        )

        content = result.choices[0].message.content.strip()
        return SummaryResponse(summary=content).summary

    except Exception as e:
        print("❌ Error in summarize_article:", e)
        return None