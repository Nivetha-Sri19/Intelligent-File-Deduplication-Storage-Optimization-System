from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import DateTime, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
class FileMetadata(Base):
    __tablename__='file_metadata'
    id: Mapped[UUID]=mapped_column(primary_key=True,default=uuid4)
    file_id: Mapped[UUID]=mapped_column(ForeignKey('files.id',ondelete='CASCADE'),unique=True,nullable=False,index=True)
    width: Mapped[int|None]=mapped_column(nullable=True)
    height: Mapped[int|None]=mapped_column(nullable=True)
    page_count: Mapped[int|None]=mapped_column(nullable=True)
    encoding: Mapped[str|None]=mapped_column(String(100),nullable=True)
    metadata_json: Mapped[dict|None]=mapped_column(JSON,nullable=True)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    file=relationship('File',back_populates='metadata_record')
