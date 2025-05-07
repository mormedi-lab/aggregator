from openai import OpenAI

client = OpenAI()

def summarize_article(raw_text: str) -> str:
    system_prompt = (
        "You are a content summarizer. Write a concise 1–2 sentence summary "
        "of the following article. Focus on innovation, technology, or future trends. "
        "Keep it professional and relevant to decision makers."
    )

    result = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": raw_text[:2000]},
        ],
        temperature=0.7
    )

    return result.choices[0].message.content.strip()
