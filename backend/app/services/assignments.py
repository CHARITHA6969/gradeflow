from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.assignment import Assignment, RubricCriterion
from app.schemas.assignment import AssignmentCreate


def list_assignments(
    db: Session,
    *,
    instructor_id: int | None = None,
    active_only: bool = False,
) -> list[Assignment]:
    statement = (
        select(Assignment)
        .options(selectinload(Assignment.criteria))
        .order_by(Assignment.created_at.desc())
    )
    if instructor_id is not None:
        statement = statement.where(Assignment.instructor_id == instructor_id)
    if active_only:
        statement = statement.where(Assignment.status == "Active")
    return list(db.scalars(statement).all())


def create_assignment(
    db: Session,
    payload: AssignmentCreate,
    *,
    instructor_id: int,
) -> Assignment:
    assignment = Assignment(
        instructor_id=instructor_id,
        title=payload.title,
        description=payload.description,
        due_date=payload.due_date,
        total_points=payload.total_points,
        status=payload.status,
        criteria=[
            RubricCriterion(name=item.name, max_points=item.max_points, position=index)
            for index, item in enumerate(payload.criteria)
        ],
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
