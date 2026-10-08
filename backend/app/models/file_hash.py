from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
class FileHash(Base):
    __tablename__='file_hashes'
    id: Mapped[UUID]=mapped_column(primary_key=True,default=uuid4)
    file_id: Mapped[UUID]=mapped_column(ForeignKey('files.id',ondelete='CASCADE'),unique=True,nullable=False,index=True)
    algorithm: Mapped[str]=mapped_column(String(20),nullable=False,default='sha256')
    hash_value: Mapped[str]=mapped_column(String(64),nullable=False,index=True)
    calculated_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    file=relationship('File',back_populates='file_hash')
