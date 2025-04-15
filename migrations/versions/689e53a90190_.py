"""empty message

Revision ID: 689e53a90190
Revises: 69c4b2b032cd
Create Date: 2025-04-11 10:13:05.360401

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '689e53a90190'
down_revision = '69c4b2b032cd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('general_data', schema=None) as batch_op:
        batch_op.alter_column('last_weight',
               existing_type=sa.REAL(),
               type_=sa.Float(precision=2),
               existing_nullable=True)
        batch_op.alter_column('last_height',
               existing_type=sa.REAL(),
               type_=sa.Float(precision=2),
               existing_nullable=True)
        batch_op.alter_column('BMI',
               existing_type=sa.REAL(),
               type_=sa.Float(precision=2),
               existing_nullable=True)

    with op.batch_alter_table('height', schema=None) as batch_op:
        batch_op.alter_column('height',
               existing_type=sa.REAL(),
               type_=sa.Float(precision=2),
               existing_nullable=False)

    with op.batch_alter_table('weight', schema=None) as batch_op:
        batch_op.alter_column('weight',
               existing_type=sa.REAL(),
               type_=sa.Float(precision=2),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('weight', schema=None) as batch_op:
        batch_op.alter_column('weight',
               existing_type=sa.Float(precision=2),
               type_=sa.REAL(),
               existing_nullable=False)

    with op.batch_alter_table('height', schema=None) as batch_op:
        batch_op.alter_column('height',
               existing_type=sa.Float(precision=2),
               type_=sa.REAL(),
               existing_nullable=False)

    with op.batch_alter_table('general_data', schema=None) as batch_op:
        batch_op.alter_column('BMI',
               existing_type=sa.Float(precision=2),
               type_=sa.REAL(),
               existing_nullable=True)
        batch_op.alter_column('last_height',
               existing_type=sa.Float(precision=2),
               type_=sa.REAL(),
               existing_nullable=True)
        batch_op.alter_column('last_weight',
               existing_type=sa.Float(precision=2),
               type_=sa.REAL(),
               existing_nullable=True)

    # ### end Alembic commands ###
