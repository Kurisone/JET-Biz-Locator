"""add missing user columns explicitly

Revision ID: 07d12f3ebf40
Revises: 2aee4068967b
Create Date: 2025-07-26 14:41:50.615782

"""
from alembic import op
import sqlalchemy as sa
from alembic import context


# revision identifiers, used by Alembic.
revision = '07d12f3ebf40'
down_revision = '2aee4068967b'
branch_labels = None
depends_on = None


def upgrade():
    # Get the schema name if in production
    schema = context.get_x_argument(as_dictionary=True).get('schema', None)
    if schema is None:
        # Check if it is in production by looking for environment variables or config
        import os
        if os.environ.get('FLASK_ENV') == 'production':
            schema = os.environ.get('SCHEMA', 'yelp_schema')

    # Check if columns exist before adding them
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('users', schema=schema)]

    with op.batch_alter_table('users', schema=schema) as batch_op:
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
    schema = context.get_x_argument(as_dictionary=True).get('schema', None)
    if schema is None:
        import os
        if os.environ.get('FLASK_ENV') == 'production':
            schema = os.environ.get('SCHEMA', 'yelp_schema')

    with op.batch_alter_table('users', schema=schema) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('profile_image_url')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
