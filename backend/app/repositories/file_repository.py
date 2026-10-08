from datetime import datetime
from uuid import UUID
from sqlalchemy import and_, asc, desc, exists, func, select
from sqlalchemy.orm import Session
from app.models.file import File
from app.models.file_hash import FileHash
from app.models.duplicate_group import DuplicateGroup

class FileRepository:
    SORT_COLUMNS={"name":File.original_filename,"size":File.size_bytes,"uploaded_at":File.uploaded_at,"type":File.extension}
    def get(self,db:Session,file_id:UUID): return db.get(File,file_id)
    def list(self,db:Session,owner_id:UUID,page:int,page_size:int,search:str|None=None,extension:str|None=None,status:str|None=None,min_size:int|None=None,max_size:int|None=None,date_from:datetime|None=None,date_to:datetime|None=None,duplicate_only:bool=False,sort_by:str="uploaded_at",sort_order:str="desc"):
        q=select(File).where(File.owner_id==owner_id,File.deleted_at.is_(None))
        if search: q=q.where(File.original_filename.ilike(f"%{search}%"))
        if extension: q=q.where(File.extension==extension.lower().lstrip('.'))
        if status: q=q.where(File.status==status)
        if min_size is not None: q=q.where(File.size_bytes>=min_size)
        if max_size is not None: q=q.where(File.size_bytes<=max_size)
        if date_from is not None: q=q.where(File.uploaded_at>=date_from)
        if date_to is not None: q=q.where(File.uploaded_at<=date_to)
        if duplicate_only: q=q.where(exists(select(1).where(DuplicateGroup.file_id==File.id)))
        total=db.scalar(select(func.count()).select_from(q.subquery())) or 0
        column=self.SORT_COLUMNS.get(sort_by,self.SORT_COLUMNS["uploaded_at"])
        ordering=desc(column) if sort_order.lower()=="desc" else asc(column)
        items=db.scalars(q.order_by(ordering,File.id).offset((page-1)*page_size).limit(page_size)).all()
        return items,total
    def create(self,db:Session,file:File): db.add(file); db.flush(); return file
