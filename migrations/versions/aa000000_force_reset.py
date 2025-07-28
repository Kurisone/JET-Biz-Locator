"""force reset migration state

Revision ID: aa000000
Revises:
Create Date: 2025-07-26 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'aa000000'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Force reset alembic version regardless of current state
    try:
        # Try to delete existing version
        op.execute("DELETE FROM alembic_version WHERE 1=1")
    except:
        pass

    try:
        # Set to our target migration
        op.execute("INSERT INTO alembic_version (version_num) VALUES ('d7084aac5330')")
    except:
        pass

def downgrade():
    pass
