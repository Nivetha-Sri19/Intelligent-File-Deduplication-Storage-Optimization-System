from uuid import UUID
from sqlalchemy.orm import Session
from app.core.constants import AuditAction
from app.models.audit_log import AuditLog
from app.repositories.audit_repository import AuditRepository
class AuditService:
    def __init__(self): self.repo=AuditRepository()
    def log(self,db:Session,action:AuditAction,user_id:UUID|None=None,file_id:UUID|None=None,ip_address:str|None=None,user_agent:str|None=None,details:dict|None=None):
        self.repo.create(db,AuditLog(user_id=user_id,file_id=file_id,action=action,ip_address=ip_address,user_agent=user_agent,details=details))
