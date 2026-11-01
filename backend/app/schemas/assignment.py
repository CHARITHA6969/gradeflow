from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class CriterionCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    max_points: float = Field(gt=0, le=1000)


class AssignmentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = Field(default="", max_length=5000)
    due_date: date | None = None
    total_points: float = Field(default=100, gt=0, le=10000)
    status: str = Field(default="Draft", pattern="^(Draft|Active|Closed)$")
    criteria: list[CriterionCreate] = Field(default_factory=list, max_length=100)

    @model_validator(mode="after")
    def validate_rubric(self):
        normalized_names = [criterion.name.strip().casefold() for criterion in self.criteria]
        if len(normalized_names) != len(set(normalized_names)):
            raise ValueError("Rubric criterion names must be unique.")
        rubric_points = sum(criterion.max_points for criterion in self.criteria)
        if rubric_points > self.total_points:
            raise ValueError("Rubric criterion points cannot exceed the assignment total.")
        return self


class CriterionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    max_points: float


class AssignmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    due_date: date | None
    total_points: float
    status: str
    created_at: datetime
    criteria: list[CriterionRead]
