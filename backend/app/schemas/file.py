from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.core.constants import FileStatus
class FileResponse(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    id:UUID; original_filename:str; mime_type:str; extension:str; size_bytes:int; status:FileStatus; is_protected:bool; uploaded_at:datetime; deleted_at:datetime|None=None
class FileMetadataResponse(BaseModel):
    id:UUID; file_id:UUID; width:int|None=None; height:int|None=None; page_count:int|None=None; encoding:str|None=None; metadata_json:dict|None=None; created_at:datetime
class FileListResponse(BaseModel): items:list[FileResponse]; page:int; page_size:int; total:int; pages:int
class UploadResponse(BaseModel): file:FileResponse; task_id:str
