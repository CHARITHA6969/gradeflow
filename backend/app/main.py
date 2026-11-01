from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.api.assignments import router as assignments_router

app = FastAPI(
    title="GradeFlow API",
    description="Rubric-first assessment workflow API with PostgreSQL-ready assignment persistence.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(assignments_router, prefix="/api/v1")


@app.get("/health", tags=["operations"])
def health_check() -> dict[str, str]:
    """Lightweight process health check for local development and deployment probes."""
    return {"status": "ok", "service": "gradeflow-api"}
