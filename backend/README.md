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
# Start PostgreSQL in another terminal: docker compose up -d db
# Set DATABASE_URL as shown below, then apply migrations:
alembic upgrade head
uvicorn app.main:app --reload
```

- Health: http://127.0.0.1:8000/health
- OpenAPI docs: http://127.0.0.1:8000/docs
- Validate rubric: POST http://127.0.0.1:8000/api/v1/rubrics/validate
- List assignments: GET http://127.0.0.1:8000/api/v1/assignments
- Create assignment: POST http://127.0.0.1:8000/api/v1/assignments

## PostgreSQL and migrations

Start the local database from this directory:

```bash
docker compose up -d db
```

Configure the backend connection string before starting the API:

```bash
# PowerShell
$env:DATABASE_URL="postgresql+psycopg://gradeflow:gradeflow_dev@localhost:5432/gradeflow"
# macOS/Linux
export DATABASE_URL="postgresql+psycopg://gradeflow:gradeflow_dev@localhost:5432/gradeflow"
export CORS_ORIGINS="http://localhost:3000"
export GRADEFLOW_SECRET_KEY="replace-with-a-long-random-secret"
export GRADEFLOW_INSTRUCTOR_EMAIL="instructor@your-university.edu"
export GRADEFLOW_INSTRUCTOR_PASSWORD="use-a-unique-password-of-12-or-more-characters"
export GRADEFLOW_STUDENT_SIGNUP_CODE="issue-a-private-registration-code"
```

Apply the versioned schema and inspect migration state:

```bash
alembic upgrade head
alembic current
```

The migrations create assignments, rubric criteria, user accounts, and student submissions. SQLite remains the default for lightweight local tests; production deployments should use managed PostgreSQL and secure credentials. Set `CORS_ORIGINS` to a comma-separated allowlist of trusted frontend origins.

## Authentication and student submissions

Set the environment variables shown above before starting the API. On startup, the service creates the initial instructor account if the configured email does not already exist. Keep the instructor password, signing secret, and student signup code out of source control. Students can register through `POST /api/v1/auth/register` with the private signup code; instructor accounts are not self-registerable. Login is `POST /api/v1/auth/login`; send the returned bearer token on protected API requests. Access tokens expire after eight hours.

Instructors can create and list assignments. Students see active assignments, submit or update their own text submissions, and list only their own submissions. Instructors can list submissions for a given assignment. Submission files, AI grading, grade publication, and audit history are not yet implemented.

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

This is an initial API foundation, not a production grading service. The API now persists assignment and rubric-criterion records through SQLAlchemy, with PostgreSQL configuration, Docker Compose, and an Alembic initial migration. AI grading, grade publication, submission file storage, and persistent audit history are still not implemented. The rubric endpoint performs deterministic validation only; it does not assess student work or generate grades. Before using real academic records, add login throttling, password recovery, MFA, instructor/tenant ownership boundaries, audit logging, and a formal privacy/security review.
