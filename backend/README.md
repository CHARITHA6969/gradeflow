# GradeFlow API

A small FastAPI service that establishes a server-side foundation for GradeFlow's rubric-first assessment workflow.

## Quick start

Python 3.10+ is required.

```bash
cd backend
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload
```

- Health: http://127.0.0.1:8000/health
- OpenAPI docs: http://127.0.0.1:8000/docs
- Validate rubric: POST http://127.0.0.1:8000/api/v1/rubrics/validate

## Test

```bash
pytest
```

## API example

```json
{
  "criteria": [
    {"criterion_id": "analysis", "criterion_name": "Analysis", "max_points": 10, "earned_points": 8},
    {"criterion_id": "clarity", "criterion_name": "Clarity", "max_points": 5, "earned_points": 4}
  ],
  "declared_total": 12
}
```

The response reports whether the scores are internally consistent, the earned and possible totals, a percentage, and any validation errors.

## Current boundaries

This is an initial API foundation, not a production grading service. It does not yet include authentication, authorization, a database, student submissions, AI grading, or persistent audit history. The rubric endpoint performs deterministic validation only; it does not assess student work or generate grades. Add authorization and persistence before connecting real student records.
