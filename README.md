# GradeFlow

[![Frontend CI](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-ci.yml/badge.svg)](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-ci.yml)
[![Backend CI](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-backend-ci.yml/badge.svg)](https://github.com/CHARITHA6969/gradeflow/actions/workflows/gradeflow-backend-ci.yml)

**A React + FastAPI prototype for authenticated rubric-first assessment and student submission workflows.**

GradeFlow is a learning and product prototype focused on the workflow shared by instructors and students: creating assignments, defining rubric criteria, reviewing submissions, and communicating structured feedback.

> **Project status:** Prototype / in active development. The repository contains a React front end, a FastAPI backend, PostgreSQL/Alembic persistence, signed bearer sessions, role-based instructor/student access, assignment APIs, student text submissions, deterministic rubric validation, and a demo review workflow. It is not a production grading system and should not be used for consequential academic decisions.

## Why this project

Assessment workflows involve more than assigning a score. Instructors need consistent criteria and a review process; students need transparent feedback that explains strengths and areas to improve. GradeFlow explores how a structured rubric and an AI-assisted review step could support that process while keeping the instructor in control.

## Current interface

### Instructor experience
- Dashboard with assignment creation backed by FastAPI and PostgreSQL.
- Role-protected assignment listing and creation.
- Sample review modal still refuses to invent a grade without attached submission evidence.
- Assignment views and a new-assignment form concept.
- Rubric view with criteria and performance levels.
- Submission review modal that explicitly identifies sample records and refuses to invent a grade when no submission evidence is attached.

### Student experience
- Active assignments loaded from the API.
- Student text submissions persisted in the backend; students can update their own submission.
- Score breakdown by rubric criterion.
- Feedback view showing positive observations and improvement areas.
- Pending-assignment view.

## Technology

- **Frontend:** React
- **Backend:** Python, FastAPI, Pydantic, SQLAlchemy 2, signed bearer sessions
- **Authentication:** scrypt password hashes, eight-hour signed tokens, instructor/student role checks, private student signup code
- **Database:** PostgreSQL, SQLAlchemy ORM, Alembic migrations (SQLite supported for isolated tests)
- **API testing:** pytest, FastAPI TestClient, HTTPX
- **UI:** React components and CSS / inline styling
- **Testing foundation:** Create React App and React Testing Library dependencies
- **Assessment logic:** Standalone rubric-score validation utility with unit tests; no automated grading model is currently connected

## Repository layout

```text
gradeflow/
├── backend/                # FastAPI service, SQLAlchemy models, Alembic migrations, API tests
│   ├── app/\n│   │   ├── api/auth.py\n│   │   ├── api/submissions.py\n│   │   ├── core/security.py\n│   │   └── models/
│   ├── tests/
│   └── pyproject.toml
├── data.py                 # Small Pandas dataset exploration script
├── Titanic-Dataset.csv     # Dataset used by the exploratory script
└── gradeflow/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── InstructorDashboard.js
    │   │   ├── Login.js
    │   │   └── StudentView.js
    │   ├── App.js
    │   └── ...
    ├── package.json
    └── README.md
```

## Run locally

Prerequisites: Node.js and npm.

```bash
cd gradeflow
npm install
npm start
```

The development server starts at [http://localhost:3000](http://localhost:3000).

The login screen authenticates against FastAPI. Instructor accounts are provisioned by environment variables; students register with an administrator-issued signup code. The instructor dashboard reads and creates persisted assignments. The student dashboard lists active assignments and persists text submissions. Start the backend and PostgreSQL as described in `backend/README.md`; configure `REACT_APP_API_URL` only if the API is not at `http://localhost:8000`.

Create a production build:

```bash
npm run build
```

Run the existing test suite:

```bash
npm test
```

## Run the backend

Python 3.10+ is required.

```bash
cd backend
python -m venv .venv
# Activate the environment, then:
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload
```

- Health check: `http://127.0.0.1:8000/health`
- Interactive API docs: `http://127.0.0.1:8000/docs`
- Rubric validation: `POST /api/v1/rubrics/validate`

Run backend tests from the `backend/` directory with `pytest`. GitHub Actions has separate frontend and backend CI workflows configured to run tests and builds.

## Current limitations and engineering priorities

This repository is an early prototype. In particular:

- The UI currently uses hard-coded example assignments, submissions, and grades.
- Authentication is a prototype: signed bearer tokens and role checks are implemented, but login rate limiting, password reset, email verification, MFA, and tenant isolation are not yet implemented.
- The FastAPI backend persists assignments, rubric criteria, user accounts, and student submissions with SQLAlchemy and Alembic migrations. Submission content is currently text-only.
- The review modal is a demo placeholder. It does not generate grades; no submission evidence or grading backend is connected.
- AI grading, instructor review/finalization, grade publication, and audit history are not yet implemented. No AI-generated score is presented as a real grade.
- AI-generated feedback needs rubric-grounded evaluation, transparent evidence, human review, and an appeal/correction workflow.

### Roadmap

1. Separate UI components, domain data, and API/service logic.
2. Define assignment, submission, rubric, review, and feedback data models.
3. Add login rate limiting, password reset, MFA, tenant/ownership boundaries, and audit records.
4. Add attachment storage, secure review workflows, rubric-bound feedback, and instructor grade finalization.
5. Implement server-side AI orchestration with schema validation and traceable rubric evidence.
6. Add unit and integration tests for scoring, permissions, and failure cases.
7. Add CI checks, environment configuration, logging, and deployment documentation.

## Design principles

- Rubric-first assessment rather than opaque scores.
- Instructor approval for consequential grading decisions.
- Feedback that is specific, explainable, and actionable.
- Secure handling of student work and credentials.
- Reproducible development and transparent limitations.

---

This project is being developed incrementally. Contributions, issues, and practical suggestions are welcome.
