from fastapi import FastAPI
from app.api import example_router

app = FastAPI()

app.include_router(example_router.router)
