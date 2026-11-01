from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.assignment import Assignment, RubricCriterion
from app.schemas.assignment import AssignmentCreate


def list_assignments(db: Session) -> list[Assignment]:
    statement = select(Assignment).options(selectinload(Assignment.criteria)).order_by(Assignment.created_at.desc())
    return list(db.scalars(statement).all())


def create_assignment(db: Session, payload: AssignmentCreate) -> Assignment:
    assignment = Assignment(
        title=payload.title.strip(),
        description=payload.description.strip(),
        due_date=payload.due_date,
        total_points=payload.total_points,
        status=payload.status,
        criteria=[
            RubricCriterion(name=item.name.strip(), max_points=item.max_points, position=index)
            for index, item in enumerate(payload.criteria)
        ],
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
