#!/bin/sh
set -eu

echo "Applying GradeFlow database migrations..."
alembic upgrade head

echo "Starting GradeFlow API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
