from fastapi import FastAPI

from app.api.routes import router as api_router

app = FastAPI(
    title="GradeFlow API",
    description="Rubric-first assessment workflow API. Prototype; no authentication or persistence yet.",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["operations"])
def health_check() -> dict[str, str]:
    """Lightweight process health check for local development and deployment probes."""
    return {"status": "ok", "service": "gradeflow-api"}
