from collections import Counter

from app.schemas.rubric import RubricValidationRequest, RubricValidationResponse


def validate_rubric(payload: RubricValidationRequest) -> RubricValidationResponse:
    errors: list[str] = []
    ids = [criterion.criterion_id for criterion in payload.criteria]
    names = [criterion.criterion_name.casefold() for criterion in payload.criteria]

    errors.extend(
        f"Duplicate criterion_id: {item}"
        for item, count in Counter(ids).items()
        if count > 1
    )
    errors.extend(
        f"Duplicate criterion_name: {item}"
        for item, count in Counter(names).items()
        if count > 1
    )

    for criterion in payload.criteria:
        if criterion.earned_points > criterion.max_points:
            errors.append(
                f"{criterion.criterion_name}: earned_points exceeds max_points"
            )

    earned_total = round(sum(item.earned_points for item in payload.criteria), 2)
    possible_total = round(sum(item.max_points for item in payload.criteria), 2)
    if round(payload.declared_total, 2) != earned_total:
        errors.append(
            f"declared_total ({payload.declared_total:g}) does not match "
            f"calculated earned total ({earned_total:g})"
        )

    return RubricValidationResponse(
        valid=not errors,
        earned_total=earned_total,
        possible_total=possible_total,
        declared_total=round(payload.declared_total, 2),
        errors=errors,
    )
