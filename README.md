# GradeFlow

[![Frontend CI](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-ci.yml/badge.svg)](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-ci.yml)
[![Backend CI](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-backend-ci.yml/badge.svg)](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-backend-ci.yml)

**A full-stack prototype for rubric-first assessment and student submission workflows.**

GradeFlow connects instructor and student workflows through a React application and a FastAPI service. The current implementation supports account access, assignment publishing, text submissions, and deterministic rubric validation.

## Product capabilities

### Instructor
- Sign in using an administrator-provisioned account.
- Create assignments and save them as drafts or publish them for students.
- View assignments through authenticated API endpoints.
- Retrieve submissions for an assignment.
- Review sample records without generating unsupported grades.

### Student
- Register using an administrator-issued signup code.
- View active assignments.
- Submit or update text-based assignment responses.
- View personal submission history.

### Backend
- Signed bearer sessions with role checks.
- Password hashing using scrypt.
- SQLAlchemy models for users, assignments, rubric criteria, and submissions.
- PostgreSQL-compatible database configuration and Alembic migrations.
- Deterministic rubric-score validation.
- FastAPI tests for access control, assignments, and submission workflows.

## Architecture

```text
React application
      |
      | JSON / bearer token
      v
FastAPI application
  ├── Authentication and role checks
  ├── Assignment API
  ├── Student submission API
  └── Rubric validation
      |
      v
SQLAlchemy ORM
      |
      v
PostgreSQL
  ├── users
  ├── assignments
  ├── rubric_criteria
  └── submissions
```

## Technology

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript |
| API | Python, FastAPI, Pydantic |
| Persistence | SQLAlchemy 2, PostgreSQL, Alembic |
| Authentication | scrypt password hashes, signed bearer tokens |
| Testing | React Testing Library, Jest, pytest, FastAPI TestClient |
| CI | GitHub Actions |

## Run locally

### 1. Start PostgreSQL

From the repository root:

```bash
cd backend
docker compose up -d db
```

### 2. Configure and run the API

From `backend/`, create a virtual environment and install dependencies:

```bash
python -m venv .venv
# Activate the environment, then:
python -m pip install -e ".[dev]"
```

Set the environment values using `backend/.env.example` as a reference. Do not commit real secrets. At minimum, configure:

- `DATABASE_URL`
- `CORS_ORIGINS`
- `GRADEFLOW_SECRET_KEY`
- `GRADEFLOW_INSTRUCTOR_EMAIL`
- `GRADEFLOW_INSTRUCTOR_PASSWORD`
- `GRADEFLOW_STUDENT_SIGNUP_CODE`

Apply migrations and start the API:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Start the React application

In another terminal:

```bash
cd gradeflow
npm install
npm start
```

Set `REACT_APP_API_URL` only when the API is hosted somewhere other than `http://localhost:8000`.

## Tests

Backend tests:

```bash
cd backend
pytest
```

Frontend tests and build:

```bash
cd gradeflow
npm test -- --watchAll=false
npm run build
```

The backend CI workflow also generates Alembic migration SQL and applies migrations against a CI SQLite database.

## Current limitations

This is an active prototype, not a production academic grading system.

- Submission content is text-only; file uploads and private object storage are not implemented.
- Instructor grading, grade finalization, grade publication, review history, and audit logs are not implemented.
- The review interface contains illustrative sample records and does not generate grades.
- Authentication needs additional production controls, including login throttling, password reset, email verification, MFA, token revocation, and tenant isolation.
- PostgreSQL configuration is present; CI migration verification currently uses SQLite rather than a live PostgreSQL service.

Do not use this prototype for consequential academic decisions or real student records without appropriate security, privacy, and institutional review.

## Engineering priorities

1. Add secure submission attachments and private storage.
2. Build rubric editing and versioned rubric criteria.
3. Implement evidence-grounded instructor review and grade finalization.
4. Add audit trails, token lifecycle controls, and stronger authorization boundaries.
5. Add a live PostgreSQL integration test environment and deployment monitoring.

---

[Portfolio](https://charitha6969.github.io/charithapittala.github.io) · [GitHub profile](https://github.com/CHARITHA6969)
