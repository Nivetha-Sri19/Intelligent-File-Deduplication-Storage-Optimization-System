from uuid import UUID

from app.core.config import settings
from app.core.database import SessionLocal
from app.services.hashing_service import HashingService
from app.workers.celery_app import celery_app


@celery_app.task(
    bind=True,
    autoretry_for=(OSError,),
    retry_backoff=True,
    max_retries=3,
)
def hash_file_task(self, file_id: str):
    db = SessionLocal()

    try:
        file_uuid = UUID(file_id)

        HashingService().process(
            db,
            file_uuid,
            settings.chunk_size_bytes,
        )

        return {
            "file_id": file_id,
            "status": "completed",
        }

    finally:
        db.close()