from uuid import UUID
from pydantic import BaseModel
class DuplicateItem(BaseModel): file_id:UUID; filename:str; size_bytes:int; uploaded_at:str; is_original:bool
class DuplicateGroupResponse(BaseModel): group_hash:str; files:list[DuplicateItem]; storage_consumed_bytes:int; potential_savings_bytes:int
