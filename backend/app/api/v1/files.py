from datetime import datetime
from math import ceil
from uuid import UUID
from fastapi import APIRouter, Depends, File as UploadFileParam, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.core.constants import AuditAction
from app.core.database import get_db
from app.models.user import User
from app.schemas.file import FileListResponse, FileMetadataResponse, FileResponse, UploadResponse
from app.services.audit_service import AuditService
from app.services.file_service import FileService
from app.storage.local_storage import LocalStorage
from app.workers.tasks.file_tasks import hash_file_task
router=APIRouter(prefix='/files',tags=['Files'])
@router.post('/upload',response_model=UploadResponse,status_code=201)
def upload(file:UploadFile=UploadFileParam(...),db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    obj=FileService().create_upload(db,user.id,file); task=hash_file_task.delay(str(obj.id)); return {'file':obj,'task_id':task.id}
@router.get('',response_model=FileListResponse)
def list_files(page:int=Query(1,ge=1),page_size:int=Query(20,ge=1,le=100),search:str|None=None,extension:str|None=None,status:str|None=None,min_size:int|None=Query(None,ge=0),max_size:int|None=Query(None,ge=0),date_from:datetime|None=None,date_to:datetime|None=None,duplicate_only:bool=False,sort_by:str=Query('uploaded_at',pattern='^(name|size|uploaded_at|type)$'),sort_order:str=Query('desc',pattern='^(asc|desc)$'),db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    from datetime import datetime
    parsed_from=datetime.fromisoformat(date_from) if date_from else None
    parsed_to=datetime.fromisoformat(date_to) if date_to else None
    items,total=FileService().repo.list(db,user.id,page,page_size,search,extension,status,min_size,max_size,parsed_from,parsed_to,duplicate_only,sort_by,sort_order); return {'items':items,'page':page,'page_size':page_size,'total':total,'pages':ceil(total/page_size) if total else 0}
@router.get('/{file_id}/metadata',response_model=FileMetadataResponse)
def metadata(file_id:UUID,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    f=FileService().get_owned(db,file_id,user.id)
    return f.metadata_record or {'id':file_id,'file_id':file_id,'created_at':f.uploaded_at}
@router.get('/{file_id}',response_model=FileResponse)
def get_file(file_id:UUID,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return FileService().get_owned(db,file_id,user.id)
@router.get('/{file_id}/download')
def download(file_id:UUID,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    f=FileService().get_owned(db,file_id,user.id); stream=LocalStorage().open(f.storage_path); AuditService().log(db,AuditAction.FILE_DOWNLOAD,user_id=user.id,file_id=f.id); db.commit(); return StreamingResponse(stream,media_type=f.mime_type,headers={'Content-Disposition':f'attachment; filename="{f.original_filename}"'})
