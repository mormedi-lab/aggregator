# routes/chat_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI  # or whatever LLM you want

from app.models.chat import ChatRequest, ChatResponse

router = APIRouter()
client = OpenAI()  # Automatically uses your OPENAI_API_KEY from env

@router.post("/ask_sources", response_model=ChatResponse)
async def ask_sources(request: ChatRequest) -> ChatResponse:
    try:
        print("🔍 Received query:", request.query)
        print("📚 Received sources:", [s.dict() for s in request.sources])

        clean_sources = [
            s for s in request.sources
            if s.publisher and s.headline and s.summary
        ]

        if not clean_sources:
            raise HTTPException(status_code=400, detail="No valid sources provided.")

        context = "\n\n".join(
            [f"[{s.publisher}] {s.headline}: {s.summary}" for s in clean_sources]
        )

        prompt = f"""Use the following sources to answer the user's question.

{context}

User question: {request.query}"""

        print("🧠 Final Prompt:\n", prompt)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful research assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=400,
        )

        answer = response.choices[0].message.content
        return ChatResponse(answer=answer)

    except Exception as e:
        print("❌ Error occurred:", str(e))
        raise HTTPException(status_code=500, detail=f"LLM call failed: {str(e)}")
