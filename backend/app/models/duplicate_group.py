from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
class DuplicateGroup(Base):
    __tablename__='duplicate_groups'
    id: Mapped[UUID]=mapped_column(primary_key=True,default=uuid4)
    file_id: Mapped[UUID]=mapped_column(ForeignKey('files.id',ondelete='CASCADE'),nullable=False,index=True)
    group_hash: Mapped[str]=mapped_column(String(64),nullable=False,index=True)
    is_original: Mapped[bool]=mapped_column(Boolean,default=False,nullable=False)
    storage_consumed_bytes: Mapped[int]=mapped_column(BigInteger,nullable=False,default=0)
    potential_savings_bytes: Mapped[int]=mapped_column(BigInteger,nullable=False,default=0)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    updated_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)
    file=relationship('File',back_populates='duplicate_memberships')
    __table_args__=(Index('ix_duplicate_groups_hash_original','group_hash','is_original'),)
