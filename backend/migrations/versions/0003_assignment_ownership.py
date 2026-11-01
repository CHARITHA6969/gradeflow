"""Add instructor ownership to assignments.

Revision ID: 0003_assignment_ownership
Revises: 0002_auth_submissions
"""
from alembic import op
import sqlalchemy as sa

revision = "0003_assignment_ownership"
down_revision = "0002_auth_submissions"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "assignments",
        sa.Column("instructor_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_assignments_instructor_id_users",
        "assignments",
        "users",
        ["instructor_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index(
        "ix_assignments_instructor_id",
        "assignments",
        ["instructor_id"],
    )

    # Preserve access to pre-existing assignments by assigning them to the
    # first provisioned instructor account, when one exists.
    op.execute(
        """
        UPDATE assignments
        SET instructor_id = (
            SELECT id
            FROM users
            WHERE role = 'instructor'
            ORDER BY id
            LIMIT 1
        )
        WHERE instructor_id IS NULL
        """
    )


def downgrade():
    op.drop_index("ix_assignments_instructor_id", table_name="assignments")
    op.drop_constraint(
        "fk_assignments_instructor_id_users",
        "assignments",
        type_="foreignkey",
    )
    op.drop_column("assignments", "instructor_id")
