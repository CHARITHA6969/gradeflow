import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.api.assignments import router as assignments_router
from app.api.auth import router as auth_router
from app.api.routes import router as api_router
from app.api.submissions import router as submissions_router
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User

app = FastAPI(
    title="GradeFlow API",
    description="Authenticated rubric-first assessment workflow API.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(assignments_router, prefix="/api/v1")
app.include_router(submissions_router, prefix="/api/v1")


@app.on_event("startup")
def bootstrap_instructor():
    email = os.getenv("GRADEFLOW_INSTRUCTOR_EMAIL")
    password = os.getenv("GRADEFLOW_INSTRUCTOR_PASSWORD")
    if not email or not password:
        return
    db = SessionLocal()
    try:
        normalized_email = email.strip().lower()
        existing = db.scalar(select(User).where(User.email == normalized_email))
        if existing is None:
            db.add(User(email=normalized_email, password_hash=hash_password(password), role="instructor"))
            db.commit()
    finally:
        db.close()


@app.get("/health", tags=["operations"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "gradeflow-api"}
