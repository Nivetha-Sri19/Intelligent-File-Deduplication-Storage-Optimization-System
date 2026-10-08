from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.orm import Session
from app.core.constants import AuditAction, DeletionStatus, FileStatus
from app.core.exceptions import ConflictError, NotFoundError
from app.models.deletion_history import DeletionHistory
from app.repositories.deletion_repository import DeletionRepository
from app.services.audit_service import AuditService
from app.services.file_service import FileService
from app.storage.local_storage import LocalStorage
class DeletionService:
    def __init__(self): self.files=FileService(); self.history=DeletionRepository(); self.audit=AuditService(); self.storage=LocalStorage()
    def preview(self,db:Session,file_id:UUID,user_id:UUID):
        f=self.files.get_owned(db,file_id,user_id)
        membership=next(iter(f.duplicate_memberships),None)
        return {'file_id':f.id,'filename':f.original_filename,'size_bytes':f.size_bytes,'potential_storage_savings_bytes':membership.potential_savings_bytes if membership else f.size_bytes,'protected':f.is_protected}
    def delete(self,db:Session,file_id:UUID,user_id:UUID):
        f=self.files.get_owned(db,file_id,user_id)
        if f.is_protected: raise ConflictError('Protected files cannot be deleted')
        history=DeletionHistory(file_id=f.id,user_id=user_id,filename=f.original_filename,size_bytes=f.size_bytes,status=DeletionStatus.REQUESTED)
        self.history.create(db,history); db.commit()
        path=f.storage_path
        try:
            self.storage.delete(path); f.status=FileStatus.DELETED; f.deleted_at=datetime.now(timezone.utc); history.status=DeletionStatus.COMPLETED; history.deleted_at=f.deleted_at; self.audit.log(db,AuditAction.FILE_DELETE,user_id=user_id,file_id=f.id,details={'size_bytes':f.size_bytes}); db.commit(); return history
        except Exception as exc:
            db.rollback(); history=db.get(DeletionHistory,history.id); history.status=DeletionStatus.FAILED; history.reason=str(exc)[:500]; db.commit(); raise
