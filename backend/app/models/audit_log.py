from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import DateTime, Enum, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.constants import AuditAction
from app.core.database import Base
class AuditLog(Base):
    __tablename__='audit_logs'
    id: Mapped[UUID]=mapped_column(primary_key=True,default=uuid4)
    user_id: Mapped[UUID|None]=mapped_column(ForeignKey('users.id',ondelete='SET NULL'),nullable=True,index=True)
    file_id: Mapped[UUID|None]=mapped_column(ForeignKey('files.id',ondelete='SET NULL'),nullable=True,index=True)
    action: Mapped[AuditAction]=mapped_column(Enum(AuditAction,name='audit_action'),nullable=False,index=True)
    ip_address: Mapped[str|None]=mapped_column(String(45),nullable=True)
    user_agent: Mapped[str|None]=mapped_column(String(500),nullable=True)
    details: Mapped[dict|None]=mapped_column(JSON,nullable=True)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False,index=True)
    user=relationship('User',back_populates='audit_logs'); file=relationship('File',back_populates='audit_logs')
