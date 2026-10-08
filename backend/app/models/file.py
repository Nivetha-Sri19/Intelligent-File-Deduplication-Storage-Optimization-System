from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.constants import FileStatus
from app.core.database import Base
class File(Base):
    __tablename__='files'
    id: Mapped[UUID]=mapped_column(primary_key=True,default=uuid4)
    owner_id: Mapped[UUID]=mapped_column(ForeignKey('users.id',ondelete='CASCADE'),nullable=False,index=True)
    original_filename: Mapped[str]=mapped_column(String(255),nullable=False)
    stored_filename: Mapped[str]=mapped_column(String(255),unique=True,nullable=False)
    storage_path: Mapped[str]=mapped_column(String(1024),nullable=False)
    mime_type: Mapped[str]=mapped_column(String(255),nullable=False)
    extension: Mapped[str]=mapped_column(String(20),nullable=False,index=True)
    size_bytes: Mapped[int]=mapped_column(BigInteger,nullable=False)
    status: Mapped[FileStatus]=mapped_column(String(20),default=FileStatus.PENDING,nullable=False,index=True)
    is_protected: Mapped[bool]=mapped_column(Boolean,default=False,nullable=False)
    uploaded_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False,index=True)
    updated_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)
    deleted_at: Mapped[datetime|None]=mapped_column(DateTime(timezone=True),nullable=True)
    owner=relationship('User',back_populates='files')
    file_hash=relationship('FileHash',back_populates='file',uselist=False,cascade='all, delete-orphan')
    metadata_record=relationship('FileMetadata',back_populates='file',uselist=False,cascade='all, delete-orphan')
    duplicate_memberships=relationship('DuplicateGroup',back_populates='file')
    deletion_history=relationship('DeletionHistory',back_populates='file')
    audit_logs=relationship('AuditLog',back_populates='file')
    __table_args__=(Index('ix_files_owner_status','owner_id','status'),Index('ix_files_owner_uploaded_at','owner_id','uploaded_at'),Index('ix_files_owner_filename','owner_id','original_filename'))
