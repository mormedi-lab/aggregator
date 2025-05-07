from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.routes.project_routes import router as project_router
from app.routes.benchmark_routes import router as benchmark_router
from app.routes.prompt_routes import router as prompt_router
from app.routes.source_routes import router as source_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router)
app.include_router(benchmark_router)
app.include_router(prompt_router)
app.include_router(source_router)


