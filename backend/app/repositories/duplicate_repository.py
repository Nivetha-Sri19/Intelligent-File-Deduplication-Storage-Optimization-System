from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.duplicate_group import DuplicateGroup
from app.models.file import File
class DuplicateRepository:
    def get_members_for_hash(self,db:Session,owner_id:UUID,group_hash:str):
        return db.scalars(select(DuplicateGroup).join(File).where(File.owner_id==owner_id,DuplicateGroup.group_hash==group_hash,File.deleted_at.is_(None)).order_by(DuplicateGroup.is_original.desc(),File.uploaded_at.asc())).all()
    def get_group_hashes(self,db:Session,owner_id:UUID): return db.scalars(select(DuplicateGroup.group_hash).join(File).where(File.owner_id==owner_id,File.deleted_at.is_(None)).group_by(DuplicateGroup.group_hash)).all()
    def get_membership(self,db:Session,file_id:UUID): return db.scalar(select(DuplicateGroup).where(DuplicateGroup.file_id==file_id))
    def create(self,db:Session,obj:DuplicateGroup): db.add(obj); db.flush(); return obj
