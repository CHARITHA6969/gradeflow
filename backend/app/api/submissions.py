from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.auth import require_role
from app.core.database import get_db
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.models.user import User

router = APIRouter(tags=["submissions"])


class SubmissionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    content: str = Field(min_length=1, max_length=50000)


class SubmissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    assignment_id: int
    student_id: int
    content: str
    status: str
    submitted_at: datetime


@router.post("/assignments/{assignment_id}/submissions", response_model=SubmissionRead, status_code=status.HTTP_201_CREATED)
def submit_assignment(
    assignment_id: int,
    payload: SubmissionCreate,
    user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    assignment = db.get(Assignment, assignment_id)
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found.")
    if assignment.status != "Active":
        raise HTTPException(status_code=409, detail="This assignment is not accepting submissions.")
    submission = db.scalar(
        select(Submission).where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == user.id,
        )
    )
    if submission is None:
        submission = Submission(assignment_id=assignment_id, student_id=user.id, content=payload.content)
        db.add(submission)
    else:
        submission.content = payload.content
        submission.status = "Submitted"
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/submissions/mine", response_model=list[SubmissionRead])
def my_submissions(
    user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    return list(db.scalars(
        select(Submission).where(Submission.student_id == user.id).order_by(Submission.submitted_at.desc())
    ).all())


@router.get("/assignments/{assignment_id}/submissions", response_model=list[SubmissionRead])
def assignment_submissions(
    assignment_id: int,
    user: User = Depends(require_role("instructor")),
    db: Session = Depends(get_db),
):
    if db.get(Assignment, assignment_id) is None:
        raise HTTPException(status_code=404, detail="Assignment not found.")
    return list(db.scalars(
        select(Submission).where(Submission.assignment_id == assignment_id).order_by(Submission.submitted_at.desc())
    ).all())
