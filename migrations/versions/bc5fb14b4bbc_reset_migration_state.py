"""reset migration state

Revision ID: bc5fb14b4bbc
Revises: d7084aac5330
Create Date: 2025-07-26 16:41:35.836390

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc5fb14b4bbc'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Reset the alembic version to match new migration
    op.execute("DELETE FROM alembic_version")
    op.execute("INSERT INTO alembic_version (version_num) VALUES ('d7084aac5330')")


def downgrade():
    pass
