from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.auth import get_current_user, require_role
from app.core.database import get_db
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentRead
from app.services.assignments import create_assignment, list_assignments

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("", response_model=list[AssignmentRead])
def get_assignments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignments = list_assignments(db)
    if user.role == "student":
        return [item for item in assignments if item.status == "Active"]
    return assignments


@router.post("", response_model=AssignmentRead, status_code=status.HTTP_201_CREATED)
def post_assignment(
    payload: AssignmentCreate,
    user: User = Depends(require_role("instructor")),
    db: Session = Depends(get_db),
):
    return create_assignment(db, payload)
