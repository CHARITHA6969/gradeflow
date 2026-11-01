from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import hash_password, issue_access_token
from app.main import app
from app.models.user import User

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def setup_function():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)


def create_user(email: str, role: str, password: str = "correct-horse-battery") -> tuple[User, str]:
    db = TestingSession()
    user = User(email=email, role=role, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = issue_access_token(user.id, user.role)
    db.close()
    return user, token


def auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_health_endpoint_returns_service_status():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "gradeflow-api"}


def test_rubric_validation_returns_transparent_total():
    response = client.post(
        "/api/v1/rubrics/validate",
        json={
            "criteria": [
                {"criterion_id": "analysis", "criterion_name": "Analysis", "max_points": 10, "earned_points": 8},
                {"criterion_id": "clarity", "criterion_name": "Clarity", "max_points": 5, "earned_points": 4},
            ],
            "declared_total": 12,
        },
    )
    assert response.status_code == 200
    assert response.json()["valid"] is True
    assert response.json()["earned_total"] == 12
    assert response.json()["possible_total"] == 15
    assert response.json()["percentage"] == 80


def test_rubric_validation_reports_duplicate_and_out_of_range_scores():
    response = client.post(
        "/api/v1/rubrics/validate",
        json={
            "criteria": [
                {"criterion_id": "same", "criterion_name": "Analysis", "max_points": 10, "earned_points": 11},
                {"criterion_id": "same", "criterion_name": "analysis", "max_points": 5, "earned_points": 2},
            ],
            "declared_total": 13,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["valid"] is False
    assert any("Duplicate criterion_id" in error for error in body["errors"])
    assert any("Duplicate criterion_name" in error for error in body["errors"])
    assert any("exceeds max_points" in error for error in body["errors"])


def test_request_schema_rejects_empty_criteria():
    response = client.post(
        "/api/v1/rubrics/validate",
        json={"criteria": [], "declared_total": 0},
    )
    assert response.status_code == 422


def test_assignments_require_authentication():
    response = client.get("/api/v1/assignments")
    assert response.status_code == 401


def test_student_cannot_create_assignments():
    _, token = create_user("student@example.edu", "student")
    response = client.post(
        "/api/v1/assignments",
        headers=auth(token),
        json={"title": "Forbidden assignment", "status": "Active"},
    )
    assert response.status_code == 403


def test_student_can_submit_active_assignment_and_read_own_submission():
    _, instructor_token = create_user("instructor@example.edu", "instructor")
    student, student_token = create_user("student@example.edu", "student")
    assignment = client.post(
        "/api/v1/assignments",
        headers=auth(instructor_token),
        json={"title": "API design", "description": "Build a REST API", "total_points": 100, "status": "Active"},
    )
    assert assignment.status_code == 201
    assignment_id = assignment.json()["id"]

    submitted = client.post(
        f"/api/v1/assignments/{assignment_id}/submissions",
        headers=auth(student_token),
        json={"content": "I implemented the API and documented its endpoints."},
    )
    assert submitted.status_code == 201
    assert submitted.json()["student_id"] == student.id
    assert submitted.json()["status"] == "Submitted"

    mine = client.get("/api/v1/submissions/mine", headers=auth(student_token))
    assert mine.status_code == 200
    assert len(mine.json()) == 1
    assert mine.json()[0]["assignment_id"] == assignment_id

    instructor_view = client.get(
        f"/api/v1/assignments/{assignment_id}/submissions",
        headers=auth(instructor_token),
    )
    assert instructor_view.status_code == 200
    assert instructor_view.json()[0]["content"].startswith("I implemented")


def test_student_cannot_read_other_students_submission_list():
    _, instructor_token = create_user("instructor@example.edu", "instructor")
    _, student_token = create_user("student@example.edu", "student")
    assignment = client.post(
        "/api/v1/assignments",
        headers=auth(instructor_token),
        json={"title": "API design", "status": "Active"},
    )
    response = client.get(
        f"/api/v1/assignments/{assignment.json()['id']}/submissions",
        headers=auth(student_token),
    )
    assert response.status_code == 403
