from fastapi import FastAPI
from app.api import example_router  # you'll create this next

app = FastAPI()

app.include_router(example_router.router)
