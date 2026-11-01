"""Create assignments and rubric criteria.

Revision ID: 0001_assignments
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_assignments"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "assignments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("total_points", sa.Float(), nullable=False),
        sa.Column("status", sa.String(length=24), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_assignments_id", "assignments", ["id"])
    op.create_index("ix_assignments_title", "assignments", ["title"])
    op.create_table(
        "rubric_criteria",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("assignment_id", sa.Integer(), sa.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("max_points", sa.Float(), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
    )


def downgrade():
    op.drop_table("rubric_criteria")
    op.drop_index("ix_assignments_title", table_name="assignments")
    op.drop_index("ix_assignments_id", table_name="assignments")
    op.drop_table("assignments")
