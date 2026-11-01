# GradeFlow

**A React prototype exploring AI-assisted assessment and grading workflows.**

GradeFlow is a learning and product prototype focused on the workflow shared by instructors and students: creating assignments, defining rubric criteria, reviewing submissions, and communicating structured feedback.

> **Project status:** Prototype / in active development. The current repository contains a React front end with sample data and an experimental AI-review interaction. It is not a production grading system and should not be used for consequential academic decisions.

## Why this project

Assessment workflows involve more than assigning a score. Instructors need consistent criteria and a review process; students need transparent feedback that explains strengths and areas to improve. GradeFlow explores how a structured rubric and an AI-assisted review step could support that process while keeping the instructor in control.

## Current interface

### Instructor experience
- Dashboard with example assignment and submission summaries.
- Assignment views and a new-assignment form concept.
- Rubric view with criteria and performance levels.
- Submission review modal with a structured score breakdown and feedback summary.

### Student experience
- Grade overview and assignment status.
- Score breakdown by rubric criterion.
- Feedback view showing positive observations and improvement areas.
- Pending-assignment view.

## Technology

- **Frontend:** React
- **UI:** React components and CSS / inline styling
- **Testing foundation:** Create React App and React Testing Library dependencies
- **AI exploration:** An early Anthropic API request is present in the instructor review flow

## Repository layout

```text
gradeflow/
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

Create a production build:

```bash
npm run build
```

Run the existing test suite:

```bash
npm test
```

## Current limitations and engineering priorities

This repository is an early prototype. In particular:

- The UI currently uses hard-coded example assignments, submissions, and grades.
- The login screen is a role-selection demo, not real authentication or authorization.
- There is no production backend, database, or persistent submission store in the current application.
- The AI review path is experimental. It must not be treated as a validated grading model.
- The current browser-side API approach is not suitable for production secrets. API credentials should be held by a secured server-side service, never shipped to the browser.
- AI-generated feedback needs rubric-grounded evaluation, transparent evidence, human review, and an appeal/correction workflow.

### Roadmap

1. Separate UI components, domain data, and API/service logic.
2. Define assignment, submission, rubric, review, and feedback data models.
3. Add a secure backend and proper instructor/student authorization.
4. Implement server-side AI orchestration with schema validation and traceable rubric evidence.
5. Add unit and integration tests for scoring, permissions, and failure cases.
6. Add CI checks, environment configuration, logging, and deployment documentation.

## Design principles

- Rubric-first assessment rather than opaque scores.
- Instructor approval for consequential grading decisions.
- Feedback that is specific, explainable, and actionable.
- Secure handling of student work and credentials.
- Reproducible development and transparent limitations.

---

This project is being developed incrementally. Contributions, issues, and practical suggestions are welcome.
