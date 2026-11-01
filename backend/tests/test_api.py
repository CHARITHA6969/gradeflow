from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


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
