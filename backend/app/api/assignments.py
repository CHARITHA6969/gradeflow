from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.assignment import AssignmentCreate, AssignmentRead
from app.services.assignments import create_assignment, list_assignments

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("", response_model=list[AssignmentRead])
def get_assignments(db: Session = Depends(get_db)):
    return list_assignments(db)


@router.post("", response_model=AssignmentRead, status_code=status.HTTP_201_CREATED)
def post_assignment(payload: AssignmentCreate, db: Session = Depends(get_db)):
    return create_assignment(db, payload)
