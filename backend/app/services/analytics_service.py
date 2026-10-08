from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.core.constants import FileStatus
from app.models.file import File
from app.models.duplicate_group import DuplicateGroup
class AnalyticsService:
    def dashboard(self,db:Session,owner_id:UUID):
        base=select(File).where(File.owner_id==owner_id,File.deleted_at.is_(None),File.status!='deleted')
        total_files=db.scalar(select(func.count()).select_from(base.subquery())) or 0
        total_storage=db.scalar(select(func.coalesce(func.sum(File.size_bytes),0)).where(File.owner_id==owner_id,File.deleted_at.is_(None),File.status!='deleted')) or 0
        dup_ids=db.scalars(select(DuplicateGroup.file_id).join(File).where(File.owner_id==owner_id,File.deleted_at.is_(None),DuplicateGroup.is_original.is_(False))).all()
        duplicate_files=len(dup_ids); duplicate_storage=db.scalar(select(func.coalesce(func.sum(File.size_bytes),0)).where(File.id.in_(dup_ids))) if dup_ids else 0
        savings=db.scalar(select(func.coalesce(func.sum(DuplicateGroup.potential_savings_bytes),0)).join(File).where(File.owner_id==owner_id,File.deleted_at.is_(None),DuplicateGroup.is_original.is_(True))) or 0
        largest=db.scalars(select(File).where(File.owner_id==owner_id,File.deleted_at.is_(None)).order_by(File.size_bytes.desc()).limit(5)).all()
        recent=db.scalars(select(File).where(File.owner_id==owner_id,File.deleted_at.is_(None)).order_by(File.uploaded_at.desc()).limit(5)).all()
        return {'total_files':total_files,'total_storage_bytes':int(total_storage),'duplicate_files':duplicate_files,'duplicate_storage_bytes':int(duplicate_storage or 0),'potential_storage_savings_bytes':int(savings),'largest_files':[{'id':str(x.id),'filename':x.original_filename,'size_bytes':x.size_bytes} for x in largest],'recent_uploads':[{'id':str(x.id),'filename':x.original_filename,'uploaded_at':x.uploaded_at.isoformat()} for x in recent]}
