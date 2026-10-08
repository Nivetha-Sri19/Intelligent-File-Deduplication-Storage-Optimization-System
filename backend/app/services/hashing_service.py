import hashlib
from pathlib import Path
from uuid import UUID
from sqlalchemy.orm import Session
from app.core.constants import FileStatus
from app.models.file_hash import FileHash
from app.models.file import File
from app.repositories.hash_repository import HashRepository
from app.services.duplicate_service import DuplicateService
from app.services.audit_service import AuditService
from app.core.constants import AuditAction
class HashingService:
    def __init__(self): self.hashes=HashRepository(); self.audit=AuditService()
    def calculate(self,path:Path,chunk_size:int)->str:
        digest=hashlib.sha256()
        with path.open('rb') as stream:
            while chunk:=stream.read(chunk_size): digest.update(chunk)
        return digest.hexdigest()
    def process(self,db:Session,file_id:UUID,chunk_size:int):
        file=db.get(File,file_id)
        if not file or file.deleted_at is not None: return
        file.status=FileStatus.PROCESSING; db.commit()
        try:
            value=self.calculate(Path(file.storage_path),chunk_size)
            existing=self.hashes.get_by_file(db,file.id)
            if existing: existing.hash_value=value
            else: self.hashes.create(db,FileHash(file_id=file.id,algorithm='sha256',hash_value=value))
            file.status=FileStatus.READY
            DuplicateService().rebuild_for_hash(db,file.owner_id,value)
            self.audit.log(db,AuditAction.FILE_HASHED,user_id=file.owner_id,file_id=file.id,details={'sha256':value})
            db.commit()
        except Exception:
            db.rollback(); file=db.get(File,file_id)
            if file: file.status=FileStatus.FAILED; db.commit()
            raise
