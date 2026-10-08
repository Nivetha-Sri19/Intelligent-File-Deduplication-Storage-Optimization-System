"""${message}"""
revision: str = ${repr(up_revision)}
down_revision: Union[str, Sequence[str], None] = ${repr(down_revision)}
branch_labels: Union[str, Sequence[str], None] = ${repr(branch_labels)}
depends_on: Union[str, Sequence[str], None] = ${repr(depends_on)}
from alembic import op
import sqlalchemy as sa
${imports or ''}
def upgrade() -> None:
    ${upgrades if upgrades else 'pass'}
def downgrade() -> None:
    ${downgrades if downgrades else 'pass'}
