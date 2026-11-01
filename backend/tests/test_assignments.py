import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import hash_password, issue_access_token
from app.main import app
from app.models.user import User

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def instructor_headers():
    db = TestingSessionLocal()
    user = User(
        email="instructor@example.edu",
        password_hash=hash_password("correct-horse-battery"),
        role="instructor",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = issue_access_token(user.id, user.role)
    db.close()
    return {"Authorization": f"Bearer {token}"}


def test_create_and_list_assignment_with_rubric(client):
    headers = instructor_headers()
    payload = {
        "title": "API design exercise",
        "description": "Build a documented REST API",
        "total_points": 20,
        "status": "Active",
        "criteria": [
            {"name": "Endpoint design", "max_points": 12},
            {"name": "Documentation", "max_points": 8},
        ],
    }
    created = client.post("/api/v1/assignments", json=payload, headers=headers)
    assert created.status_code == 201
    body = created.json()
    assert body["title"] == payload["title"]
    assert [c["name"] for c in body["criteria"]] == ["Endpoint design", "Documentation"]

    listed = client.get("/api/v1/assignments", headers=headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1
    assert listed.json()[0]["id"] == body["id"]


def test_invalid_assignment_is_rejected(client):
    response = client.post(
        "/api/v1/assignments",
        json={"title": "", "total_points": -2},
        headers=instructor_headers(),
    )
    assert response.status_code == 422
