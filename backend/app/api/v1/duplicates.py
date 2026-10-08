from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.services.duplicate_service import DuplicateService
router=APIRouter(prefix='/duplicates',tags=['Duplicates'])
@router.get('')
def duplicate_groups(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    groups=DuplicateService().groups(db,user.id)
    return [{'group_hash':g['group_hash'],'files':[{'file_id':str(m.file.id),'filename':m.file.original_filename,'size_bytes':m.file.size_bytes,'uploaded_at':m.file.uploaded_at.isoformat(),'is_original':m.is_original} for m in g['files']],'storage_consumed_bytes':g['storage_consumed_bytes'],'potential_savings_bytes':g['potential_savings_bytes']} for g in groups]
