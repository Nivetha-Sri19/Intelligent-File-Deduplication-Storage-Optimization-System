from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from app.core.constants import DeletionStatus
class DeletionPreview(BaseModel): file_id:UUID; filename:str; size_bytes:int; potential_storage_savings_bytes:int; protected:bool
class DeletionResponse(BaseModel): history_id:UUID; file_id:UUID; status:DeletionStatus; storage_freed_bytes:int; deleted_at:datetime|None=None
