"""reset migration state

Revision ID: bc5fb14b4bbc
Revises: d7084aac5330
Create Date: 2025-07-26 16:41:35.836390

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc5fb14b4bbc'
down_revision = 'd7084aac5330'
branch_labels = None
depends_on = None


def upgrade():
    # This migration does nothing - just fixes the chain
    pass

def downgrade():
    pass
