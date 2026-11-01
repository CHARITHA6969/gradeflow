# GradeFlow API

FastAPI service for the GradeFlow assessment workflow.

## Recommended: run the complete application

From the repository root, use Docker Compose:

```bash
docker compose up --build
```

The first run builds the API and frontend images, waits for PostgreSQL health, applies Alembic migrations, and starts the services.

- Frontend: http://localhost:3000
- API health: http://localhost:8000/health
- OpenAPI docs: http://localhost:8000/docs

The Compose configuration provisions a local instructor account and student signup code for development. See the root README for the local-only credentials and override instructions. Never reuse those values in a shared or production environment.

## Run only the backend locally

Requirements: Python 3.12 and PostgreSQL 16 (or a compatible configured database).

```bash
cd backend
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
```

Start PostgreSQL and set the configuration. Copy `.env.example` as a reference; values must be supplied to the shell or runtime because the application does not load a dotenv file automatically.

PowerShell:

```powershell
$env:DATABASE_URL="postgresql+psycopg://gradeflow:gradeflow_dev@localhost:5432/gradeflow"
$env:CORS_ORIGINS="http://localhost:3000"
$env:GRADEFLOW_SECRET_KEY="replace-with-a-long-random-secret"
$env:GRADEFLOW_INSTRUCTOR_EMAIL="instructor@your-university.edu"
$env:GRADEFLOW_INSTRUCTOR_PASSWORD="use-a-unique-password-of-12-or-more-characters"
$env:GRADEFLOW_STUDENT_SIGNUP_CODE="issue-a-private-registration-code"
```

macOS/Linux:

```bash
export DATABASE_URL="postgresql+psycopg://gradeflow:gradeflow_dev@localhost:5432/gradeflow"
export CORS_ORIGINS="http://localhost:3000"
export GRADEFLOW_SECRET_KEY="replace-with-a-long-random-secret"
export GRADEFLOW_INSTRUCTOR_EMAIL="instructor@your-university.edu"
export GRADEFLOW_INSTRUCTOR_PASSWORD="use-a-unique-password-of-12-or-more-characters"
export GRADEFLOW_STUDENT_SIGNUP_CODE="issue-a-private-registration-code"
```

Apply migrations and launch the API:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

## Tests

```bash
pytest
```

The API tests use isolated in-memory SQLite databases. GitHub Actions additionally verifies Alembic migration generation and application against PostgreSQL 16.

## Security notes

The API includes role checks, signed eight-hour bearer sessions, scrypt password hashes, and instructor-level assignment ownership. The Compose credentials are development-only. Before a shared deployment, set unique secrets and passwords, restrict network access, and add login throttling, password reset, MFA, audit logging, and institution/tenant governance.
