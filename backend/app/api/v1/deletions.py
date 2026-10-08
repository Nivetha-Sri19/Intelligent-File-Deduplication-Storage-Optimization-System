from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.deletion import DeletionPreview, DeletionResponse
from app.services.deletion_service import DeletionService
router=APIRouter(prefix='/deletions',tags=['Safe Deletion'])

@router.get('/history')
def history(db:Session=Depends(get_db),user:User=Depends(get_current_user)): return DeletionService().history.list(db,user.id)

@router.get('/{file_id}/preview',response_model=DeletionPreview)
def preview(file_id:UUID,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return DeletionService().preview(db,file_id,user.id)
@router.delete('/{file_id}',response_model=DeletionResponse)
def delete(file_id:UUID,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    h=DeletionService().delete(db,file_id,user.id); return {'history_id':h.id,'file_id':h.file_id,'status':h.status,'storage_freed_bytes':h.size_bytes if h.status.value=='completed' else 0,'deleted_at':h.deleted_at}
