from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.routes.project_routes import router as project_router
from app.routes.benchmark_routes import router as benchmark_router
from app.routes.prompt_routes import router as prompt_router
from app.routes.source_routes import router as source_router

# Load from absolute path using pathlib
env_path = Path(__file__).parent.parent / "conf" / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router)
app.include_router(benchmark_router)
app.include_router(prompt_router)
app.include_router(source_router)


