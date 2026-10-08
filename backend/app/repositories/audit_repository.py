from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
class AuditRepository:
    def create(self,db:Session,obj:AuditLog): db.add(obj); db.flush(); return obj
