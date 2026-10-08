from pathlib import Path
from uuid import UUID
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.constants import AuditAction, FileStatus
from app.core.exceptions import NotFoundError, ValidationError
from app.models.file import File
from app.repositories.file_repository import FileRepository
from app.services.audit_service import AuditService
from app.storage.local_storage import LocalStorage
class FileService:
    def __init__(self): self.repo=FileRepository(); self.storage=LocalStorage(); self.audit=AuditService()
    def validate_upload(self,upload:UploadFile):
        filename=Path(upload.filename or '').name
        if not filename or filename in {'.','..'}: raise ValidationError('Invalid filename')
        ext=Path(filename).suffix.lower().lstrip('.')
        if ext not in settings.allowed_extension_set: raise ValidationError(f'File type .{ext} is not allowed')
        return filename,ext
    def create_upload(self,db:Session,owner_id:UUID,upload:UploadFile):
        filename,ext=self.validate_upload(upload); stored=self.storage.new_name(ext); path=self.storage.path(stored)
        size=self.storage.stream_to_disk(upload.file,path,settings.max_file_size_bytes)
        file=File(owner_id=owner_id,original_filename=filename,stored_filename=stored,storage_path=str(path),mime_type=upload.content_type or 'application/octet-stream',extension=ext,size_bytes=size,status=FileStatus.PENDING)
        try:
            self.repo.create(db,file); self.audit.log(db,AuditAction.FILE_UPLOAD,user_id=owner_id,file_id=file.id,details={'size_bytes':size}); db.commit(); db.refresh(file); return file
        except Exception:
            db.rollback(); self.storage.delete(path); raise
    def get_owned(self,db:Session,file_id:UUID,owner_id:UUID):
        file=self.repo.get(db,file_id)
        if not file or file.owner_id!=owner_id or file.deleted_at is not None: raise NotFoundError('File not found')
        return file
