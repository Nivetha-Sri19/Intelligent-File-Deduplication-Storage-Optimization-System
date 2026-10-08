from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.deletion_history import DeletionHistory
class DeletionRepository:
    def create(self,db:Session,obj:DeletionHistory): db.add(obj); db.flush(); return obj
    def list(self,db:Session,user_id:UUID): return db.scalars(select(DeletionHistory).where(DeletionHistory.user_id==user_id).order_by(DeletionHistory.created_at.desc())).all()
