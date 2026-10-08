from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, String, BigInteger, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import DeletionStatus
from app.core.database import Base


class DeletionHistory(Base):
    __tablename__ = "deletion_history"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    file_id: Mapped[UUID] = mapped_column(
        ForeignKey("files.id"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    size_bytes: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
    )

    status: Mapped[DeletionStatus] = mapped_column(
        Enum(
            DeletionStatus,
            name="deletion_status",
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ],
        ),
        nullable=False,
    )

    reason: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    file = relationship(
        "File",
        back_populates="deletion_history",
    )

    user = relationship(
        "User",
        back_populates="deletion_history",
    )