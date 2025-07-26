"""add missing user columns explicitly

Revision ID: 07d12f3ebf40
Revises: 2aee4068967b
Create Date: 2025-07-26 14:41:50.615782

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07d12f3ebf40'
down_revision = '2aee4068967b'
branch_labels = None
depends_on = None


def upgrade():
    # Check if columns exist before adding them
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('users')]

    with op.batch_alter_table('users', schema=None) as batch_op:
        if 'first_name' not in columns:
            batch_op.add_column(sa.Column('first_name', sa.String(length=50), nullable=True))
        if 'last_name' not in columns:
            batch_op.add_column(sa.Column('last_name', sa.String(length=50), nullable=True))
        if 'profile_image_url' not in columns:
            batch_op.add_column(sa.Column('profile_image_url', sa.String(length=255), nullable=True))
        if 'created_at' not in columns:
            batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))
        if 'updated_at' not in columns:
            batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('profile_image_url')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
