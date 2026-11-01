from fastapi import APIRouter

from app.schemas.rubric import RubricValidationRequest, RubricValidationResponse
from app.services.rubric import validate_rubric

router = APIRouter()


@router.post("/rubrics/validate", response_model=RubricValidationResponse, tags=["rubrics"])
def validate_rubric_scores(payload: RubricValidationRequest) -> RubricValidationResponse:
    """Validate criterion-level scores and return a transparent deterministic total."""
    return validate_rubric(payload)
