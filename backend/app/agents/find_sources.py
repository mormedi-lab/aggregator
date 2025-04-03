from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class FindSourcesAgent:
    def __init__(self, search_prompt: str):
        self.prompt = search_prompt

    def run(self) -> list:
        thread = client.beta.threads.create()
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=self.prompt
        )

        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=os.getenv("FIND_SOURCES_ASSISTANT_ID")  # Set this ID in .env
        )

        # Optional: poll for completion (simple loop here, but can improve later)
        import time
        while True:
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            if run.status == "completed":
                break
            time.sleep(1)

        messages = client.beta.threads.messages.list(thread_id=thread.id)
        sources = []

        for message in messages.data:
            for content in message.content:
                if content.type == "text":
                    sources.append(content.text.value)

        return sources
