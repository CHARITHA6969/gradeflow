# GradeFlow API walkthrough

Base URL: `http://localhost:8000`

These examples use the local-only values from the root `.env.example`. Change them before using a shared environment. The examples use Bash/cURL syntax.

## 1. Sign in as the provisioned instructor

The first instructor account is created at API startup from the Compose environment values.

```bash
curl -sS http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@example.edu",
    "password": "local-instructor-password-123"
  }'
```

Copy the returned `access_token` into a shell variable:

```bash
export INSTRUCTOR_TOKEN="paste-token-here"
```

## 2. Create an assignment with a rubric

```bash
curl -sS http://localhost:8000/api/v1/assignments \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API design exercise",
    "description": "Design and document a small REST API.",
    "total_points": 20,
    "status": "Active",
    "criteria": [
      {"name": "Endpoint design", "max_points": 12},
      {"name": "Documentation", "max_points": 8}
    ]
  }'
```

Record the returned assignment ID.

## 3. Register a student

The signup code must match `GRADEFLOW_STUDENT_SIGNUP_CODE` in the API environment.

```bash
curl -sS http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.edu",
    "password": "student-password-12345",
    "signup_code": "local-student-signup-code"
  }'
```

Copy the returned token:

```bash
export STUDENT_TOKEN="paste-student-token-here"
```

## 4. Submit student work

Replace `ASSIGNMENT_ID` with the ID returned when creating the assignment.

```bash
curl -sS http://localhost:8000/api/v1/assignments/ASSIGNMENT_ID/submissions \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"I designed the endpoints and documented the request and response schemas."}'
```

## 5. Review submissions as the owning instructor

```bash
curl -sS http://localhost:8000/api/v1/assignments/ASSIGNMENT_ID/submissions \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN"
```

An instructor can view only assignments and submissions they own. A different instructor receives a 404 for another instructor's submission list.

## 6. Run the automated checks

```bash
cd backend
python -m pip install -e ".[dev]"
pytest
alembic upgrade head --sql
```

GitHub Actions additionally applies the migrations to PostgreSQL 16 and builds the backend and frontend container images.
