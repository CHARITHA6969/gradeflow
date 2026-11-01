from pydantic import BaseModel, ConfigDict, Field, computed_field


class RubricCriterionScore(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    criterion_id: str = Field(min_length=1, max_length=80)
    criterion_name: str = Field(min_length=1, max_length=160)
    max_points: float = Field(gt=0, le=1000)
    earned_points: float = Field(ge=0, le=1000)


class RubricValidationRequest(BaseModel):
    criteria: list[RubricCriterionScore] = Field(min_length=1, max_length=100)
    declared_total: float = Field(ge=0, le=100000)


class RubricValidationResponse(BaseModel):
    valid: bool
    earned_total: float
    possible_total: float
    declared_total: float
    errors: list[str]

    @computed_field
    @property
    def percentage(self) -> float:
        if self.possible_total == 0:
            return 0.0
        return round((self.earned_total / self.possible_total) * 100, 2)
